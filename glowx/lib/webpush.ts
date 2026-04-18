import webpush from 'web-push'
import { prisma } from './prisma'

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export async function sendPushToUser(userId: string, payload: {
  title: string
  body: string
  icon?: string
  badge?: string
  url?: string
}) {
  const subs = await prisma.pushSubscription.findMany({ where: { userId } })

  const results = await Promise.allSettled(
    subs.map(sub =>
      webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ ...payload, icon: payload.icon ?? '/icons/icon-192.png' })
      )
    )
  )

  // Clean up expired subscriptions
  for (let i = 0; i < results.length; i++) {
    const r = results[i]
    if (r.status === 'rejected' && (r.reason as any)?.statusCode === 410) {
      await prisma.pushSubscription.delete({ where: { endpoint: subs[i].endpoint } }).catch(() => {})
    }
  }
}

export async function sendPushToCreatorSubscribers(creatorId: string, payload: {
  title: string; body: string; url?: string
}) {
  const subs = await prisma.subscription.findMany({
    where: { creatorId, status: 'ACTIVE' },
    select: { fanId: true },
  })
  await Promise.allSettled(subs.map(s => sendPushToUser(s.fanId, payload)))
}

export function generateVapidKeys() {
  return webpush.generateVAPIDKeys()
}
