import { NextResponse } from 'next/server'

// Creator-only: returns the RTMP ingest details. Gated with the same UPLOAD_KEY
// used by the /upload page so only John can broadcast.
export async function GET(req: Request) {
  const key = req.headers.get('x-creator-key')
  if (!process.env.UPLOAD_KEY || key !== process.env.UPLOAD_KEY) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }
  return NextResponse.json({
    server: process.env.GLOWX_RTMP_SERVER || null,
    streamKey: process.env.GLOWX_STREAM_KEY || null,
  })
}
