import { NextResponse } from 'next/server';
import Pusher from 'pusher';

export async function POST(req: Request) {
  try {
    const appId = process.env.PUSHER_APP_ID;
    const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
    const secret = process.env.PUSHER_SECRET;
    const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    if (!appId || !key || !secret || !cluster) {
      console.warn('Pusher credentials missing in environment variables. Real-time multiplayer is unavailable.');
      return new NextResponse('Pusher configuration incomplete', { status: 503 });
    }

    const pusher = new Pusher({
      appId,
      key,
      secret,
      cluster,
      useTLS: true,
    });

    // Parse urlencoded request body from Pusher JS client
    const bodyText = await req.text();
    const params = new URLSearchParams(bodyText);
    const socketId = params.get('socket_id');
    const channelName = params.get('channel_name');
    
    // Read user name from URL query parameter
    const { searchParams } = new URL(req.url);
    const displayName = searchParams.get('name') || 'Loki Cadet';

    if (!socketId || !channelName) {
      return new NextResponse('Missing socket_id or channel_name', { status: 400 });
    }

    // Generate unique user ID for this session
    const userId = `cadet_${Math.random().toString(36).substring(2, 9)}`;
    
    // Authorize presence channel subscription
    const authResponse = pusher.authorizeChannel(socketId, channelName, {
      user_id: userId,
      user_info: {
        name: displayName,
      },
    });

    return NextResponse.json(authResponse);
  } catch (error) {
    console.error('Pusher auth error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
