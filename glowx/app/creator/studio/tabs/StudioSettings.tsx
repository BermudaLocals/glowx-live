'use client'
import { useState } from 'react'

function Toggle({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div onClick={() => onChange(!value)} style={{
      width: 36, height: 18, borderRadius: 9, cursor: 'pointer',
      background: value ? 'var(--gold3)' : 'var(--dark3)',
      border: '1px solid rgba(201,168,76,0.2)', position: 'relative', transition: '0.3s',
    }}>
      <div style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', top: 2, left: value ? 20 : 2, transition: '0.3s', background: value ? 'var(--gold2)' : 'var(--text)' }} />
    </div>
  )
}

export function StudioSettings() {
  const [notifs, setNotifs] = useState({ newSubSMS: true, newTipSMS: true, newMsgSMS: false, pushNotifs: true })
  const [saved, setSaved] = useState(false)

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2500) }

  return (
    <div>
      <div className="section-label">Configuration</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 300, marginBottom: 32 }}>Creator Settings</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
        {/* Left column */}
        <div>
          {/* Profile */}
          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 28, marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 20 }}>Profile</div>
            {[
              { label: 'Display Name', placeholder: 'Your creator name', type: 'text'  },
              { label: 'Handle',       placeholder: '@yourhandle',        type: 'text'  },
            ].map(f => (
              <div key={f.label} style={{ marginBottom: 16 }}>
                <label className="form-label">{f.label}</label>
                <input className="form-input" type={f.type} placeholder={f.placeholder} />
              </div>
            ))}
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Bio</label>
              <textarea className="form-input" style={{ resize: 'vertical', minHeight: 80, lineHeight: 1.6 }}
                placeholder="Tell fans about yourself…" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Category</label>
              <select className="form-input" style={{ cursor: 'pointer' }}>
                {['Fitness', 'Art', 'Lifestyle', 'Music', 'Gaming', 'Education', 'Other'].map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <button className="btn-gold" style={{ padding: '12px 28px', fontSize: '0.62rem' }} onClick={save}>
              {saved ? '✅ Saved!' : 'Save Changes'}
            </button>
          </div>

          {/* PayPal */}
          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 28 }}>
            <div className="section-label" style={{ marginBottom: 20 }}>Payouts — PayPal</div>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">PayPal Payout Email</label>
              <input className="form-input" type="email" placeholder="you@example.com" />
            </div>
            <button className="btn-ghost" style={{ padding: '10px 20px', fontSize: '0.6rem' }} onClick={save}>
              {saved ? '✅ Updated!' : 'Update Email'}
            </button>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Twilio */}
          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 28, marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 20 }}>Twilio Dedicated Phone Line</div>
            <div style={{ padding: 16, background: 'rgba(76,201,138,0.06)', borderLeft: '3px solid var(--green)', marginBottom: 16 }}>
              <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.58rem', color: 'var(--green)', marginBottom: 6 }}>ACTIVE LINE</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 500 }}>+1 (555) 012-3456</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text)', marginTop: 4 }}>Fans text this number → routed to your GLOWX DMs</div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Area Code Preference</label>
              <input className="form-input" placeholder="e.g. 310" maxLength={3} />
            </div>
            <button className="btn-ghost" style={{ width: '100%', padding: '10px', fontSize: '0.6rem' }}
              onClick={() => alert('Twilio phone provisioning — calls /api/twilio/provision')}>
              Provision New Number
            </button>
          </div>

          {/* Notifications */}
          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 28, marginBottom: 20 }}>
            <div className="section-label" style={{ marginBottom: 20 }}>Notification Preferences</div>
            {[
              { key: 'newSubSMS',   label: 'New Subscriber — SMS'  },
              { key: 'newTipSMS',   label: 'New Tip — SMS'          },
              { key: 'newMsgSMS',   label: 'New Message — SMS'      },
              { key: 'pushNotifs',  label: 'Push Notifications (PWA)' },
            ].map(n => (
              <div key={n.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--white2)' }}>{n.label}</span>
                <Toggle
                  value={notifs[n.key as keyof typeof notifs]}
                  onChange={v => setNotifs(p => ({ ...p, [n.key]: v }))}
                />
              </div>
            ))}
          </div>

          {/* Subscription tiers */}
          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 28 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Subscription Tiers</div>
            {[
              { name: 'Basic Fan', price: '$9.99/mo', subs: 9840 },
              { name: 'Premium',   price: '$19.99/mo', subs: 2576 },
            ].map((t, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--white2)' }}>{t.name}</div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', color: 'var(--gold)', marginTop: 2 }}>{t.price} · {t.subs.toLocaleString()} subscribers</div>
                </div>
                <button className="btn-ghost" style={{ padding: '6px 14px', fontSize: '0.56rem' }}>Edit</button>
              </div>
            ))}
            <button className="btn-ghost" style={{ width: '100%', padding: '10px', fontSize: '0.6rem', marginTop: 14 }}>
              + Add New Tier
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
