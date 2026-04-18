'use client'
import { useState } from 'react'

export function PayoutCalculator() {
  const [gross, setGross] = useState(10000)
  const net  = Math.round(gross * 0.8)
  const fee  = gross - net

  return (
    <div style={{
      background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.2)', padding: 36,
    }}>
      <div className="section-label">The 80% Reality Check</div>
      <input type="range" min={1000} max={50000} step={500} value={gross}
        onChange={e => setGross(+e.target.value)}
        style={{ width: '100%', marginBottom: 24 }} />
      {[
        { label: 'Monthly Gross', val: `$${gross.toLocaleString()}`, color: 'var(--gold)' },
        { label: 'Your Payout (80%)', val: `$${net.toLocaleString()}`, color: 'var(--white)' },
        { label: 'Platform Fee (20%)', val: `$${fee.toLocaleString()}`, color: 'var(--text)' },
      ].map(r => (
        <div key={r.label} style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text)', fontWeight: 300 }}>{r.label}</span>
          <span style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: '1.3rem',
            fontWeight: 600, color: r.color,
          }}>{r.val}</span>
        </div>
      ))}
      <div style={{
        marginTop: 20, padding: 18,
        background: 'rgba(201,168,76,0.06)', borderLeft: '3px solid var(--gold)',
      }}>
        <div style={{ fontSize: '0.78rem', lineHeight: 1.6, color: 'var(--white2)' }}>
          Same <strong style={{ color: 'var(--gold)' }}>${(net / 1000).toFixed(0)}k</strong> in your pocket —
          but <strong style={{ color: 'var(--gold)' }}>9 more tools</strong> to grow it to{' '}
          <strong style={{ color: 'var(--green)' }}>${((gross * 2) / 1000).toFixed(0)}k</strong>.
        </div>
      </div>
    </div>
  )
}
