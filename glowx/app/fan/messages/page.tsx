'use client'
import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { getPusherClient, channels, events } from '@/lib/pusher'

type Message = { id: string; body: string; senderId: string; sender: { name: string }; createdAt: string }
type Convo   = { userId: string; name: string; handle: string; avatar: string; preview: string }

const DEMO_CONVOS: Convo[] = [
  { userId: 'c1', name: 'Aurora Skye',  handle: '@aurorasky', avatar: '🌟', preview: 'Hey! Thanks for subscribing 💛' },
  { userId: 'c2', name: 'Mila Voss',    handle: '@milavoss',  avatar: '🎨', preview: 'Vol. 3 drops Friday!' },
  { userId: 'c3', name: 'Jade Moreau',  handle: '@jademo',    avatar: '✨', preview: 'Bali was absolutely insane' },
]

export default function MessagesPage() {
  const { data: session } = useSession()
  const [convos]     = useState<Convo[]>(DEMO_CONVOS)
  const [active, setActive]   = useState<Convo>(DEMO_CONVOS[0])
  const [messages, setMessages] = useState<{ body: string; sent: boolean }[]>([
    { body: 'Hey! Thanks so much for subscribing 💛', sent: false },
    { body: "Love your content! When's the next workout dropping?", sent: true },
    { body: 'Tomorrow morning 6am — going to be intense 🔥', sent: false },
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  useEffect(() => {
    if (!session?.user?.id) return
    const pusher = getPusherClient()
    if (!pusher) return
    const channel = pusher.subscribe(channels.dm(session.user.id))
    channel.bind(events.NEW_MESSAGE, (data: { body: string }) => {
      setMessages(m => [...m, { body: data.body, sent: false }])
    })
    return () => { pusher.unsubscribe(channels.dm(session.user.id)) }
  }, [session])

  const send = async () => {
    if (!input.trim()) return
    const body = input.trim()
    setInput('')
    setMessages(m => [...m, { body, sent: true }])
    setSending(true)
    await fetch('/api/messages', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ receiverId: active.userId, body }),
    }).catch(() => {})
    setSending(false)
    // Simulate reply in demo
    setTimeout(() => {
      const replies = ['Got it! 💛', 'That sounds great!', "I'll keep you posted 🔥", 'Thanks for reaching out!']
      setMessages(m => [...m, { body: replies[Math.floor(Math.random() * replies.length)], sent: false }])
    }, 1400)
  }

  const sidebarStyle: React.CSSProperties = {
    width: 280, borderRight: '1px solid rgba(201,168,76,0.1)', overflowY: 'auto', flexShrink: 0,
  }

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 80px)', marginTop: 80 }}>
      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={{ padding: '20px 20px 12px', borderBottom: '1px solid rgba(201,168,76,0.1)' }}>
          <div className="section-label" style={{ margin: 0 }}>Messages</div>
        </div>
        {convos.map(c => (
          <div key={c.userId} onClick={() => { setActive(c); setMessages([{ body: c.preview, sent: false }]) }}
            style={{
              padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer', transition: '0.2s',
              background: active.userId === c.userId ? 'rgba(201,168,76,0.06)' : 'transparent',
            }}
            onMouseEnter={e => { if (active.userId !== c.userId) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.02)' }}
            onMouseLeave={e => { if (active.userId !== c.userId) (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ fontSize: '1.4rem' }}>{c.avatar}</div>
              <div>
                <div style={{ fontSize: '0.82rem', fontWeight: 500, marginBottom: 2 }}>{c.name}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text)', fontWeight: 300 }}>{c.preview.slice(0, 30)}…</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thread */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(201,168,76,0.1)', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '1.4rem' }}>{active.avatar}</div>
          <div>
            <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{active.name}</div>
            <div style={{ fontFamily: "'DM Mono',monospace", fontSize: '0.54rem', color: 'var(--text)' }}>{active.handle}</div>
          </div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {messages.map((m, i) => (
            <div key={i} style={{
              maxWidth: '70%', padding: '12px 16px',
              background: m.sent ? 'linear-gradient(135deg,var(--gold3),var(--gold))' : 'var(--dark3)',
              color: m.sent ? 'var(--black)' : 'var(--white2)',
              alignSelf: m.sent ? 'flex-end' : 'flex-start',
              fontSize: '0.8rem', lineHeight: 1.6,
            }}>{m.body}</div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(201,168,76,0.1)', display: 'flex', gap: 12 }}>
          <input className="form-input" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Send a message…" style={{ flex: 1 }} />
          <button className="btn-gold" onClick={send} disabled={sending}
            style={{ padding: '0 24px', fontSize: '0.65rem', whiteSpace: 'nowrap' }}>
            {sending ? '…' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  )
}
