'use client'
import { useState } from 'react'

export function StudioPost() {
  const [isPPV, setIsPPV]       = useState(false)
  const [platforms, setPlatforms] = useState({ glowx: true, fanvue: true, fansly: false })
  const [visibility, setVisibility] = useState('SUBSCRIBERS')
  const [title, setTitle]        = useState('')
  const [body, setBody]          = useState('')
  const [ppvPrice, setPpvPrice]  = useState('9.99')
  const [publishing, setPublishing] = useState(false)
  const [done, setDone]          = useState(false)

  const publish = async () => {
    setPublishing(true)
    await fetch('/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content: body, isPPV, ppvPrice: +ppvPrice, visibility, publishNow: true }),
    })
    setPublishing(false)
    setDone(true)
    setTimeout(() => setDone(false), 3000)
  }

  return (
    <div>
      <div className="section-label">Content</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 300, marginBottom: 32 }}>Create New Post</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>
        <div>
          {/* Upload area */}
          <div onClick={() => alert('File picker — connect to R2 upload endpoint')}
            style={{
              border: '2px dashed rgba(201,168,76,0.2)', padding: '48px 24px',
              textAlign: 'center', cursor: 'pointer', transition: '0.3s', marginBottom: 20,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLDivElement).style.background = 'rgba(201,168,76,0.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(201,168,76,0.2)'; (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}>
            <div style={{ fontSize: '2rem', marginBottom: 12 }}>📁</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text)' }}>
              Drag & drop media or click to browse<br />
              <span style={{ fontSize: '0.65rem', color: 'var(--dark4)' }}>JPG, PNG, MP4, MOV up to 4GB — stored on Cloudflare R2</span>
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Post Title</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your post a title…" />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Body Text</label>
            <textarea className="form-input" value={body} onChange={e => setBody(e.target.value)}
              placeholder="Describe your content…" style={{ resize: 'vertical', minHeight: 100, lineHeight: 1.6 }} />
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 8, flexWrap: 'wrap' }}>
            <button className="btn-gold" style={{ padding: '14px 32px', fontSize: '0.65rem' }}
              onClick={publish} disabled={publishing}>
              {publishing ? 'Publishing…' : done ? '✅ Published!' : 'Publish Now'}
            </button>
            <button className="btn-ghost" style={{ padding: '14px 24px', fontSize: '0.65rem' }}>
              Save Draft
            </button>
            <button className="btn-ghost" style={{ padding: '14px 24px', fontSize: '0.65rem' }}>
              Schedule →
            </button>
          </div>
        </div>

        {/* Settings sidebar */}
        <div>
          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24, marginBottom: 16 }}>
            <div className="section-label" style={{ marginBottom: 16 }}>Post Settings</div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Visibility</label>
              <select value={visibility} onChange={e => setVisibility(e.target.value)}
                style={{ background: 'var(--dark3)', border: '1px solid rgba(201,168,76,0.2)', color: 'var(--white2)', padding: '8px 10px', fontSize: '0.72rem', width: '100%', outline: 'none' }}>
                <option value="SUBSCRIBERS">Subscribers Only</option>
                <option value="PUBLIC">Public Preview</option>
                <option value="PPV">Pay Per View</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text)' }}>PPV Enabled</span>
              <div onClick={() => setIsPPV(v => !v)} style={{
                width: 36, height: 18, borderRadius: 9, cursor: 'pointer',
                background: isPPV ? 'var(--gold3)' : 'var(--dark3)',
                border: '1px solid rgba(201,168,76,0.2)', position: 'relative', transition: '0.3s',
              }}>
                <div style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', top: 2, left: isPPV ? 20 : 2, transition: '0.3s', background: isPPV ? 'var(--gold2)' : 'var(--text)' }} />
              </div>
            </div>

            {isPPV && (
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">PPV Price ($)</label>
                <input className="form-input" type="number" value={ppvPrice}
                  onChange={e => setPpvPrice(e.target.value)} placeholder="9.99" min="1" />
              </div>
            )}

            <div className="section-label" style={{ margin: '16px 0 12px' }}>Publish To Platforms</div>
            {(['glowx', 'fanvue', 'fansly'] as const).map(p => (
              <div key={p} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--white2)', textTransform: 'capitalize' }}>{p === 'glowx' ? 'GlowX (Native)' : p.charAt(0).toUpperCase() + p.slice(1)}</span>
                <div onClick={() => setPlatforms(prev => ({ ...prev, [p]: !prev[p] }))} style={{
                  width: 36, height: 18, borderRadius: 9, cursor: 'pointer',
                  background: platforms[p] ? 'var(--gold3)' : 'var(--dark3)',
                  border: '1px solid rgba(201,168,76,0.2)', position: 'relative', transition: '0.3s',
                }}>
                  <div style={{ position: 'absolute', width: 12, height: 12, borderRadius: '50%', top: 2, left: platforms[p] ? 20 : 2, transition: '0.3s', background: platforms[p] ? 'var(--gold2)' : 'var(--text)' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.1)', padding: 24 }}>
            <div className="section-label" style={{ marginBottom: 12 }}>Attach 3D Mesh</div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text)', marginBottom: 14, lineHeight: 1.5 }}>Generate a 3D asset in the Mesh Studio and attach it to this post.</p>
            <button className="btn-ghost" style={{ width: '100%', padding: '10px', fontSize: '0.6rem' }}>
              🔮 Open Mesh Generator
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
