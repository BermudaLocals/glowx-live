const features = [
  { icon: '💰', title: '80% Payout',           desc: 'Industry-matching revenue split with instant PayPal payouts on demand.' },
  { icon: '🔮', title: '3D Mesh Studio',        desc: 'Generate holographic 3D assets with custom shaders. Export GLB/PNG for any post.' },
  { icon: '📡', title: 'Multi-Platform Post',   desc: 'Schedule once, publish everywhere. Fanvue, Fansly, and GlowX in one push.' },
  { icon: '💬', title: 'Real-Time DMs',         desc: 'Pusher-powered instant messaging with media sharing and AI reply suggestions.' },
  { icon: '📱', title: 'Twilio Phone Lines',    desc: 'Each creator gets a dedicated number. Fans text in, messages route to your DMs.' },
  { icon: '🔔', title: 'Push Notifications',    desc: 'PWA push alerts for new posts, messages, tips, and live events.' },
  { icon: '📊', title: 'Analytics Suite',       desc: 'Revenue charts, subscriber growth, post performance, and delivery stats.' },
  { icon: '🔒', title: 'PPV + Subscriptions',   desc: 'Flexible monetization: tiers, one-time unlocks, tipping, and live gifts.' },
]

export function FeaturesMega() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 1, background: 'rgba(201,168,76,0.08)',
      border: '1px solid rgba(201,168,76,0.1)', marginTop: 40,
    }}>
      {features.map(f => (
        <div key={f.title} style={{ background: 'var(--black)', padding: '36px 28px' }}>
          <div style={{ fontSize: '1.4rem', marginBottom: 12 }}>{f.icon}</div>
          <div style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem',
            fontWeight: 600, marginBottom: 8,
          }}>{f.title}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text)', lineHeight: 1.7, fontWeight: 300 }}>
            {f.desc}
          </div>
        </div>
      ))}
    </div>
  )
}
