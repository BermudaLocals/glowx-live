import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { sendPushToCreatorSubscribers } from '@/lib/webpush'
import { triggerNewPost } from '@/lib/pusher'
import { notifyFanNewPost } from '@/lib/twilio'

// GET /api/posts — feed for authenticated fan
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  const { searchParams } = new URL(req.url)
  const creatorId = searchParams.get('creatorId')
  const cursor    = searchParams.get('cursor')
  const limit     = Math.min(parseInt(searchParams.get('limit') ?? '12'), 50)

  const where: any = creatorId
    ? { creatorId, publishedAt: { lte: new Date() } }
    : { publishedAt: { lte: new Date() }, visibility: 'PUBLIC' }

  if (session?.user?.id && !creatorId) {
    // Get creator IDs this fan is subscribed to
    const subs = await prisma.subscription.findMany({
      where: { fanId: session.user.id, status: 'ACTIVE' },
      select: { creatorId: true },
    })
    const subIds = subs.map(s => s.creatorId)
    where.OR = [
      { visibility: 'PUBLIC' },
      { creatorId: { in: subIds }, visibility: { in: ['SUBSCRIBERS', 'PPV'] } },
    ]
    delete where.visibility
  }

  const posts = await prisma.post.findMany({
    where,
    take: limit + 1,
    ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    orderBy: { publishedAt: 'desc' },
    include: {
      creator: { select: { id: true, handle: true, displayName: true, avatarUrl: true, isVerified: true } },
      _count: { select: { purchases: true } },
    },
  })

  const hasMore = posts.length > limit
  if (hasMore) posts.pop()
  const nextCursor = hasMore ? posts[posts.length - 1].id : null

  // Mask PPV media URLs for non-purchasers
  const fanId = session?.user?.id
  const postIds = posts.filter(p => p.isPPV).map(p => p.id)
  const purchases = fanId && postIds.length
    ? await prisma.purchase.findMany({ where: { fanId, postId: { in: postIds } }, select: { postId: true } })
    : []
  const purchased = new Set(purchases.map(p => p.postId))

  const sanitized = posts.map(p => ({
    ...p,
    mediaUrls: p.isPPV && !purchased.has(p.id) ? [] : p.mediaUrls,
    isLocked: p.isPPV && !purchased.has(p.id),
  }))

  return NextResponse.json({ posts: sanitized, nextCursor })
}

// POST /api/posts — create a new post
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const creator = await prisma.creator.findUnique({ where: { userId: session.user.id } })
  if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 })

  const body = await req.json()
  const { title, content, mediaUrls = [], mediaTypes = [], isPPV, ppvPrice, visibility, publishNow } = body

  const post = await prisma.post.create({
    data: {
      creatorId: creator.id,
      title,
      body: content,
      mediaUrls,
      mediaTypes,
      isPPV: isPPV ?? false,
      ppvPrice: isPPV ? ppvPrice : null,
      visibility: visibility ?? 'SUBSCRIBERS',
      publishedAt: publishNow ? new Date() : null,
    },
  })

  if (publishNow) {
    // Push notification to all subscribers
    await sendPushToCreatorSubscribers(creator.id, {
      title: `New from ${creator.displayName}`,
      body: title ?? 'New post just dropped!',
      url: `/fan/feed`,
    })

    await triggerNewPost(creator.id, {
      id: post.id,
      title: title ?? 'New post',
      creatorName: creator.displayName,
      isPPV: isPPV ?? false,
    })

    // SMS fans who have phone numbers (sample — in prod batch this)
    const phoneSubs = await prisma.subscription.findMany({
      where: { creatorId: creator.id, status: 'ACTIVE' },
      include: { fan: { select: { phone: true } } },
      take: 100,
    })
    for (const sub of phoneSubs) {
      if (sub.fan.phone) {
        await notifyFanNewPost(sub.fan.phone, creator.displayName, title ?? 'New post').catch(() => {})
      }
    }
  }

  return NextResponse.json({ post }, { status: 201 })
}
