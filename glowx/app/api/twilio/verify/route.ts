import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { sendVerificationCode, checkVerificationCode } from '@/lib/twilio'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { action, phone, code } = await req.json()

  if (action === 'send') {
    const status = await sendVerificationCode(phone)
    return NextResponse.json({ status })
  }

  if (action === 'verify') {
    const approved = await checkVerificationCode(phone, code)
    if (approved) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { phone, phoneVerified: true },
      })
    }
    return NextResponse.json({ approved })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
