import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { createOrder, captureOrder } from '@/lib/paypal'
import { notifyCreatorNewTip } from '@/lib/twilio'
import { sendPushToUser } from '@/lib/webpush'

// POST /api/paypal/order — create PayPal order
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { type, postId, creatorId, amount, message } = await req.json()

  if (type === 'ppv') {
    const post = await prisma.post.findUnique({ where: { id: postId }, include: { creator: true } })
    if (!post?.ppvPrice) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    const order = await createOrder(post.ppvPrice, `Unlock: ${post.title ?? 'Exclusive Content'} by ${post.creator.displayName}`)
    return NextResponse.json({ orderId: order.id })
  }

  if (type === 'tip') {
    if (!amount || amount < 1) return NextResponse.json({ error: 'Invalid tip amount' }, { status: 400 })
    const creator = await prisma.creator.findUnique({ where: { id: creatorId }, include: { user: true } })
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 })
    const order = await createOrder(amount, `Tip for ${creator.displayName} on GLOWX`)
    return NextResponse.json({ orderId: order.id })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}

// PATCH /api/paypal/order — capture PayPal order
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { orderId, type, postId, creatorId, amount, message } = await req.json()
  const capture = await captureOrder(orderId)

  if (capture.status !== 'COMPLETED') {
    return NextResponse.json({ error: 'Payment not completed' }, { status: 400 })
  }

  if (type === 'ppv') {
    const post = await prisma.post.findUnique({ where: { id: postId } })
    if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    await prisma.purchase.create({
      data: { fanId: session.user.id, postId, amount: post.ppvPrice!, paypalOrderId: orderId },
    })
    return NextResponse.json({ ok: true, type: 'ppv' })
  }

  if (type === 'tip') {
    const creator = await prisma.creator.findUnique({ where: { id: creatorId } })
    if (!creator) return NextResponse.json({ error: 'Creator not found' }, { status: 404 })

    await prisma.tip.create({
      data: { fanId: session.user.id, creatorId, amount, message, paypalOrderId: orderId },
    })

    // Notify creator
    if (creator.twilioPhone) {
      const fan = await prisma.user.findUnique({ where: { id: session.user.id } })
      await notifyCreatorNewTip(creator.twilioPhone, fan?.name ?? 'A fan', amount).catch(() => {})
    }
    await sendPushToUser(creator.userId, {
      title: `💰 $${amount} tip received!`,
      body: message ?? 'Someone sent you a tip!',
      url: '/creator/studio/earnings',
    })
    await prisma.notification.create({
      data: {
        userId: creator.userId,
        type: 'NEW_TIP',
        title: `$${amount} tip received!`,
        body: message ?? 'You received a tip.',
        link: '/creator/studio/earnings',
      },
    })

    return NextResponse.json({ ok: true, type: 'tip' })
  }

  return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
}
