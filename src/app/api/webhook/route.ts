import { NextRequest, NextResponse } from 'next/server';
import ollama from "ollama"

const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    return new Response(challenge, { status: 200 });
  }
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  if (body.object !== 'page') {
    return NextResponse.json({ error: 'Not a page event' }, { status: 404 });
  }

  for (const entry of body.entry) {
    const webhookEvent = entry.messaging[0];
    const senderId = webhookEvent.sender.id;
    const messageText = webhookEvent.message?.text;

    if (messageText) {
      console.log(`From: ${senderId} — ${messageText}`);

      const reply = await getAutoReply(messageText);

      await sendReply(senderId, reply);
    }
  }

  return NextResponse.json({ status: 'ok' });
}

export async function getAutoReply(messageText: any) {
  const text = messageText.toLowerCase();

  try {
    const systemInstruction = `Your message must be less than or equal to 2000 `

    const response = await ollama.chat({
      model: 'llama3.2',
      messages: [{ role: 'user', content: `Instruction: ${systemInstruction}\n\nUser question: ${text}` }],
    })

    return response.message.content.replace(/\*/g, '').toString() || ''
  } catch (error) {
    console.log(error)
  }
}

export async function sendReply(recipientId: any, message: any) {
  const response = await fetch(
    'https://graph.facebook.com/v19.0/me/messages',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PAGE_ACCESS_TOKEN}`
      },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text: message }
      })
    }
  );

  const data = await response.json();
  console.log('Reply sent:', data);
  return data;
}