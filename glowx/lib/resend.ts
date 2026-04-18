import { Resend } from 'resend'

export const resend = new Resend(process.env.RESEND_API_KEY)

const FROM = process.env.RESEND_FROM_EMAIL ?? 'noreply@glowx.live'

const baseStyle = `
  background:#050505;padding:48px;font-family:Montserrat,sans-serif;max-width:520px;margin:0 auto;
`
const logo = `<div style="font-family:'Georgia',serif;font-size:2rem;color:#C9A84C;letter-spacing:8px;margin-bottom:32px;">GLOWX</div>`
const footer = `<p style="color:#242424;font-size:0.6rem;margin-top:48px;border-top:1px solid #111;padding-top:16px;">© 2026 GLOWX · glowx.live</p>`

export async function sendSubscriptionReceipt(to: string, opts: {
  creatorName: string; tierName: string; amount: number; orderId: string
}) {
  await resend.emails.send({
    from: FROM, to,
    subject: `Subscription confirmed — ${opts.creatorName}`,
    html: `<div style="${baseStyle}">${logo}
      <p style="color:#F5F0E8;font-size:1rem;margin-bottom:8px;">Subscription confirmed.</p>
      <p style="color:#8A8070;font-size:0.85rem;margin-bottom:32px;">You're now subscribed to <strong style="color:#C9A84C;">${opts.creatorName}</strong>.</p>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="color:#8A8070;padding:8px 0;font-size:0.8rem;border-bottom:1px solid #111;">Plan</td><td style="color:#F5F0E8;text-align:right;padding:8px 0;font-size:0.8rem;border-bottom:1px solid #111;">${opts.tierName}</td></tr>
        <tr><td style="color:#8A8070;padding:8px 0;font-size:0.8rem;border-bottom:1px solid #111;">Amount</td><td style="color:#C9A84C;text-align:right;padding:8px 0;font-size:0.8rem;border-bottom:1px solid #111;">$${opts.amount}/mo</td></tr>
        <tr><td style="color:#8A8070;padding:8px 0;font-size:0.8rem;">Order ID</td><td style="color:#8A8070;text-align:right;padding:8px 0;font-size:0.7rem;">${opts.orderId}</td></tr>
      </table>${footer}</div>`,
  })
}

export async function sendPayoutConfirmation(to: string, opts: {
  amount: number; batchId: string; creatorName: string
}) {
  await resend.emails.send({
    from: FROM, to,
    subject: `Your GLOWX payout of $${opts.amount} is on the way`,
    html: `<div style="${baseStyle}">${logo}
      <p style="color:#F5F0E8;font-size:1rem;margin-bottom:8px;">Payout sent.</p>
      <p style="color:#8A8070;font-size:0.85rem;margin-bottom:32px;">Hi ${opts.creatorName}, your earnings are on the way to your PayPal account.</p>
      <div style="background:#111;padding:24px;border-left:3px solid #C9A84C;margin-bottom:24px;">
        <div style="font-family:'Georgia',serif;font-size:2rem;color:#C9A84C;font-weight:600;">$${opts.amount.toLocaleString()}</div>
        <div style="color:#8A8070;font-size:0.75rem;margin-top:4px;">Batch ID: ${opts.batchId}</div>
      </div>
      <p style="color:#8A8070;font-size:0.8rem;">Funds typically arrive within 1–2 business days.</p>${footer}</div>`,
  })
}

export async function sendWeeklyDigest(to: string, opts: {
  fanName: string; creators: Array<{ name: string; posts: number }>
}) {
  const creatorRows = opts.creators.map(c =>
    `<tr><td style="color:#F5F0E8;padding:8px 0;border-bottom:1px solid #111;">${c.name}</td><td style="color:#C9A84C;text-align:right;padding:8px 0;border-bottom:1px solid #111;">${c.posts} new posts</td></tr>`
  ).join('')
  await resend.emails.send({
    from: FROM, to,
    subject: `Your weekly GLOWX digest`,
    html: `<div style="${baseStyle}">${logo}
      <p style="color:#F5F0E8;font-size:1rem;margin-bottom:8px;">Your weekly update, ${opts.fanName}.</p>
      <p style="color:#8A8070;font-size:0.85rem;margin-bottom:24px;">Here's what dropped from your subscriptions this week:</p>
      <table style="width:100%;border-collapse:collapse;">${creatorRows}</table>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/fan/feed" style="display:inline-block;margin-top:24px;padding:14px 32px;background:linear-gradient(135deg,#C9A84C,#8B6914);color:#050505;text-decoration:none;font-family:monospace;font-size:0.65rem;letter-spacing:3px;text-transform:uppercase;">
        View Feed →
      </a>${footer}</div>`,
  })
}
