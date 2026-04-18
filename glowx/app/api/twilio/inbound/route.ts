import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { triggerNewMessage } from '@/lib/pusher'

// Route inbound SMS from fan-facing Twilio number → creator DMs
export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const from = formData.get('From') as string
  const to   = formData.get('To')   as string
  const body = formData.get('Body') as string

  // Find the creator assigned this Twilio number
  const creator = await prisma.creator.findFirst({
    where: { twilioPhone: to },
    include: { user: true },
  })
  if (!creator) {
    return new NextResponse(`<?xml version="1.0"?><Response></Response>`, {
      headers: { 'Content-Type': 'text/xml' },
    })
  }

  // Find or create a guest user record for the fan's phone
  let fan = await prisma.user.findFirst({ where: { phone: from } })
  if (!fan) {
    fan = await prisma.user.create({
      data: { phone: from, name: `SMS Fan ${from.slice(-4)}`, role: 'FAN' },
    })
  }

  // Store as a DM
  const message = await prisma.message.create({
    data: {
      senderId: fan.id,
      receiverId: creator.userId,
      body,
    },
    include: { sender: true },
  })

  // Push real-time to creator's studio
  await triggerNewMessage(creator.userId, {
    id: message.id,
    senderId: fan.id,
    senderName: fan.name ?? from,
    body,
    createdAt: message.createdAt.toISOString(),
  })

  // Auto-reply TwiML
  const twiml = `<?xml version="1.0"?>
<Response>
  <Message>Thanks for your message! ${creator.displayName} will reply soon via GLOWX. ✨</Message>
</Response>`

  return new NextResponse(twiml, { headers: { 'Content-Type': 'text/xml' } })
}
