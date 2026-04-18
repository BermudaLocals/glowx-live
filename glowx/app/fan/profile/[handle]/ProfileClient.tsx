'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'

const BANNERS: Record<string, string> = {
  fitness:   'linear-gradient(135deg,#1a0a2e,#2d1b4e)',
  art:       'linear-gradient(135deg,#0a1a1a,#1a3333)',
  lifestyle: 'linear-gradient(135deg,#1a0a0a,#3d1515)',
  music:     'linear-gradient(135deg,#050510,#0d0d2b)',
  gaming:    'linear-gradient(135deg,#0a1a0a,#1a2b1a)',
  education: 'linear-gradient(135deg,#0a0a1a,#15152b)',
}
const EMOJIS: Record<string, string> = {
  fitness:'💪', art:'🎨', lifestyle:'✨', music:'🎵', gaming:'🎮', education:'📚',
}
const POST_BG = [
  'linear-gradient(135deg,#0d0d1a,#1a1a3d)',
  'linear-gradient(135deg,#0a1a15,#0d2b22)',
  'linear-gradient(135deg,#1a0d00,#2b1800)',
  'linear-gradient(135deg,#050510,#0d0d2b)',
]
const POST_EMOJI = ['💪','🎨','🌅','🎵','🥗','📸','✨','🔥']

type Creator = {
  id: string; handle: string; displayName: string; bio: string
  avatarUrl: string; category: string; isVerified: boolean; twilioPhone: string
  tiers: Array<{ id: string; name: string; price: number; interval: string; perks: string[] }>
  posts: Array<{ id: string; title: string; isPPV: boolean; ppvPrice: number; likes: number }>
  _count: { subscribers: number; posts: number }
}

