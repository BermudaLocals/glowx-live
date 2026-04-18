import twilio from 'twilio'

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)

// ── Phone Verification ───────────────────────────────────────
export async function sendVerificationCode(phone: string) {
  const verification = await client.verify.v2
    .services(process.env.TWILIO_VERIFY_SID!)
    .verifications.create({ to: phone, channel: 'sms' })
  return verification.status
}

export async function checkVerificationCode(phone: string, code: string) {
  try {
    const result = await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SID!)
      .verificationChecks.create({ to: phone, code })
    return result.status === 'approved'
  } catch {
    return false
  }
}

// ── SMS Alerts ───────────────────────────────────────────────
export async function sendSMS(to: string, body: string) {
  try {
    await client.messages.create({ from: process.env.TWILIO_PHONE_NUMBER!, to, body })
  } catch (err) {
    console.error('Twilio SMS error:', err)
  }
}

export async function notifyCreatorNewSubscriber(phone: string, fanHandle: string, tierName: string, amount: number) {
  await sendSMS(phone,
    `🎉 GLOWX: New subscriber! ${fanHandle} joined your ${tierName} tier for $${amount}/mo.`
  )
}

export async function notifyCreatorNewTip(phone: string, fanHandle: string, amount: number) {
  await sendSMS(phone,
    `💰 GLOWX: You received a $${amount} tip from ${fanHandle}!`
  )
}

export async function notifyCreatorNewMessage(phone: string, fanHandle: string) {
  await sendSMS(phone,
    `💬 GLOWX: New message from ${fanHandle}. Reply in your Studio.`
  )
}

export async function notifyFanNewPost(phone: string, creatorName: string, postTitle: string) {
  await sendSMS(phone,
    `✨ GLOWX: ${creatorName} just posted "${postTitle}". Check it now!`
  )
}

// ── Dedicated Phone Lines ────────────────────────────────────
export async function provisionPhoneNumber(areaCode = '555') {
  try {
    const numbers = await client.availablePhoneNumbers('US').local.list({
      areaCode: parseInt(areaCode),
      limit: 1,
    })
    if (!numbers.length) throw new Error('No numbers available')

    const purchased = await client.incomingPhoneNumbers.create({
      phoneNumber: numbers[0].phoneNumber,
      smsUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/twilio/inbound`,
      smsMethod: 'POST',
    })
    return purchased.phoneNumber
  } catch (err) {
    console.error('Twilio provision error:', err)
    return null
  }
}

// Route inbound SMS from fan phone line to creator DMs
export function parseInboundSMS(body: FormData) {
  return {
    from: body.get('From') as string,
    to: body.get('To') as string,
    message: body.get('Body') as string,
  }
}
