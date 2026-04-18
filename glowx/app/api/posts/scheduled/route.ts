import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { schedulePost } from '@/lib/scheduler'

// GET /api/posts/scheduled — list scheduled posts for creator
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const creator = await prisma.creator.findUnique({ where: { userId: session.user.id } })
  if (!creator) return NextResponse.json({ error: 'Creator only' }, { status: 403 })

  const posts = await prisma.scheduledPost.findMany({
    where: { creatorId: creator.id },
    orderBy: { scheduledAt: 'asc' },
  })

  // Count today's scheduled posts
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0)
  const todayEnd   = new Date(); todayEnd.setHours(23, 59, 59, 999)
  const todayCount = posts.filter(p =>
    p.scheduledAt >= todayStart && p.scheduledAt <= todayEnd
  ).length

  return NextResponse.json({ posts, todayCount, dailyLimit: 9 })
}

// POST /api/posts/scheduled — create a scheduled post
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const creator = await prisma.creator.findUnique({ where: { userId: session.user.id } })
  if (!creator) return NextResponse.json({ error: 'Creator only' }, { status: 403 })

  const body = await req.json()
  const { title, content, mediaUrls = [], isPPV, ppvPrice, platforms = ['glowx'], scheduledAt } = body

  if (!scheduledAt) return NextResponse.json({ error: 'scheduledAt required' }, { status: 400 })

  const publishAt = new Date(scheduledAt)
  if (publishAt <= new Date()) return NextResponse.json({ error: 'Scheduled time must be in the future' }, { status: 400 })

  // Check daily limit (9 posts/day)
  const dayStart = new Date(publishAt); dayStart.setHours(0, 0, 0, 0)
  const dayEnd   = new Date(publishAt); dayEnd.setHours(23, 59, 59, 999)
  const dayCount = await prisma.scheduledPost.count({
    where: { creatorId: creator.id, scheduledAt: { gte: dayStart, lte: dayEnd }, status: 'pending' },
  })
  if (dayCount >= 9) return NextResponse.json({ error: 'Daily limit of 9 posts reached for this day' }, { status: 429 })

  const scheduled = await prisma.scheduledPost.create({
    data: {
      creatorId: creator.id,
      title,
      body: content,
      mediaUrls,
      isPPV: isPPV ?? false,
      ppvPrice: isPPV ? ppvPrice : null,
      platforms,
      scheduledAt: publishAt,
      status: 'pending',
    },
  })

  // Add to BullMQ queue
  const jobId = await schedulePost({
    scheduledPostId: scheduled.id,
    creatorId: creator.id,
    publishAt,
  })

  await prisma.scheduledPost.update({ where: { id: scheduled.id }, data: { jobId } })

  return NextResponse.json({ scheduled }, { status: 201 })
}

// DELETE /api/posts/scheduled?id= — cancel a scheduled post
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const creator = await prisma.creator.findUnique({ where: { userId: session.user.id } })
  const post = await prisma.scheduledPost.findFirst({ where: { id, creatorId: creator?.id } })
  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.scheduledPost.update({ where: { id }, data: { status: 'cancelled' } })
  return NextResponse.json({ ok: true })
}
