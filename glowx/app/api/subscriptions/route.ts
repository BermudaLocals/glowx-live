import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/subscriptions — fan's active subscriptions
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const subs = await prisma.subscription.findMany({
    where: { fanId: session.user.id },
    include: {
      creator: { select: { id: true, handle: true, displayName: true, avatarUrl: true, bannerUrl: true } },
      tier: true,
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json({ subscriptions: subs })
}

// POST /api/subscriptions — create subscription after PayPal activation
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { creatorId, tierId, paypalSubId } = await req.json()

  const tier = await prisma.subscriptionTier.findUnique({ where: { id: tierId } })
  if (!tier) return NextResponse.json({ error: 'Tier not found' }, { status: 404 })

  // Check for existing active subscription
  const existing = await prisma.subscription.findFirst({
    where: { fanId: session.user.id, creatorId, status: 'ACTIVE' },
  })
  if (existing) return NextResponse.json({ subscription: existing })

  const sub = await prisma.subscription.create({
    data: {
      fanId: session.user.id,
      creatorId,
      tierId,
      paypalSubId,
      status: 'ACTIVE',
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  })

  return NextResponse.json({ subscription: sub }, { status: 201 })
}

// DELETE /api/subscriptions?id= — cancel subscription
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const id = new URL(req.url).searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

  const sub = await prisma.subscription.findFirst({
    where: { id, fanId: session.user.id },
  })
  if (!sub) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  await prisma.subscription.update({ where: { id }, data: { status: 'CANCELLED' } })
  return NextResponse.json({ ok: true })
}
