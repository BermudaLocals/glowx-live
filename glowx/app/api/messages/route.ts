import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'
import { triggerNewMessage } from '@/lib/pusher'
import { notifyCreatorNewMessage } from '@/lib/twilio'
import { sendPushToUser } from '@/lib/webpush'

// GET /api/messages?with=userId — get conversation thread
export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const withId = new URL(req.url).searchParams.get('with')

  if (withId) {
    // Single thread
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId: withId },
          { senderId: withId, receiverId: session.user.id },
        ],
      },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, name: true, image: true } } },
      take: 100,
    })
    // Mark as read
    await prisma.message.updateMany({
      where: { senderId: withId, receiverId: session.user.id, isRead: false },
      data: { isRead: true },
    })
    return NextResponse.json({ messages })
  }

  // Conversation list — latest message per thread
  const sent = await prisma.message.findMany({
    where: { senderId: session.user.id },
    distinct: ['receiverId'],
    orderBy: { createdAt: 'desc' },
    include: { receiver: { select: { id: true, name: true, image: true, creator: { select: { handle: true, avatarUrl: true } } } } },
  })
  const received = await prisma.message.findMany({
    where: { receiverId: session.user.id },
    distinct: ['senderId'],
    orderBy: { createdAt: 'desc' },
    include: { sender: { select: { id: true, name: true, image: true, creator: { select: { handle: true, avatarUrl: true } } } } },
  })

  return NextResponse.json({ sent, received })
}

// POST /api/messages — send a message
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { receiverId, body, mediaUrl } = await req.json()
  if (!receiverId || (!body && !mediaUrl)) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const message = await prisma.message.create({
    data: { senderId: session.user.id, receiverId, body, mediaUrl },
    include: { sender: { select: { id: true, name: true } } },
  })

  // Real-time push via Pusher
  await triggerNewMessage(receiverId, {
    id: message.id,
    senderId: session.user.id,
    senderName: message.sender.name ?? 'Someone',
    body: body ?? '',
    createdAt: message.createdAt.toISOString(),
  })

  // Web push notification
  await sendPushToUser(receiverId, {
    title: `New message from ${message.sender.name ?? 'Someone'}`,
    body: body?.slice(0, 80) ?? 'Sent you a media message',
    url: `/fan/messages`,
  })

  // SMS if creator has Twilio
  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
    include: { creator: true },
  })
  if (receiver?.creator?.twilioPhone) {
    await notifyCreatorNewMessage(
      receiver.creator.twilioPhone,
      message.sender.name ?? 'A fan'
    ).catch(() => {})
  }

  // In-app notification
  await prisma.notification.create({
    data: {
      userId: receiverId,
      type: 'NEW_MESSAGE',
      title: `Message from ${message.sender.name ?? 'Someone'}`,
      body: body?.slice(0, 100) ?? 'Sent you a message',
      link: `/fan/messages`,
    },
  })

  return NextResponse.json({ message }, { status: 201 })
}
