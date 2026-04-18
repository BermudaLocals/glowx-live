'use client'
import { useEffect, useState } from 'react'

const earningsData = [
  { month: 'Jul', val: 3200 }, { month: 'Aug', val: 4100 }, { month: 'Sep', val: 3800 },
  { month: 'Oct', val: 5600 }, { month: 'Nov', val: 6200 }, { month: 'Dec', val: 7400 },
  { month: 'Jan', val: 8100 }, { month: 'Feb', val: 7900 }, { month: 'Mar', val: 9300 },
]

function StatCard({ label, value, delta, gold }: { label: string; value: string; delta: string; gold?: boolean }) {
  return (
    <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', letterSpacing: '2px', color: 'var(--text)', textTransform: 'uppercase', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 600, color: gold ? 'var(--gold)' : 'var(--white)' }}>{value}</div>
      <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: gold ? 'var(--gold)' : 'var(--green)', marginTop: 4 }}>{delta}</div>
    </div>
  )
}

export function StudioDashboard() {
  const max = Math.max(...earningsData.map(d => d.val))

  return (
    <div>
      <div className="section-label">Creator Studio</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 300, marginBottom: 8 }}>Dashboard</h2>
      <p style={{ fontSize: '0.75rem', color: 'var(--text)', marginBottom: 32 }}>Welcome back ✦</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 }}>
        <StatCard label="Revenue (MTD)" value="$9,340" delta="↑ 14.2% vs last month" />
        <StatCard label="Subscribers"   value="12,416" delta="↑ 312 this week" />
        <StatCard label="Posts Published" value="63"   delta="9/day across platforms" />
        <StatCard label="Payout Balance" value="$7,472" delta="Ready to withdraw →" gold />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Revenue chart */}
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
          <div className="section-label" style={{ marginBottom: 8 }}>Revenue — Last 9 Months</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120, paddingTop: 12 }}>
            {earningsData.map(d => (
              <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <div style={{
                  width: '100%', borderRadius: '2px 2px 0 0',
                  background: 'linear-gradient(to top, var(--gold3), var(--gold))',
                  height: `${Math.round((d.val / max) * 100)}px`, minHeight: 4,
                }} />
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.48rem', color: 'var(--text)' }}>{d.month}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Quick Actions</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: '✏️ Create New Post',     action: 'post' },
              { label: '📅 Schedule Content',    action: 'scheduler' },
              { label: '🔮 Open 3D Mesh Studio', action: 'mesh' },
              { label: '💰 Request Payout',      action: 'earnings' },
            ].map(a => (
              <button key={a.label} className="btn-ghost"
                style={{ width: '100%', padding: '12px', fontSize: '0.62rem', textAlign: 'left' }}>
                {a.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Platform distribution */}
      <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>Platform Distribution This Week</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16 }}>
          {[
            { name: 'GlowX Native', posts: 27, pct: 43 },
            { name: 'Fanvue',       posts: 21, pct: 33 },
            { name: 'Fansly',       posts: 15, pct: 24 },
          ].map(p => (
            <div key={p.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--text)' }}>{p.name}</span>
                <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--gold)' }}>{p.posts} posts</span>
              </div>
              <div style={{ height: 4, background: 'var(--dark3)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.pct}%`, background: 'linear-gradient(90deg,var(--gold),var(--gold2))' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
