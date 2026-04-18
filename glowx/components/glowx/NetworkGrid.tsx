const platforms = [
  { name: 'Fanvue',   status: 'AI-Native Hub',      desc: 'Direct scheduling integration for automated content delivery and engagement.' },
  { name: 'OnlyFans', status: 'Verified Hybrid',     desc: 'Cross-post your GlowX content to maximise reach across the largest creator platform.' },
  { name: 'Fansly',   status: 'Discovery Engine',    desc: 'Automated feed pushing to dominate discovery pages and grow your audience.' },
]

export function NetworkGrid() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 40 }}>
        {platforms.map(p => (
          <div key={p.name} style={{
            background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)',
            padding: 28, transition: '0.3s', cursor: 'default',
          }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gold)'
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.1)'
              ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
            }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.4rem', color: 'var(--gold)', marginBottom: 6 }}>{p.name}</div>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.52rem', color: 'var(--text)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 12 }}>{p.status}</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text)', lineHeight: 1.6 }}>{p.desc}</p>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 36, background: 'var(--dark3)', padding: 36,
        border: '1px solid rgba(201,168,76,0.2)',
      }}>
        <div className="section-label">Daily Output Velocity</div>
        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem', fontWeight: 600 }}>
          9 POSTS / DAY
        </div>
        <div style={{
          height: 8, background: 'var(--black)', borderRadius: 4,
          margin: '16px 0', overflow: 'hidden',
        }}>
          <div style={{
            background: 'linear-gradient(90deg, var(--gold), var(--gold2))',
            width: '90%', height: '100%',
          }} />
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--white2)', lineHeight: 1.6 }}>
          GLOWX handles the 63-post-per-week grind across all platforms so you can focus on the profits.
        </p>
      </div>
    </>
  )
}
