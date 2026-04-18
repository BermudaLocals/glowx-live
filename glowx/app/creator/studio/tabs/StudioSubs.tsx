'use client'

const subs = [
  { handle: '@glowxfan99',    tier: 'Premium', joined: 'Today',      val: 19.99 },
  { handle: '@top_tipper',    tier: 'Premium', joined: 'Today',      val: 19.99 },
  { handle: '@sub_4422',      tier: 'Basic',   joined: 'Yesterday',  val: 9.99  },
  { handle: '@fan_user_001',  tier: 'Premium', joined: 'Yesterday',  val: 19.99 },
  { handle: '@subscriber_x',  tier: 'Basic',   joined: '2 days ago', val: 9.99  },
  { handle: '@vip_member_7',  tier: 'Premium', joined: '3 days ago', val: 19.99 },
  { handle: '@lurker_turned', tier: 'Basic',   joined: '4 days ago', val: 9.99  },
  { handle: '@day1_fan',      tier: 'Basic',   joined: '1 week ago', val: 9.99  },
]

export function StudioSubs() {
  return (
    <div>
      <div className="section-label">Audience</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 300, marginBottom: 32 }}>Subscribers</h2>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Subscribers', val: '12,416', delta: '↑ 312 this week' },
          { label: 'Basic Tier',        val: '9,840',  delta: '$9.99/mo' },
          { label: 'Premium Tier',      val: '2,576',  delta: '$19.99/mo' },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', letterSpacing: '2px', color: 'var(--text)', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 600 }}>{s.val}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--green)', marginTop: 4 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Growth bar */}
      <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24, marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Tier Breakdown</div>
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--text)' }}>Basic (79%)</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--white2)' }}>9,840</span>
          </div>
          <div style={{ height: 6, background: 'var(--dark3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '79%', background: 'rgba(201,168,76,0.4)' }} />
          </div>
        </div>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--text)' }}>Premium (21%)</span>
            <span style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--gold)' }}>2,576</span>
          </div>
          <div style={{ height: 6, background: 'var(--dark3)', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: '21%', background: 'linear-gradient(90deg,var(--gold),var(--gold2))' }} />
          </div>
        </div>
      </div>

      {/* Subscriber list */}
      <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
        <div className="section-label" style={{ marginBottom: 16 }}>Recent Subscribers</div>
        {subs.map((s, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--white2)', marginBottom: 2 }}>{s.handle}</div>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.52rem', color: 'var(--text)' }}>{s.joined}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{
                display: 'inline-block', padding: '2px 10px',
                fontFamily: "'DM Mono',monospace", fontSize: '0.5rem', letterSpacing: '2px', textTransform: 'uppercase',
                background: s.tier === 'Premium' ? 'rgba(201,168,76,0.15)' : 'rgba(76,201,138,0.12)',
                color: s.tier === 'Premium' ? 'var(--gold)' : 'var(--green)',
                border: `1px solid ${s.tier === 'Premium' ? 'rgba(201,168,76,0.3)' : 'rgba(76,201,138,0.3)'}`,
              }}>{s.tier}</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', color: 'var(--gold)', marginTop: 4 }}>${s.val}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
