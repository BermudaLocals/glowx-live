import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

// Public live status — viewers poll this. No secrets beyond the playback URL,
// which is inherently visible to anyone watching the stream anyway.
export async function GET() {
  const base = process.env.GLOWX_STREAM_BASE
  const key = process.env.GLOWX_STREAM_KEY
  if (!base || !key) {
    return NextResponse.json({ live: false, configured: false })
  }
  try {
    const r = await fetch(`${base}/api/streams`, { cache: 'no-store' })
    const d = await r.json()
    const s = d?.live?.[key]
    const live = !!s?.publisher
    return NextResponse.json({
      live,
      viewers: live ? (s?.subscribers?.length || 0) : 0,
      hlsUrl: live ? `${base}/live/${key}/index.m3u8` : null,
    })
  } catch {
    return NextResponse.json({ live: false, error: 'stream server unreachable' }, { status: 502 })
  }
}
