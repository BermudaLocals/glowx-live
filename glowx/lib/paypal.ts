const PAYPAL_API =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com'

async function getAccessToken(): Promise<string> {
  const res = await fetch(`${PAYPAL_API}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  })
  const data = await res.json()
  return data.access_token
}

// ── Orders (PPV + Tips) ──────────────────────────────────────
export async function createOrder(amount: number, description: string) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      intent: 'CAPTURE',
      purchase_units: [{ amount: { currency_code: 'USD', value: amount.toFixed(2) }, description }],
    }),
  })
  return res.json()
}

export async function captureOrder(orderId: string) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  })
  return res.json()
}

// ── Subscriptions ────────────────────────────────────────────
export async function createProduct(name: string, description: string) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API}/v1/catalogs/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ name, description, type: 'SERVICE', category: 'SOFTWARE' }),
  })
  return res.json()
}

export async function createPlan(productId: string, name: string, price: number, interval: string) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API}/v1/billing/plans`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      product_id: productId,
      name,
      status: 'ACTIVE',
      billing_cycles: [{
        frequency: { interval_unit: interval.toUpperCase(), interval_count: 1 },
        tenure_type: 'REGULAR',
        sequence: 1,
        total_cycles: 0,
        pricing_scheme: { fixed_price: { value: price.toFixed(2), currency_code: 'USD' } },
      }],
      payment_preferences: { auto_bill_outstanding: true, payment_failure_threshold: 3 },
    }),
  })
  return res.json()
}

export async function cancelSubscription(subscriptionId: string, reason: string) {
  const token = await getAccessToken()
  await fetch(`${PAYPAL_API}/v1/billing/subscriptions/${subscriptionId}/cancel`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ reason }),
  })
}

// ── Payouts ──────────────────────────────────────────────────
export async function createPayout(recipientEmail: string, amount: number, creatorId: string) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API}/v1/payments/payouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      sender_batch_header: {
        sender_batch_id: `glowx_${creatorId}_${Date.now()}`,
        email_subject: 'Your GLOWX payout has arrived!',
        email_message: 'Your earnings have been transferred to your PayPal account.',
      },
      items: [{
        recipient_type: 'EMAIL',
        amount: { value: amount.toFixed(2), currency: 'USD' },
        receiver: recipientEmail,
        note: 'GLOWX Creator Payout',
        sender_item_id: `item_${creatorId}_${Date.now()}`,
      }],
    }),
  })
  return res.json()
}

// ── Webhook verification ─────────────────────────────────────
export async function verifyWebhook(headers: Record<string, string>, body: string) {
  const token = await getAccessToken()
  const res = await fetch(`${PAYPAL_API}/v1/notifications/verify-webhook-signature`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      auth_algo: headers['paypal-auth-algo'],
      cert_url: headers['paypal-cert-url'],
      transmission_id: headers['paypal-transmission-id'],
      transmission_sig: headers['paypal-transmission-sig'],
      transmission_time: headers['paypal-transmission-time'],
      webhook_id: process.env.PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body),
    }),
  })
  const data = await res.json()
  return data.verification_status === 'SUCCESS'
}
