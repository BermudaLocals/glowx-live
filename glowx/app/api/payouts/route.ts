import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { createPayout } from '@/lib/paypal'

// GET /api/payouts — creator payout history
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const creator = await prisma.creator.findUnique({ where: { userId: session.user.id } })
  if (!creator) return NextResponse.json({ error: 'Creator only' }, { status: 403 })

  const payouts = await prisma.payout.findMany({
    where: { creatorId: creator.id },
    orderBy: { createdAt: 'desc' },
  })

  // Calculate available balance
  const subscriptionRevenue = await prisma.subscription.aggregate({
    where: { creatorId: creator.id, status: 'ACTIVE' },
    _count: true,
  })
  const purchases = await prisma.purchase.aggregate({
    where: { post: { creatorId: creator.id } },
    _sum: { amount: true },
  })
  const tips = await prisma.tip.aggregate({
    where: { creatorId: creator.id },
    _sum: { amount: true },
  })
  const totalPaidOut = await prisma.payout.aggregate({
    where: { creatorId: creator.id, status: 'completed' },
    _sum: { amount: true },
  })

  const gross = (purchases._sum.amount ?? 0) + (tips._sum.amount ?? 0)
  const netEarnings = gross * 0.8
  const available = netEarnings - (totalPaidOut._sum.amount ?? 0)

  return NextResponse.json({ payouts, available: Math.max(0, available), gross })
}

// POST /api/payouts — request a payout
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const creator = await prisma.creator.findUnique({ where: { userId: session.user.id } })
  if (!creator) return NextResponse.json({ error: 'Creator only' }, { status: 403 })
  if (!creator.paypalEmail) return NextResponse.json({ error: 'No PayPal email configured' }, { status: 400 })

  const { amount } = await req.json()
  if (!amount || amount < 25) return NextResponse.json({ error: 'Minimum payout is $25' }, { status: 400 })

  // Create PayPal payout batch
  const result = await createPayout(creator.paypalEmail, amount, creator.id)

  if (result.batch_header) {
    const payout = await prisma.payout.create({
      data: {
        creatorId: creator.id,
        amount,
        paypalEmail: creator.paypalEmail,
        paypalBatchId: result.batch_header.payout_batch_id,
        status: result.batch_header.batch_status?.toLowerCase() ?? 'pending',
      },
    })
    return NextResponse.json({ payout })
  }

  return NextResponse.json({ error: 'PayPal payout failed', details: result }, { status: 500 })
}
