import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { getUploadUrl } from '@/lib/r2'

const ALLOWED_IMAGE = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const ALLOWED_VIDEO = ['video/mp4', 'video/quicktime', 'video/webm']

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const creator = await prisma.creator.findUnique({ where: { userId: session.user.id } })
  if (!creator) return NextResponse.json({ error: 'Creator only' }, { status: 403 })

  const { contentType, size } = await req.json()

  // Validate content type
  const isImage = ALLOWED_IMAGE.includes(contentType)
  const isVideo = ALLOWED_VIDEO.includes(contentType)
  if (!isImage && !isVideo) {
    return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 })
  }

  // Size limits: 50MB images, 4GB videos
  const maxSize = isVideo ? 4 * 1024 * 1024 * 1024 : 50 * 1024 * 1024
  if (size > maxSize) {
    return NextResponse.json({ error: 'File too large' }, { status: 400 })
  }

  const { uploadUrl, publicUrl, key } = await getUploadUrl(
    creator.id,
    isVideo ? 'video' : 'image',
    contentType
  )

  return NextResponse.json({ uploadUrl, publicUrl, key })
}
