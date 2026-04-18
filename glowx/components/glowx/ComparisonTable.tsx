const rows = [
  { feature: 'Creator Payout',           glowx: '80%',  of: '80%',  fv: '85%',  fs: '80%'  },
  { feature: 'Multi-platform scheduling', glowx: true,   of: false,  fv: false,  fs: false  },
  { feature: '3D Mesh Generator',         glowx: true,   of: false,  fv: false,  fs: false  },
  { feature: 'AI Reply Suggestions',      glowx: true,   of: false,  fv: true,   fs: false  },
  { feature: 'Dedicated Phone Lines',     glowx: true,   of: false,  fv: false,  fs: false  },
  { feature: 'PayPal Payouts',            glowx: true,   of: false,  fv: true,   fs: true   },
  { feature: 'SMS Fan Alerts (Twilio)',   glowx: true,   of: false,  fv: false,  fs: false  },
  { feature: 'PWA Push Notifications',   glowx: true,   of: false,  fv: false,  fs: false  },
  { feature: 'Live Streaming',            glowx: true,   of: true,   fv: true,   fs: true   },
  { feature: 'Tip / Gifting',            glowx: true,   of: true,   fv: true,   fs: true   },
]

function Cell({ val }: { val: boolean | string }) {
  if (val === true)  return <span style={{ color: 'var(--green)', fontSize: '1.1rem' }}>✓</span>
  if (val === false) return <span style={{ color: 'var(--red)',   fontSize: '1.1rem' }}>✗</span>
  return <span style={{ color: 'var(--text)', fontSize: '0.82rem' }}>{val}</span>
}

export function ComparisonTable() {
  return (
    <div style={{ overflowX: 'auto', marginTop: 40 }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 560 }}>
        <thead>
          <tr>
            {['Feature', 'GLOWX', 'OnlyFans', 'Fanvue', 'Fansly'].map((h, i) => (
              <th key={h} style={{
                padding: '16px 20px',
                fontFamily: "'DM Mono', monospace", fontSize: '0.6rem',
                letterSpacing: '3px', textTransform: 'uppercase',
                borderBottom: i === 1 ? '2px solid var(--gold)' : '2px solid rgba(201,168,76,0.2)',
                textAlign: i === 0 ? 'left' : 'center',
                color: i === 1 ? 'var(--gold)' : 'var(--text)',
                background: i === 1 ? 'rgba(201,168,76,0.08)' : 'transparent',
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.feature}>
              <td style={{
                padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                fontSize: '0.82rem', color: 'var(--white2)', fontWeight: 400, textAlign: 'left',
              }}>{r.feature}</td>
              {[r.glowx, r.of, r.fv, r.fs].map((v, i) => (
                <td key={i} style={{
                  padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
                  textAlign: 'center',
                  background: i === 0 ? 'rgba(201,168,76,0.04)' : 'transparent',
                }}>
                  <Cell val={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
