import PusherServer from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance
export const pusherServer = new PusherServer({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
  useTLS: true,
})

// Client-side Pusher instance (singleton)
let pusherClientInstance: PusherClient | null = null

export function getPusherClient() {
  if (!pusherClientInstance && typeof window !== 'undefined') {
    pusherClientInstance = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    })
  }
  return pusherClientInstance
}

// ── Channel helpers ──────────────────────────────────────────
export const channels = {
  dm: (userId: string) => `private-dm-${userId}`,
  creator: (creatorId: string) => `creator-${creatorId}`,
  feed: (userId: string) => `feed-${userId}`,
}

export const events = {
  NEW_MESSAGE: 'new-message',
  NEW_POST: 'new-post',
  NEW_SUBSCRIBER: 'new-subscriber',
  NEW_TIP: 'new-tip',
  NOTIFICATION: 'notification',
}

// ── Trigger helpers ──────────────────────────────────────────
export async function triggerNewMessage(receiverId: string, message: {
  id: string; senderId: string; senderName: string; body: string; createdAt: string
}) {
  await pusherServer.trigger(channels.dm(receiverId), events.NEW_MESSAGE, message)
}

export async function triggerNewPost(creatorId: string, post: {
  id: string; title: string; creatorName: string; isPPV: boolean
}) {
  await pusherServer.trigger(channels.creator(creatorId), events.NEW_POST, post)
}

export async function triggerNotification(userId: string, notif: {
  type: string; title: string; body: string
}) {
  await pusherServer.trigger(channels.dm(userId), events.NOTIFICATION, notif)
}
