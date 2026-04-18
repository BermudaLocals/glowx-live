import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyWebhook } from '@/lib/paypal'
import { sendSubscriptionReceipt, sendPayoutConfirmation } from '@/lib/resend'
import { notifyCreatorNewSubscriber } from '@/lib/twilio'
import { sendPushToUser } from '@/lib/webpush'
import { triggerNotification } from '@/lib/pusher'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headers: Record<string, string> = {}
  req.headers.forEach((v, k) => { headers[k] = v })

  const valid = await verifyWebhook(headers, body)
  if (!valid) return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })

  const event = JSON.parse(body)
  const { event_type, resource } = event

  try {
    switch (event_type) {

      case 'BILLING.SUBSCRIPTION.ACTIVATED': {
        const sub = await prisma.subscription.findFirst({
          where: { paypalSubId: resource.id },
          include: { fan: true, creator: { include: { user: true } }, tier: true },
        })
        if (!sub) break

        await prisma.subscription.update({
          where: { id: sub.id },
          data: { status: 'ACTIVE' },
        })

        // Email receipt to fan
        if (sub.fan.email) {
          await sendSubscriptionReceipt(sub.fan.email, {
            creatorName: sub.creator.displayName,
            tierName: sub.tier.name,
            amount: sub.tier.price,
            orderId: resource.id,
          })
        }

        // SMS to creator
        if (sub.creator.twilioPhone) {
          await notifyCreatorNewSubscriber(
            sub.creator.twilioPhone,
            sub.fan.name ?? 'A fan',
            sub.tier.name,
            sub.tier.price
          )
        }

        // Push to creator
        await sendPushToUser(sub.creator.userId, {
          title: 'New subscriber!',
          body: `${sub.fan.name ?? 'Someone'} joined your ${sub.tier.name} tier.`,
          url: '/creator/studio/subscribers',
        })

        // In-app notification
        await prisma.notification.create({
          data: {
            userId: sub.creator.userId,
            type: 'NEW_SUBSCRIBER',
            title: 'New Subscriber',
            body: `${sub.fan.name ?? 'A fan'} subscribed to your ${sub.tier.name} tier.`,
            link: '/creator/studio/subscribers',
          },
        })
        break
      }

      case 'BILLING.SUBSCRIPTION.CANCELLED': {
        await prisma.subscription.updateMany({
          where: { paypalSubId: resource.id },
          data: { status: 'CANCELLED' },
        })
        break
      }

      case 'PAYMENT.SALE.COMPLETED': {
        // PPV purchase capture
        const purchase = await prisma.purchase.findFirst({
          where: { paypalOrderId: resource.id },
          include: { fan: true, post: { include: { creator: { include: { user: true } } } } },
        })
        if (purchase?.fan.email) {
          await sendSubscriptionReceipt(purchase.fan.email, {
            creatorName: purchase.post.creator.displayName,
            tierName: 'Pay-Per-View Unlock',
            amount: purchase.amount,
            orderId: resource.id,
          })
        }
        break
      }

      case 'PAYMENT.PAYOUTSBATCH.SUCCESS': {
        const payout = await prisma.payout.findFirst({
          where: { paypalBatchId: resource.batch_header?.payout_batch_id },
          include: { creator: { include: { user: true } } },
        })
        if (!payout) break

        await prisma.payout.update({
          where: { id: payout.id },
          data: { status: 'completed', processedAt: new Date() },
        })

        if (payout.creator.user.email) {
          await sendPayoutConfirmation(payout.creator.user.email, {
            amount: payout.amount,
            batchId: resource.batch_header?.payout_batch_id ?? '',
            creatorName: payout.creator.displayName,
          })
        }

        await sendPushToUser(payout.creator.userId, {
          title: `$${payout.amount} payout sent!`,
          body: 'Your earnings are on the way to PayPal.',
        })
        break
      }
    }
  } catch (err) {
    console.error('Webhook processing error:', err)
  }

  return NextResponse.json({ received: true })
}
