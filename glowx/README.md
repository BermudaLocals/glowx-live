# GLOWX.live

> The platform OnlyFans wishes it was. Same 80% payout. Ten times the tools.

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 + TypeScript + Tailwind CSS |
| Auth | NextAuth.js (Magic Link + Google OAuth) |
| Database | PostgreSQL via Prisma ORM |
| Real-time | Pusher Channels |
| Payments | PayPal Orders + Subscriptions + Payouts API |
| SMS | Twilio Verify + Programmable SMS |
| Email | Resend |
| Media | Cloudflare R2 |
| Queue | BullMQ + Upstash Redis |
| Push | Web Push VAPID |
| 3D | React Three Fiber + Three.js |
| Deploy | Railway + Docker |
| CI/CD | GitHub Actions |

---

## Quick Start

```bash
git clone https://github.com/your-org/glowx-live.git
cd glowx-live
npm install
cp .env.example .env.local
# fill in .env.local with your keys
npx prisma migrate dev --name init
npm run db:seed
npm run dev
```

## Deploy to Railway

1. Push to GitHub main branch
2. Connect repo in railway.app → New Project → GitHub
3. Add PostgreSQL service
4. Set all env vars from .env.example in Railway Variables tab
5. Add RAILWAY_TOKEN and DATABASE_URL to GitHub Secrets
6. Every push to main auto-deploys via GitHub Actions

## PayPal Webhook

Set webhook URL in developer.paypal.com:
`https://glowx.live/api/webhooks/paypal`

Events: BILLING.SUBSCRIPTION.ACTIVATED, BILLING.SUBSCRIPTION.CANCELLED,
PAYMENT.SALE.COMPLETED, PAYMENT.PAYOUTSBATCH.SUCCESS

## Twilio Inbound SMS

Set webhook in console.twilio.com → Phone Numbers:
`https://glowx.live/api/twilio/inbound` (POST)

## Generate VAPID Keys

```bash
npx web-push generate-vapid-keys
```

---

(c) 2026 GLOWX. All rights reserved.
