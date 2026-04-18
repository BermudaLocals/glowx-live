'use client'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

export function GlowxNav() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const isCreator = session?.user?.role === 'CREATOR' || session?.user?.creator

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
      padding: '20px 48px', display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      background: 'rgba(5,5,5,0.92)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(201,168,76,0.08)',
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem',
          fontWeight: 300, letterSpacing: '8px', color: 'var(--gold)', textTransform: 'uppercase',
        }}>
          GL<span style={{ fontStyle: 'italic', color: 'var(--gold2)' }}>O</span>WX
        </div>
      </Link>

      <ul style={{ display: 'flex', gap: '32px', listStyle: 'none', alignItems: 'center' }}>
        {[
          { href: '/fan/discover', label: 'Discover' },
          { href: '/fan/feed', label: 'Feed' },
          { href: '/fan/messages', label: 'Messages' },
          ...(isCreator ? [{ href: '/creator/studio', label: 'Studio' }] : []),
        ].map(({ href, label }) => (
          <li key={href}>
            <Link href={href} style={{
              fontFamily: "'DM Mono', monospace", fontSize: '0.6rem',
              letterSpacing: '3px', textTransform: 'uppercase', textDecoration: 'none',
              color: pathname.startsWith(href) ? 'var(--gold)' : 'var(--white2)',
              transition: 'color 0.3s',
            }}>{label}</Link>
          </li>
        ))}
        {session && (
          <li>
            <Link href="/fan/notifications" style={{
              fontFamily: "'DM Mono', monospace", fontSize: '0.8rem',
              textDecoration: 'none', color: 'var(--white2)',
            }}>🔔</Link>
          </li>
        )}
      </ul>

      <div style={{ display: 'flex', gap: '10px' }}>
        {session ? (
          <>
            <span style={{
              fontFamily: "'DM Mono', monospace", fontSize: '0.6rem',
              color: 'var(--text)', display: 'flex', alignItems: 'center',
            }}>{session.user?.name ?? session.user?.email}</span>
            <button className="btn-ghost" onClick={() => signOut({ callbackUrl: '/' })}
              style={{ padding: '8px 16px', fontSize: '0.6rem' }}>
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/auth/login">
              <button className="btn-ghost" style={{ padding: '10px 20px' }}>Log In</button>
            </Link>
            <Link href="/auth/signup">
              <button className="btn-gold" style={{ padding: '10px 24px' }}>Join Free</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}
