import { NextRequest, NextResponse } from 'next/server';

const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

export async function POST(req: NextRequest) {
  const { recipientId, message } = await req.json();

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
        message:   { text: message }
      })
    }
  );

  const data = await response.json();
  return NextResponse.json({ success: true, data });
}