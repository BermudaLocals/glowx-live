'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

const BANNERS: Record<string,string> = {
  fitness:'linear-gradient(135deg,#1a0a2e,#2d1b4e)',
  art:'linear-gradient(135deg,#0a1a1a,#1a3333)',
  lifestyle:'linear-gradient(135deg,#1a0a0a,#3d1515)',
  music:'linear-gradient(135deg,#050510,#0d0d2b)',
  gaming:'linear-gradient(135deg,#0a1a0a,#1a2b1a)',
  education:'linear-gradient(135deg,#0a0a1a,#15152b)',
}
const EMOJIS: Record<string,string> = {fitness:'💪',art:'🎨',lifestyle:'✨',music:'🎵',gaming:'🎮',education:'📚'}
const POST_BG = ['linear-gradient(135deg,#0d0d1a,#1a1a3d)','linear-gradient(135deg,#0a1a15,#0d2b22)','linear-gradient(135deg,#1a0d00,#2b1800)','linear-gradient(135deg,#050510,#0d0d2b)','linear-gradient(135deg,#0a1a0a,#1a2b1a)','linear-gradient(135deg,#0a0a1a,#15152b)']
const POST_EMOJI = ['💪','🎨','✨','🎵','🥗','📸']

export default function ProfilePage() {
  const params = useParams()
  const handle = params?.handle as string
  const [creator, setCreator] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [subscribed, setSubscribed] = useState(false)
  const [activeTier, setActiveTier] = useState(0)

  useEffect(() => {
    if (!handle) return
    Promise.all([
      fetch(`/api/creators?q=${handle}&limit=1`).then(r=>r.json()),
      fetch(`/api/posts?limit=6`).then(r=>r.json()),
    ]).then(([cd,pd]) => {
      setCreator(cd.creators?.[0] ?? null)
      setPosts(pd.posts ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [handle])

  if (loading) return <div style={{padding:'140px 48px',color:'var(--text)',fontFamily:"'DM Mono',monospace",fontSize:'0.7rem'}}>Loading…</div>
  if (!creator) return <div style={{padding:'140px 48px',color:'var(--text)'}}>Creator not found.</div>

  const banner = BANNERS[creator.category] ?? BANNERS.lifestyle
  const emoji  = EMOJIS[creator.category]  ?? '⭐'
  const tiers  = creator.tiers ?? []

  return (
    <div>
      <div style={{height:280,background:banner,position:'relative',marginTop:80}}>
        <div style={{position:'absolute',bottom:-44,left:48,width:96,height:96,borderRadius:'50%',border:'4px solid var(--gold)',background:'var(--dark2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.4rem'}}>{emoji}</div>
      </div>
      <div style={{padding:'64px 48px 60px'}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:20,marginBottom:40}}>
          <div>
            <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:6}}>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2.5rem',fontWeight:600}}>{creator.displayName}</h1>
              {creator.isVerified && <span style={{padding:'2px 10px',fontFamily:"'DM Mono',monospace",fontSize:'0.5rem',letterSpacing:'2px',textTransform:'uppercase',background:'rgba(201,168,76,0.15)',color:'var(--gold)',border:'1px solid rgba(201,168,76,0.3)'}}>✓ Verified</span>}
            </div>
            <div style={{fontFamily:"'DM Mono',monospace",fontSize:'0.6rem',color:'var(--text)',letterSpacing:'3px',marginBottom:14}}>@{creator.handle}</div>
            <p style={{fontSize:'0.85rem',color:'var(--text)',lineHeight:1.7,maxWidth:560}}>{creator.bio}</p>
            <div style={{display:'flex',gap:28,marginTop:16}}>
              <div><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.4rem',fontWeight:600}}>{(creator._count?.subscribers??0).toLocaleString()}</span><span style={{fontSize:'0.65rem',color:'var(--text)',marginLeft:6}}>fans</span></div>
              <div><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'1.4rem',fontWeight:600}}>{creator._count?.posts??0}</span><span style={{fontSize:'0.65rem',color:'var(--text)',marginLeft:6}}>posts</span></div>
            </div>
          </div>
          <div style={{display:'flex',gap:10}}>
            <a href="/fan/messages"><button className="btn-ghost" style={{padding:'12px 20px'}}>Message</button></a>
            <button className="btn-gold" style={{padding:'12px 28px'}} onClick={()=>setSubscribed(true)}>
              {subscribed?'✅ Subscribed':'Subscribe'}
            </button>
          </div>
        </div>

        {tiers.length > 0 && (
          <div style={{marginBottom:48}}>
            <div className="section-label" style={{marginBottom:20}}>Choose Your Tier</div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))',gap:16}}>
              {tiers.map((t:any,i:number) => (
                <div key={t.id ?? i} onClick={()=>setActiveTier(i)} style={{
                  padding:24,cursor:'pointer',transition:'0.3s',
                  border:`1px solid ${activeTier===i?'var(--gold)':'rgba(201,168,76,0.15)'}`,
                  background:activeTier===i?'rgba(201,168,76,0.06)':'var(--dark3)',
                }}>
                  {i===1 && <div style={{marginBottom:8}}><span style={{padding:'2px 10px',fontFamily:"'DM Mono',monospace",fontSize:'0.5rem',letterSpacing:'2px',textTransform:'uppercase',background:'rgba(201,168,76,0.15)',color:'var(--gold)',border:'1px solid rgba(201,168,76,0.3)'}}>Most Popular</span></div>}
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:'0.58rem',letterSpacing:'3px',color:'var(--text)',textTransform:'uppercase',marginBottom:12}}>{t.name}</div>
                  <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:'2.4rem',color:'var(--gold)',fontWeight:600}}>${t.price}</div>
                  <div style={{fontSize:'0.65rem',color:'var(--text)',marginBottom:16}}>/month</div>
                  <ul style={{listStyle:'none',marginBottom:20}}>
                    {(t.perks??[]).map((p:string,pi:number) => (
                      <li key={pi} style={{fontSize:'0.72rem',color:'var(--text)',padding:'6px 0',borderBottom:'1px solid rgba(255,255,255,0.04)',display:'flex',alignItems:'center',gap:8}}>
                        <span style={{color:'var(--gold)',fontSize:'0.6rem'}}>✦</span>{p}
                      </li>
                    ))}
                  </ul>
                  <button className="btn-gold" style={{width:'100%',padding:12}} onClick={()=>setSubscribed(true)}>
                    Subscribe — ${t.price}/mo
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="section-label" style={{marginBottom:20}}>Posts ({posts.length})</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:20}}>
          {posts.slice(0,6).map((p:any,i:number) => (
            <div key={p.id} style={{background:'var(--dark2)',border:'1px solid rgba(201,168,76,0.1)',overflow:'hidden'}}>
              <div style={{height:180,background:POST_BG[i%6],display:'flex',alignItems:'center',justifyContent:'center',fontSize:'2.5rem',position:'relative'}}>
                {POST_EMOJI[i%6]}
                {p.isLocked && (
                  <div style={{position:'absolute',inset:0,background:'rgba(5,5,5,0.7)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:6}}>
                    <div style={{fontSize:'1.2rem'}}>🔒</div>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:'0.56rem',color:'var(--gold)'}}>PPV ${p.ppvPrice?.toFixed(2)??'9.99'}</div>
                  </div>
                )}
              </div>
              <div style={{padding:16}}>
                <div style={{fontSize:'0.8rem',color:'var(--white2)',marginBottom:10}}>{p.title??'Exclusive Post'}</div>
                <div style={{display:'flex',gap:12}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.54rem',color:'var(--text)'}}>❤️ {p.likes??0}</span>
                  {p.isLocked
                    ? <button className="btn-gold" style={{padding:'5px 14px',fontSize:'0.54rem',marginLeft:'auto'}}>Unlock</button>
                    : <span style={{fontFamily:"'DM Mono',monospace",fontSize:'0.54rem',color:'var(--green)',marginLeft:'auto'}}>Free</span>
                  }
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
