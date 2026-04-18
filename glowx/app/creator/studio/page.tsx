'use client'
import { useState, Suspense, lazy } from 'react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { StudioDashboard } from './tabs/StudioDashboard'
import { StudioPost }      from './tabs/StudioPost'
import { StudioScheduler } from './tabs/StudioScheduler'
import { StudioEarnings }  from './tabs/StudioEarnings'
import { StudioSubs }      from './tabs/StudioSubs'
import { StudioSettings }  from './tabs/StudioSettings'

const StudioMesh = lazy(() =>
  import('./tabs/StudioMesh').then(m => ({ default: m.StudioMesh }))
)

const TABS = [
  { id: 'dashboard',   label: '📊 Dashboard'  },
  { id: 'post',        label: '✏️ New Post'   },
  { id: 'scheduler',   label: '📅 Scheduler'  },
  { id: 'mesh',        label: '🔮 3D Mesh'    },
  { id: 'earnings',    label: '💰 Earnings'   },
  { id: 'subscribers', label: '👥 Subscribers'},
  { id: 'settings',    label: '⚙️ Settings'   },
]

export default function StudioPage() {
  const { data: session, status } = useSession()
  const [tab, setTab] = useState('dashboard')

  if (status === 'loading') return <div style={{ padding: '120px 48px', color: 'var(--text)' }}>Loading…</div>
  if (!session) { redirect('/auth/login'); return null }

  const renderTab = () => {
    switch (tab) {
      case 'dashboard':   return <StudioDashboard />
      case 'post':        return <StudioPost />
      case 'scheduler':   return <StudioScheduler />
      case 'mesh':        return <Suspense fallback={<div style={{ padding: 40, color: 'var(--text)' }}>Loading 3D engine…</div>}><StudioMesh /></Suspense>
      case 'earnings':    return <StudioEarnings />
      case 'subscribers': return <StudioSubs />
      case 'settings':    return <StudioSettings />
      default:            return <StudioDashboard />
    }
  }

  const isMesh = tab === 'mesh'

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - 80px)' }}>
      {/* Sidebar */}
      <div style={{
        width: 220, background: 'var(--dark)',
        borderRight: '1px solid rgba(201,168,76,0.1)',
        padding: '24px 0', flexShrink: 0,
        position: 'sticky', top: 80, height: 'calc(100vh - 80px)',
        overflowY: 'auto',
      }}>
        <div style={{ padding: '0 24px 20px', borderBottom: '1px solid rgba(201,168,76,0.1)', marginBottom: 8 }}>
          <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', color: 'var(--text)', letterSpacing: '2px' }}>
            CREATOR STUDIO
          </div>
        </div>
        {TABS.map(t => (
          <div key={t.id} onClick={() => setTab(t.id)}
            style={{
              padding: '12px 24px',
              fontFamily: "'DM Mono',monospace", fontSize: '0.58rem',
              letterSpacing: '2px', textTransform: 'uppercase',
              color: tab === t.id ? 'var(--gold)' : 'var(--text)',
              cursor: 'pointer', transition: '0.2s',
              borderLeft: tab === t.id ? '2px solid var(--gold)' : '2px solid transparent',
              background: tab === t.id ? 'rgba(201,168,76,0.06)' : 'transparent',
            }}
            onMouseEnter={e => { if (tab !== t.id) (e.currentTarget as HTMLDivElement).style.color = 'var(--white2)' }}
            onMouseLeave={e => { if (tab !== t.id) (e.currentTarget as HTMLDivElement).style.color = 'var(--text)' }}>
            {t.label}
          </div>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: isMesh ? 0 : 40, overflowY: isMesh ? 'hidden' : 'auto' }}>
        {renderTab()}
      </div>
    </div>
  )
}
