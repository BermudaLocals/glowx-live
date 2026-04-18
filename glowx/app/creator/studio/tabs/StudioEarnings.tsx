'use client'
import { useState } from 'react'

const earningsData = [
  { month: 'Jul', val: 3200 }, { month: 'Aug', val: 4100 }, { month: 'Sep', val: 3800 },
  { month: 'Oct', val: 5600 }, { month: 'Nov', val: 6200 }, { month: 'Dec', val: 7400 },
  { month: 'Jan', val: 8100 }, { month: 'Feb', val: 7900 }, { month: 'Mar', val: 9300 },
]

const transactions = [
  { type: 'Subscription', fan: '@glowxfan99',    amount: 19.99,  date: 'Today, 9:14am',    status: 'completed' },
  { type: 'Tip',          fan: '@top_tipper',     amount: 50.00,  date: 'Today, 8:02am',    status: 'completed' },
  { type: 'PPV Unlock',   fan: '@sub_4422',       amount: 14.99,  date: 'Yesterday',         status: 'completed' },
  { type: 'Subscription', fan: '@fan_user_001',   amount: 9.99,   date: 'Yesterday',         status: 'completed' },
  { type: 'Tip',          fan: '@subscriber_x',   amount: 25.00,  date: '2 days ago',       status: 'completed' },
  { type: 'Payout',       fan: 'PayPal Payout',   amount: -5000,  date: 'Mar 28',           status: 'paid' },
]

export function StudioEarnings() {
  const [payoutAmt, setPayoutAmt] = useState('7472')
  const [requesting, setRequesting] = useState(false)
  const [done, setDone] = useState(false)
  const max = Math.max(...earningsData.map(d => d.val))

  const requestPayout = async () => {
    setRequesting(true)
    const res = await fetch('/api/payouts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: parseFloat(payoutAmt) }),
    })
    setRequesting(false)
    setDone(true)
    setTimeout(() => setDone(false), 4000)
  }

  return (
    <div>
      <div className="section-label">Finance</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 300, marginBottom: 32 }}>Earnings Overview</h2>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'Total Earned',    val: '$55,650', delta: '↑ All time',           gold: false },
          { label: 'This Month',      val: '$9,340',  delta: '↑ 14.2% vs last month', gold: false },
          { label: 'Pending Payout',  val: '$7,472',  delta: 'Ready to withdraw',     gold: true  },
          { label: 'Avg Per Sub',     val: '$0.75',   delta: '↑ 8% vs last month',   gold: false },
        ].map(s => (
          <div key={s.label} style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', letterSpacing: '2px', color: 'var(--text)', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 600, color: s.gold ? 'var(--gold)' : 'var(--white)' }}>{s.val}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: s.gold ? 'var(--gold)' : 'var(--green)', marginTop: 4 }}>{s.delta}</div>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 28, marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 8 }}>Revenue — Last 9 Months</div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160, paddingTop: 16 }}>
          {earningsData.map(d => (
            <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: '100%', borderRadius: '2px 2px 0 0',
                background: 'linear-gradient(to top,var(--gold3),var(--gold))',
                height: `${Math.round((d.val / max) * 140)}px`, minHeight: 4, transition: 'height 0.6s ease',
              }} />
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.5rem', color: 'var(--text)' }}>{d.month}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* Transactions */}
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Transaction Log</div>
          {transactions.map((t, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <div>
                <div style={{ fontSize: '0.78rem', color: 'var(--white2)', marginBottom: 2 }}>{t.type} · <span style={{ color: 'var(--text)' }}>{t.fan}</span></div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.52rem', color: 'var(--text)' }}>{t.date}</div>
              </div>
              <div style={{
                fontFamily: "'Cormorant Garamond',serif", fontSize: '1.1rem', fontWeight: 600,
                color: t.amount < 0 ? 'var(--text)' : 'var(--green)',
              }}>
                {t.amount < 0 ? `−$${Math.abs(t.amount).toFixed(2)}` : `+$${t.amount.toFixed(2)}`}
              </div>
            </div>
          ))}
        </div>

        {/* Payout box */}
        <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.2)', padding: 28 }}>
          <div className="section-label" style={{ marginBottom: 16 }}>Request PayPal Payout</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.5rem', fontWeight: 600, color: 'var(--gold)', marginBottom: 4 }}>$7,472.00</div>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--text)', marginBottom: 24 }}>Available balance</div>

          <div style={{ marginBottom: 14 }}>
            <label className="form-label">PayPal Email</label>
            <input className="form-input" defaultValue="creator@example.com" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Amount ($)</label>
            <input className="form-input" type="number" value={payoutAmt} max="7472" min="25"
              onChange={e => setPayoutAmt(e.target.value)} />
          </div>

          <button className="btn-gold" style={{ width: '100%', padding: '14px', fontSize: '0.65rem' }}
            onClick={requestPayout} disabled={requesting}>
            {requesting ? 'Processing…' : done ? '✅ Payout Requested!' : '💰 Withdraw via PayPal'}
          </button>
          <p style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.56rem', color: 'var(--text)', marginTop: 12, lineHeight: 1.6 }}>
            Minimum $25 · Arrives 1–2 business days · Powered by PayPal Payouts API
          </p>
        </div>
      </div>
    </div>
  )
}
