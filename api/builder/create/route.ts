@"
import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: Request) {
  const { displayName, morphJson } = await req.json()
  
  // Validation - must be 18+ and original
  if(!displayName || displayName.toLowerCase().includes('karimaluvx')) {
    return NextResponse.json({ error: 'Create original name, not clone' }, { status: 400 })
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{ price_data: { currency: 'usd', product_data: { name: `Build Persona: ${displayName}` }, unit_amount: 999 }, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/builder/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/builder`,
    metadata: { displayName, morphJson: JSON.stringify(morphJson) }
  })

  return NextResponse.json({ url: session.url })
}
"@ | Set-Content glowx\app\api\builder\create\route.ts -Encoding utf8
