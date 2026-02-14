import { NextRequest, NextResponse } from 'next/server';

const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode      = searchParams.get('hub.mode');
  const token     = searchParams.get('hub.verify_token');
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

    if (webhookEvent.message) {
      console.log(`Message from ${senderId}: ${webhookEvent.message.text}`);
    }
  }

  return NextResponse.json({ status: 'ok' });
}