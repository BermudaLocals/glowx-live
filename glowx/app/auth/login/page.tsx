'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail]   = useState('')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const handleMagicLink = async () => {
    if (!email) return
    setLoading(true)
    await signIn('email', { email, redirect: false, callbackUrl: '/fan/feed' })
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 24px',
      background: 'var(--black)',
    }}>
      <div style={{
        background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.2)',
        padding: '48px', maxWidth: 420, width: '100%',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', color: 'var(--gold)', letterSpacing: '8px', marginBottom: 24 }}>GLOWX</div>
        </Link>

        <div className="section-label" style={{ marginBottom: 8 }}>Welcome back</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, marginBottom: 8 }}>Log In</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--text)', marginBottom: 28, lineHeight: 1.6 }}>Access your GLOWX account via magic link.</p>

        {sent ? (
          <div style={{ padding: 20, background: 'rgba(76,201,138,0.08)', borderLeft: '3px solid var(--green)', marginBottom: 20 }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', color: 'var(--green)', marginBottom: 6 }}>CHECK YOUR EMAIL</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--white2)', lineHeight: 1.6 }}>We sent a magic link to <strong>{email}</strong>. Click it to sign in.</p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleMagicLink() }}
                placeholder="you@example.com" />
            </div>
            <button className="btn-gold" style={{ width: '100%', padding: '14px', fontSize: '0.68rem' }}
              onClick={handleMagicLink} disabled={loading}>
              {loading ? 'Sending…' : 'Send Magic Link'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', fontFamily: "'DM Mono',monospace", fontSize: '0.55rem', color: 'var(--text)' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />or<div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <button className="btn-ghost" style={{ width: '100%', padding: '12px', fontSize: '0.62rem' }}
              onClick={() => signIn('google', { callbackUrl: '/fan/feed' })}>
              Continue with Google
            </button>
          </>
        )}

        <p style={{ fontSize: '0.65rem', color: 'var(--text)', marginTop: 24, textAlign: 'center' }}>
          No account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Join free →</Link>
        </p>
      </div>
    </div>
  )
}
