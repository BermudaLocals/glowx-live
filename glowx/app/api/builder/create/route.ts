import { NextResponse } from 'next/server'
import Stripe from 'stripe'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' })

export async function POST(req: Request) {
  const { displayName, morphJson } = await req.json()
  if(!displayName || displayName.toLowerCase().includes('karimaluvx')) {
    return NextResponse.json({ error: 'Use original name, not a clone' }, { status: 400 })
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
