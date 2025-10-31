import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ message: 'API test endpoint working', timestamp: new Date().toISOString() });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      message: 'POST test endpoint working', 
      received: body,
      timestamp: new Date().toISOString() 
    });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }
}

