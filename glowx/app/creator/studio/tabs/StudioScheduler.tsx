'use client'
import { useState } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const HAS_POSTS = [3, 7, 10, 12, 15, 17, 19, 22, 24, 27, 29]
const TODAY = new Date().getDate()

const UPCOMING = [
  { title: 'Morning HIIT — Full Session', time: '6:00 AM',  platforms: 'GlowX · Fanvue', status: 'scheduled' },
  { title: 'Meal Prep Sunday Guide',      time: '12:00 PM', platforms: 'GlowX',           status: 'scheduled' },
  { title: 'Evening Stretch Routine',     time: '7:00 PM',  platforms: 'GlowX · Fansly',  status: 'scheduled' },
]

export function StudioScheduler() {
  const [selected, setSelected] = useState<number | null>(null)

  const days = Array.from({ length: 35 }, (_, i) => i - 2)

  return (
    <div>
      <div className="section-label">Content</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 300, marginBottom: 8 }}>Content Scheduler</h2>
      <p style={{ fontSize: '0.75rem', color: 'var(--text)', marginBottom: 32 }}>Schedule up to 9 posts/day across all platforms</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 32 }}>
        {/* Calendar */}
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.4rem' }}>April 2026</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-ghost" style={{ padding: '5px 12px', fontSize: '0.65rem' }}>‹</button>
              <button className="btn-ghost" style={{ padding: '5px 12px', fontSize: '0.65rem' }}>›</button>
            </div>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 3 }}>
            {DAYS.map(d => (
              <div key={d} style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.5rem', color: 'var(--text)', textAlign: 'center', padding: '6px 0', letterSpacing: '1px' }}>{d}</div>
            ))}
          </div>

          {/* Day cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3 }}>
            {days.map((n, i) => {
              const isValid = n >= 1 && n <= 30
              const hasPost = isValid && HAS_POSTS.includes(n)
              const isToday = isValid && n === TODAY
              const isSel   = isValid && n === selected
              return (
                <div key={i} onClick={() => isValid && setSelected(n)}
                  style={{
                    aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'DM Mono',monospace", fontSize: '0.65rem', cursor: isValid ? 'pointer' : 'default',
                    opacity: isValid ? 1 : 0.2,
                    background: isSel ? 'rgba(201,168,76,0.2)' : isToday ? 'rgba(201,168,76,0.12)' : 'var(--dark3)',
                    color: isToday || isSel ? 'var(--gold)' : 'var(--white2)',
                    borderBottom: hasPost ? '2px solid var(--gold)' : '2px solid transparent',
                    transition: '0.15s',
                  }}>
                  {isValid ? n : ''}
                </div>
              )
            })}
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 14, fontFamily: "'DM Mono',monospace", fontSize: '0.5rem', color: 'var(--text)' }}>
            <span style={{ borderBottom: '2px solid var(--gold)', paddingBottom: 2 }}>Scheduled post</span>
            <span style={{ background: 'rgba(201,168,76,0.12)', padding: '0 6px', color: 'var(--gold)' }}>Today</span>
          </div>
        </div>

        {/* Right panel */}
        <div>
          {/* Daily quota */}
          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24, marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Today's Queue</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 600 }}>
              7<span style={{ fontSize: '1rem', color: 'var(--text)', fontFamily: "'DM Mono',monospace" }}> / 9</span>
            </div>
            <div style={{ height: 4, background: 'var(--dark3)', borderRadius: 2, margin: '12px 0', overflow: 'hidden' }}>
              <div style={{ background: 'linear-gradient(90deg,var(--gold),var(--gold2))', width: '78%', height: '100%' }} />
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text)' }}>2 slots remaining today</div>
          </div>

          {/* Upcoming posts */}
          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Upcoming Posts</div>
            {UPCOMING.map((p, i) => (
              <div key={i} style={{ padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontSize: '0.78rem', color: 'var(--white2)', marginBottom: 4 }}>{p.title}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', color: 'var(--gold)' }}>{p.time}</span>
                  <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.5rem', color: 'var(--text)' }}>{p.platforms}</span>
                </div>
              </div>
            ))}
            <button className="btn-gold" style={{ width: '100%', padding: 10, fontSize: '0.6rem', marginTop: 16 }}>
              + Add Post
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
