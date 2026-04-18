'use client'
import { useEffect, useState, useCallback } from 'react'

type Post = {
  id: string; title: string; body: string; mediaUrls: string[]
  isPPV: boolean; ppvPrice: number; isLocked: boolean; likes: number
  creator: { id: string; handle: string; displayName: string; avatarUrl: string }
  publishedAt: string
}

const BG: Record<number, string> = {
  0: 'linear-gradient(135deg,#0d0d1a,#1a1a3d)',
  1: 'linear-gradient(135deg,#0a1a15,#0d2b22)',
  2: 'linear-gradient(135deg,#1a0d00,#2b1800)',
  3: 'linear-gradient(135deg,#050510,#0d0d2b)',
  4: 'linear-gradient(135deg,#0a1a0a,#1a2b1a)',
  5: 'linear-gradient(135deg,#0a0a1a,#15152b)',
}
const EMOJIS = ['💪', '🎨', '🌅', '🎵', '🥗', '📸', '✨', '🔥', '🌙', '💎']

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [tipping, setTipping] = useState<string | null>(null)
  const [tipAmount, setTipAmount] = useState(10)

  const fetchPosts = useCallback(async (cur?: string) => {
    setLoading(true)
    const url = `/api/posts?limit=12${cur ? `&cursor=${cur}` : ''}`
    const res = await fetch(url).then(r => r.json())
    setPosts(p => cur ? [...p, ...(res.posts ?? [])] : (res.posts ?? []))
    setCursor(res.nextCursor ?? null)
    setHasMore(!!res.nextCursor)
    setLoading(false)
  }, [])

  useEffect(() => { fetchPosts() }, [fetchPosts])

  const unlockPPV = async (postId: string, price: number) => {
    const res = await fetch('/api/paypal/order', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'ppv', postId }),
    }).then(r => r.json())
    if (res.orderId) alert(`PayPal Order ID: ${res.orderId}\nIn production this opens the PayPal checkout.`)
  }

  const sendTip = async (creatorId: string) => {
    const res = await fetch('/api/paypal/order', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'tip', creatorId, amount: tipAmount }),
    }).then(r => r.json())
    if (res.orderId) { alert(`Tip of $${tipAmount} initiated via PayPal!`); setTipping(null) }
  }

  return (
    <div style={{ padding: '100px 48px 60px' }}>
      <div className="section-label">Your Feed</div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, marginBottom: 32 }}>
        Latest from <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>subscriptions.</em>
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 20 }}>
        {posts.map((p, i) => (
          <div key={p.id} style={{
            background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)',
            overflow: 'hidden', transition: '0.3s',
          }}
            onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.4)'}
            onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.1)'}>
            {/* Media */}
            <div style={{
              height: 200, background: BG[i % 6],
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '3rem', position: 'relative', overflow: 'hidden',
            }}>
              {EMOJIS[i % EMOJIS.length]}
              {p.isLocked && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(5,5,5,0.75)',
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 8,
                }}>
                  <div style={{ fontSize: '1.5rem' }}>🔒</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', letterSpacing: '2px', color: 'var(--gold)' }}>
                    PPV — ${p.ppvPrice?.toFixed(2)}
                  </div>
                  <button className="btn-gold" style={{ padding: '8px 20px', fontSize: '0.58rem', marginTop: 4 }}
                    onClick={() => unlockPPV(p.id, p.ppvPrice)}>
                    Unlock
                  </button>
                </div>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: 16 }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', color: 'var(--gold)', letterSpacing: '2px', marginBottom: 6 }}>
                @{p.creator.handle}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--white2)', marginBottom: 12, lineHeight: 1.5 }}>
                {p.title ?? 'Untitled Post'}
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--red)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'}>
                  ❤️ {p.likes ?? 0}
                </button>
                <button style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--gold)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'}
                  onClick={() => setTipping(tipping === p.id ? null : p.id)}>
                  💰 Tip
                </button>
                <button style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--text)', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--blue)'}
                  onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.color = 'var(--text)'}>
                  💬 Message
                </button>
              </div>
              {/* Inline tip box */}
              {tipping === p.id && (
                <div style={{ marginTop: 12, padding: 14, background: 'var(--dark3)', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 10, flexWrap: 'wrap' }}>
                    {[5, 10, 20, 50].map(v => (
                      <button key={v} onClick={() => setTipAmount(v)}
                        style={{
                          padding: '4px 12px', fontFamily: "'DM Mono',monospace", fontSize: '0.58rem',
                          border: `1px solid ${tipAmount === v ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                          background: tipAmount === v ? 'rgba(201,168,76,0.1)' : 'transparent',
                          color: tipAmount === v ? 'var(--gold)' : 'var(--text)', cursor: 'pointer',
                        }}>${v}</button>
                    ))}
                  </div>
                  <button className="btn-gold" style={{ width: '100%', padding: '8px', fontSize: '0.6rem' }}
                    onClick={() => sendTip(p.creator.id)}>
                    Send ${tipAmount} Tip via PayPal
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 0', fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', color: 'var(--text)' }}>
          Loading…
        </div>
      )}

      {hasMore && !loading && (
        <div style={{ textAlign: 'center', marginTop: 40 }}>
          <button className="btn-ghost" style={{ padding: '12px 32px', fontSize: '0.65rem' }}
            onClick={() => fetchPosts(cursor ?? undefined)}>
            Load More
          </button>
        </div>
      )}

      {!loading && posts.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>📭</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem', marginBottom: 8 }}>Your feed is empty</div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text)', marginBottom: 24 }}>Subscribe to creators to see their posts here.</p>
          <a href="/fan/discover"><button className="btn-gold" style={{ padding: '12px 32px', fontSize: '0.65rem' }}>Discover Creators</button></a>
        </div>
      )}
    </div>
  )
}
