import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const UPLOAD_DIR = process.env.GLOWX_DATA_DIR
  ? path.join(process.env.GLOWX_DATA_DIR, 'uploads')
  : path.join(process.cwd(), 'public', 'uploads')

const MIME_BY_EXT: Record<string, string> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
}

export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const name = path.basename(params.name)
  const ext = name.split('.').pop()?.toLowerCase() || ''
  const mime = MIME_BY_EXT[ext]
  const filePath = path.join(UPLOAD_DIR, name)
  if (!mime || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const data = fs.readFileSync(filePath)
  return new NextResponse(data, {
    headers: {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