export function ProfileClient({ creator }: { creator: Creator }) {
  const { data: session } = useSession()
  const [subscribing, setSubscribing] = useState<string | null>(null)
  const [subscribed, setSubscribed]   = useState<string | null>(null)
  const [tipping, setTipping]         = useState(false)
  const [tipAmt, setTipAmt]           = useState(10)

  const subscribe = async (tierId: string, price: number) => {
    if (!session) { window.location.href = '/auth/signup'; return }
    setSubscribing(tierId)
    // In production: create PayPal subscription plan then capture
    const res = await fetch('/api/subscriptions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ creatorId: creator.id, tierId, paypalSubId: `sub_${Date.now()}` }),
    })
    setSubscribing(null)
    if (res.ok) setSubscribed(tierId)
  }

  const sendTip = async () => {
    const res = await fetch('/api/paypal/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'tip', creatorId: creator.id, amount: tipAmt }),
    }).then(r => r.json())
    if (res.orderId) { alert(`Tip of $${tipAmt} initiated via PayPal! Order: ${res.orderId}`); setTipping(false) }
  }

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Banner */}
      <div style={{ height: 280, background: BANNERS[creator.category] ?? BANNERS.lifestyle, position: 'relative' }}>
        <div style={{
          position: 'absolute', bottom: -44, left: 48,
          width: 88, height: 88, borderRadius: '50%',
          border: '4px solid var(--gold)', background: 'var(--dark2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.2rem',
        }}>{creator.avatarUrl ? <img src={creator.avatarUrl} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : (EMOJIS[creator.category] ?? '⭐')}</div>
      </div>

      <div style={{ padding: '64px 48px 0' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20, marginBottom: 32 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
              <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 600 }}>{creator.displayName}</h1>
              {creator.isVerified && (
                <span style={{ display: 'inline-block', padding: '2px 10px', fontFamily: "'DM Mono',monospace", fontSize: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase', background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>✓ Verified</span>
              )}
            </div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', color: 'var(--text)', letterSpacing: '3px', marginBottom: 12 }}>@{creator.handle}</div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.7, maxWidth: 560, marginBottom: 16 }}>{creator.bio}</p>
            <div style={{ display: 'flex', gap: 24 }}>
              <div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600 }}>{creator._count.subscribers.toLocaleString()}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text)', marginLeft: 6 }}>fans</span>
              </div>
              <div>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 600 }}>{creator._count.posts}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text)', marginLeft: 6 }}>posts</span>
              </div>
              {creator.twilioPhone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: '0.8rem' }}>📱</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--text)' }}>{creator.twilioPhone}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn-ghost" style={{ padding: '12px 20px' }} onClick={() => setTipping(true)}>💰 Tip</button>
            <Link href="/fan/messages"><button className="btn-ghost" style={{ padding: '12px 20px' }}>💬 Message</button></Link>
          </div>
        </div>

        {/* Tip modal inline */}
        {tipping && (
          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.2)', padding: 24, marginBottom: 32, maxWidth: 400 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Send a Tip to {creator.displayName}</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
              {[5, 10, 20, 50, 100].map(v => (
                <button key={v} onClick={() => setTipAmt(v)} style={{
                  padding: '6px 14px', fontFamily: "'DM Mono',monospace", fontSize: '0.6rem',
                  border: `1px solid ${tipAmt === v ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                  background: tipAmt === v ? 'rgba(201,168,76,0.1)' : 'transparent',
                  color: tipAmt === v ? 'var(--gold)' : 'var(--text)', cursor: 'pointer',
                }}>${v}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn-gold" style={{ flex: 1, padding: '10px', fontSize: '0.62rem' }} onClick={sendTip}>
                Send ${tipAmt} via PayPal
              </button>
              <button className="btn-ghost" style={{ padding: '10px 16px', fontSize: '0.62rem' }} onClick={() => setTipping(false)}>Cancel</button>
            </div>
          </div>
        )}

        {/* Subscription tiers */}
        <div className="section-label" style={{ marginBottom: 16 }}>Choose Your Tier</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16, marginBottom: 48 }}>
          {creator.tiers.map((tier, i) => (
            <div key={tier.id} style={{
              background: 'var(--dark3)',
              border: `1px solid ${i === 1 ? 'var(--gold)' : 'rgba(201,168,76,0.15)'}`,
              padding: 24, transition: '0.3s',
              background: i === 1 ? 'rgba(201,168,76,0.06)' : 'var(--dark3)',
            }}>
              {i === 1 && (
                <div style={{ marginBottom: 8 }}>
                  <span style={{ display: 'inline-block', padding: '2px 10px', fontFamily: "'DM Mono',monospace", fontSize: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase', background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>Most Popular</span>
                </div>
              )}
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '3px', color: 'var(--text)', textTransform: 'uppercase', marginBottom: 12 }}>{tier.name}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.4rem', color: 'var(--gold)', fontWeight: 600 }}>${tier.price.toFixed(2)}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text)', marginBottom: 16 }}>/{tier.interval}</div>
              <ul style={{ listStyle: 'none', marginBottom: 20 }}>
                {tier.perks.map((p, j) => (
                  <li key={j} style={{ fontSize: '0.72rem', color: 'var(--text)', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--gold)', fontSize: '0.6rem' }}>✦</span> {p}
                  </li>
                ))}
              </ul>
              <button
                className="btn-gold"
                style={{ width: '100%', padding: 12, fontSize: '0.62rem', opacity: subscribing === tier.id ? 0.7 : 1 }}
                onClick={() => subscribe(tier.id, tier.price)}
                disabled={!!subscribing}>
                {subscribed === tier.id ? '✅ Subscribed!' : subscribing === tier.id ? 'Processing…' : `Subscribe — $${tier.price.toFixed(2)}/mo`}
              </button>
            </div>
          ))}
        </div>

        {/* Posts grid */}
        <div className="section-label" style={{ marginBottom: 16 }}>Posts ({creator._count.posts})</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 20, paddingBottom: 60 }}>
          {creator.posts.map((p, i) => (
            <div key={p.id} style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', overflow: 'hidden', transition: '0.3s' }}
              onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.4)'}
              onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.1)'}>
              <div style={{ height: 180, background: POST_BG[i % 4], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', position: 'relative' }}>
                {POST_EMOJI[i % POST_EMOJI.length]}
                {p.isPPV && (
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(5,5,5,0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                    <div style={{ fontSize: '1.2rem' }}>🔒</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--gold)' }}>PPV — ${p.ppvPrice?.toFixed(2)}</div>
                  </div>
                )}
              </div>
              <div style={{ padding: 14 }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--white2)', marginBottom: 8, lineHeight: 1.5 }}>{p.title ?? 'Untitled'}</div>
                <div style={{ display: 'flex', gap: 12 }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', color: 'var(--text)' }}>❤️ {p.likes ?? 0}</span>
                  {p.isPPV && <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', color: 'var(--gold)' }}>PPV</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
