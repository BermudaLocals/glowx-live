'use client'
import { signIn } from 'next-auth/react'
import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail]   = useState('')
  const [role, setRole]     = useState<'FAN' | 'CREATOR'>('FAN')
  const [sent, setSent]     = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSignup = async () => {
    if (!email) return
    setLoading(true)
    await signIn('email', { email, redirect: false, callbackUrl: role === 'CREATOR' ? '/creator/studio' : '/fan/discover' })
    setSent(true)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '0 24px', background: 'var(--black)',
    }}>
      <div style={{ background: 'var(--dark2)', border: '1px solid rgba(201,168,76,0.2)', padding: 48, maxWidth: 440, width: '100%' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.8rem', color: 'var(--gold)', letterSpacing: '8px', marginBottom: 24 }}>GLOWX</div>
        </Link>

        <div className="section-label" style={{ marginBottom: 8 }}>Join</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, marginBottom: 8 }}>Start Your Empire</h1>
        <p style={{ fontSize: '0.78rem', color: 'var(--text)', marginBottom: 28, lineHeight: 1.6 }}>
          Create your free GLOWX account and start earning in minutes.
        </p>

        {sent ? (
          <div style={{ padding: 20, background: 'rgba(76,201,138,0.08)', borderLeft: '3px solid var(--green)' }}>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', color: 'var(--green)', marginBottom: 6 }}>CHECK YOUR EMAIL</div>
            <p style={{ fontSize: '0.8rem', color: 'var(--white2)', lineHeight: 1.6 }}>Magic link sent to <strong>{email}</strong>. Click it to activate your account.</p>
          </div>
        ) : (
          <>
            {/* Role selector */}
            <div style={{ marginBottom: 20 }}>
              <label className="form-label">I am a</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {(['FAN', 'CREATOR'] as const).map(r => (
                  <div key={r} onClick={() => setRole(r)} style={{
                    padding: '14px', textAlign: 'center', cursor: 'pointer',
                    border: `1px solid ${role === r ? 'var(--gold)' : 'rgba(201,168,76,0.2)'}`,
                    background: role === r ? 'rgba(201,168,76,0.08)' : 'transparent',
                    transition: '0.2s',
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{r === 'FAN' ? '❤️' : '⭐'}</div>
                    <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.6rem', letterSpacing: '2px', color: role === r ? 'var(--gold)' : 'var(--text)' }}>{r}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSignup() }}
                placeholder="you@example.com" />
            </div>

            <button className="btn-gold" style={{ width: '100%', padding: '14px', fontSize: '0.68rem' }}
              onClick={handleSignup} disabled={loading}>
              {loading ? 'Creating account…' : 'Create Account Free'}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '20px 0', fontFamily: "'DM Mono',monospace", fontSize: '0.55rem', color: 'var(--text)' }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />or<div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <button className="btn-ghost" style={{ width: '100%', padding: '12px', fontSize: '0.62rem' }}
              onClick={() => signIn('google', { callbackUrl: role === 'CREATOR' ? '/creator/studio' : '/fan/discover' })}>
              Continue with Google
            </button>

            <p style={{ fontSize: '0.6rem', color: 'var(--text)', marginTop: 20, textAlign: 'center', lineHeight: 1.6 }}>
              By signing up you confirm you are 18+ and agree to our Terms of Service.
            </p>
          </>
        )}

        <p style={{ fontSize: '0.65rem', color: 'var(--text)', marginTop: 20, textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/auth/login" style={{ color: 'var(--gold)', textDecoration: 'none' }}>Log in →</Link>
        </p>
      </div>
    </div>
  )
}
