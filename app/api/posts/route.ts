import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { readPosts, addPost, deletePost } from '@/lib/posts'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const UPLOAD_DIR = process.env.GLOWX_DATA_DIR
  ? path.join(process.env.GLOWX_DATA_DIR, 'uploads')
  : path.join(process.cwd(), 'public', 'uploads')
const MAX_IMAGES = 10
const MAX_FILE_SIZE = 15 * 1024 * 1024
const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

function authorized(req: Request): boolean {
  const expected = process.env.UPLOAD_KEY
  if (!expected) return false
  return req.headers.get('x-upload-key') === expected
}

export async function GET() {
  return NextResponse.json({ posts: readPosts() })
}

export async function POST(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Wrong or missing upload key' }, { status: 401 })
  }

  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Expected form-data' }, { status: 400 })
  }

  const text = String(form.get('text') || '').trim().slice(0, 5000)
  const author = String(form.get('author') || '').trim().slice(0, 60) || 'GlowX'
  const isAi = form.get('isAi') === 'true'
  const files = form.getAll('images').filter((f): f is File => f instanceof File && f.size > 0)

  if (!text && files.length === 0) {
    return NextResponse.json({ error: 'Post needs text or at least one image' }, { status: 400 })
  }
  if (files.length > MAX_IMAGES) {
    return NextResponse.json({ error: `Max ${MAX_IMAGES} images per post` }, { status: 400 })
  }

  const urls: string[] = []
  for (const file of files) {
    const ext = EXT_BY_MIME[file.type]
    if (!ext) {
      return NextResponse.json({ error: `Unsupported image type: ${file.type}` }, { status: 400 })
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `Image too large (max 15 MB): ${file.name}` }, { status: 400 })
    }
    const name = `${crypto.randomUUID()}.${ext}`
    fs.mkdirSync(UPLOAD_DIR, { recursive: true })
    fs.writeFileSync(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()))
    urls.push(`/api/uploads/${name}`)
  }

  const post = addPost({
    id: crypto.randomUUID(),
    author,
    text,
    images: urls,
    isAi,
    createdAt: new Date().toISOString(),
  })
  return NextResponse.json({ post })
}

export async function DELETE(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ error: 'Wrong or missing upload key' }, { status: 401 })
  }
  const id = new URL(req.url).searchParams.get('id') || ''
  const removed = deletePost(id)
  if (!removed) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }
  for (const url of removed.images) {
    const name = path.basename(url)
    try {
      fs.unlinkSync(path.join(UPLOAD_DIR, name))
    } catch {}
  }
  return NextResponse.json({ ok: true })
}
