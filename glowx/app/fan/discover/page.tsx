'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const CATEGORIES = ['All', 'Fitness', 'Art', 'Lifestyle', 'Music', 'Gaming', 'Education']

type Creator = {
  id: string; handle: string; displayName: string; bio: string
  avatarUrl: string; category: string; isVerified: boolean
  _count: { subscribers: number; posts: number }
  tiers: Array<{ price: number; name: string }>
}

export default function DiscoverPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [category, setCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch(`/api/creators?category=${category}&q=${search}&limit=20`)
      .then(r => r.json())
      .then(d => { setCreators(d.creators ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [category, search])

  const EMOJIS: Record<string, string> = { fitness: '💪', art: '🎨', lifestyle: '✨', music: '🎵', gaming: '🎮', education: '📚' }
  const BANNERS: Record<string, string> = {
    fitness: 'linear-gradient(135deg,#1a0a2e,#2d1b4e)',
    art: 'linear-gradient(135deg,#0a1a1a,#1a3333)',
    lifestyle: 'linear-gradient(135deg,#1a0a0a,#3d1515)',
    music: 'linear-gradient(135deg,#050510,#0d0d2b)',
    gaming: 'linear-gradient(135deg,#0a1a0a,#1a2b1a)',
    education: 'linear-gradient(135deg,#0a0a1a,#15152b)',
  }

  return (
    <div style={{ padding: '100px 48px 60px' }}>
      <div className="section-label">Browse Creators</div>
      <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, marginBottom: 32 }}>
        Find your <em style={{ fontStyle: 'italic', color: 'var(--gold)' }}>favorites.</em>
      </h1>

      {/* Search */}
      <div style={{ marginBottom: 20 }}>
        <input className="form-input" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search creators…" style={{ maxWidth: 400 }} />
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap' }}>
        {CATEGORIES.map(c => (
          <button key={c}
            onClick={() => setCategory(c.toLowerCase())}
            className={category === c.toLowerCase() ? 'btn-gold' : 'btn-ghost'}
            style={{ padding: '8px 20px', fontSize: '0.58rem' }}>
            {c}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', height: 320, animation: 'pulse 1.5s infinite' }} />
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 20 }}>
          {creators.map(c => (
            <Link key={c.id} href={`/fan/profile/${c.handle}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)',
                overflow: 'hidden', transition: '0.3s', cursor: 'pointer',
              }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.1)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)' }}>
                {/* Banner */}
                <div style={{ height: 100, background: BANNERS[c.category] ?? BANNERS.lifestyle, position: 'relative' }}>
                  <div style={{
                    position: 'absolute', bottom: -20, left: 16,
                    width: 60, height: 60, borderRadius: '50%',
                    border: '3px solid var(--gold)', background: 'var(--dark3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.4rem',
                  }}>{EMOJIS[c.category] ?? '⭐'}</div>
                </div>

                {/* Info */}
                <div style={{ padding: '28px 16px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontWeight: 600 }}>{c.displayName}</div>
                    {c.isVerified && (
                      <span style={{ display: 'inline-block', padding: '1px 8px', fontFamily: "'DM Mono',monospace", fontSize: '0.48rem', letterSpacing: '2px', textTransform: 'uppercase', background: 'rgba(201,168,76,0.15)', color: 'var(--gold)', border: '1px solid rgba(201,168,76,0.3)' }}>✓</span>
                    )}
                  </div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--text)', letterSpacing: '2px', marginBottom: 10 }}>@{c.handle}</div>
                  <div style={{ display: 'flex', gap: 16, marginBottom: 10 }}>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', color: 'var(--text)' }}>
                      <span style={{ color: 'var(--white2)', display: 'block', fontSize: '0.7rem' }}>{c._count.subscribers.toLocaleString()}</span>fans
                    </div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', color: 'var(--text)' }}>
                      <span style={{ color: 'var(--white2)', display: 'block', fontSize: '0.7rem' }}>{c._count.posts}</span>posts
                    </div>
                  </div>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text)', lineHeight: 1.5, marginBottom: 14 }}>
                    {(c.bio ?? '').slice(0, 80)}{(c.bio ?? '').length > 80 ? '…' : ''}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.52rem', color: 'var(--text)' }}>From</div>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', color: 'var(--gold)', fontWeight: 600 }}>
                        ${c.tiers?.[0]?.price?.toFixed(2) ?? '9.99'}<span style={{ fontSize: '0.6rem', color: 'var(--text)' }}>/mo</span>
                      </div>
                    </div>
                    <button className="btn-gold" style={{ padding: '8px 18px', fontSize: '0.56rem' }}
                      onClick={e => { e.preventDefault(); e.stopPropagation() }}>
                      Subscribe
                    </button>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && creators.length === 0 && (
        <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>🔍</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.7rem', letterSpacing: '2px' }}>No creators found</div>
        </div>
      )}
    </div>
  )
}
