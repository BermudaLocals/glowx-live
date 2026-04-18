'use client'
import { useState } from 'react'

const DEMO = [
  { id:'1', type:'NEW_POST',       title:'Aurora Skye posted',    body:'Morning HIIT Full 30 Min',           isRead:false, time:'2 min ago'  },
  { id:'2', type:'NEW_TIP',        title:'Tip received — $15',    body:'You received $15 from @fanuser42',   isRead:false, time:'14 min ago' },
  { id:'3', type:'LIVE',           title:'Jade Moreau went live', body:'Bali Sunset BTS — streaming now',    isRead:false, time:'1 hr ago'   },
  { id:'4', type:'SUB_RENEWED',    title:'Subscription renewed',  body:'Mila Voss subscription renewed',    isRead:true,  time:'3 hrs ago'  },
  { id:'5', type:'NEW_MESSAGE',    title:'New message',           body:'Vera Noir sent you a message',       isRead:true,  time:'5 hrs ago'  },
  { id:'6', type:'NEW_SUBSCRIBER', title:'New subscriber',        body:'@glowxfan99 joined your Premium tier', isRead:true, time:'Yesterday' },
  { id:'7', type:'PAYOUT',         title:'Payout processed',      body:'$5,000 sent to your PayPal account', isRead:true,  time:'2 days ago' },
]
const ICONS = { NEW_POST:'✨', NEW_TIP:'💰', LIVE:'🔴', SUB_RENEWED:'✅', NEW_MESSAGE:'💬', NEW_SUBSCRIBER:'🎉', PAYOUT:'💸' }

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState(DEMO)
  const [filter, setFilter] = useState('all')
  const unread = notifs.filter(n => !n.isRead).length
  const shown = filter === 'unread' ? notifs.filter(n => !n.isRead) : notifs

  return (
    <div style={{ padding:'100px 48px 60px', maxWidth:720 }}>
      <div className="section-label">Activity</div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:32 }}>
        <h1 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:300 }}>
          Notifications
          {unread > 0 && <span style={{ marginLeft:14, padding:'2px 12px', background:'var(--gold)', color:'var(--black)', fontFamily:"'DM Mono',monospace", fontSize:'0.65rem' }}>{unread}</span>}
        </h1>
        <button className="btn-ghost" style={{ padding:'8px 18px', fontSize:'0.58rem' }} onClick={() => setNotifs(n => n.map(x => ({...x, isRead:true})))}>Mark all read</button>
      </div>
      <div style={{ display:'flex', gap:10, marginBottom:24 }}>
        {['all','unread'].map(f => <button key={f} onClick={() => setFilter(f)} className={filter===f?'btn-gold':'btn-ghost'} style={{ padding:'7px 20px', fontSize:'0.58rem', textTransform:'capitalize' }}>{f}{f==='unread'&&unread>0?` (${unread})`:''}</button>)}
      </div>
      <div style={{ background:'var(--dark2)', border:'1px solid rgba(201,168,76,0.1)' }}>
        {shown.map(n => (
          <div key={n.id} onClick={() => setNotifs(prev => prev.map(x => x.id===n.id?{...x,isRead:true}:x))}
            style={{ padding:'18px 20px', borderBottom:'1px solid rgba(255,255,255,0.04)', display:'flex', gap:14, alignItems:'flex-start', cursor:'pointer', background:n.isRead?'transparent':'rgba(201,168,76,0.03)' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', flexShrink:0, marginTop:6, background:n.isRead?'var(--dark3)':'var(--gold)' }} />
            <div style={{ fontSize:'1.1rem' }}>{ICONS[n.type as keyof typeof ICONS] ?? '🔔'}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'0.82rem', marginBottom:3, color:n.isRead?'var(--white2)':'var(--white)', fontWeight:n.isRead?300:500 }}>{n.title}</div>
              <div style={{ fontSize:'0.74rem', color:'var(--text)', lineHeight:1.5, marginBottom:4 }}>{n.body}</div>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:'0.52rem', color:'var(--text)' }}>{n.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
