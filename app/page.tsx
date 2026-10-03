'use client'
import { useEffect, useState, useRef } from 'react'

// ADD YOUR VIDEO URLS HERE - keep <5MB each, H.264 MP4 + WebM
const HERO_VIDEOS = [
  { src: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", poster: "https://images.unsplash.com/photo-1518834107812-67b0b288f498?w=1200&q=80" },
  { src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4", poster: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=80" },
  { src: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4", poster: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200&q=80" },
]

// ADD YOUR CREATOR DATA HERE
const featuredCreators = [
  {name:"Sofia Martinez", title:"Professional golfer", image:"https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&q=80", handle:"@sofia"},
  {name:"Aitana Lopez", title:"AI Influencer", image:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80", handle:"@fit_aitana"},
  {name:"Elena Rossi", title:"Football Journalist", image:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80", handle:"@elenar"},
  {name:"Mia Chen", title:"Fitness Coach", image:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80", handle:"@mia"},
  {name:"Bella Bianchi", title:"Lifestyle", image:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", handle:"@italianluna"},
]

const suggestedCreators = [
  {name:"Lena Wilde", handle:"@lena", banner:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80", avatar:"https://i.pravatar.cc/150?img=16"},
  {name:"Ruby Cole", handle:"@ruby", banner:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&q=80", avatar:"https://i.pravatar.cc/150?img=8"},
  {name:"Ava Stone", handle:"@ava", banner:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80", avatar:"https://i.pravatar.cc/150?img=29"},
  {name:"Mila J", handle:"@mila", banner:"https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&q=80", avatar:"https://i.pravatar.cc/150?img=33"},
  {name:"Chloe Hart", handle:"@chloe", banner:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80", avatar:"https://i.pravatar.cc/150?img=14"},
  {name:"Isla Moore", handle:"@isla", banner:"https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&q=80", avatar:"https://i.pravatar.cc/150?img=21"},
  {name:"Sienna B", handle:"@sienna", banner:"https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=400&q=80", avatar:"https://i.pravatar.cc/150?img=45"},
  {name:"Freya L", handle:"@freya", banner:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80", avatar:"https://i.pravatar.cc/150?img=18"},
  {name:"Poppy R", handle:"@poppy", banner:"https://images.unsplash.com/photo-1509967419535-6ab2e8d8b1c3?w=400&q=80", avatar:"https://i.pravatar.cc/150?img=6"},
]

export default function HomePage(){
  const [heroIdx, setHeroIdx] = useState(0)
  const [followed, setFollowed] = useState<Set<string>>(new Set())
  const [sPage, setSPage] = useState(0)
  const featRef = useRef<HTMLDivElement>(null)
  const totalPages = Math.ceil(suggestedCreators.length/3)

  // Hero rotation every 6s
  useEffect(()=>{
    const id = setInterval(()=> setHeroIdx(i => (i+1)%HERO_VIDEOS.length), 6000)
    return ()=> clearInterval(id)
  },[])

  // Pause when tab hidden
  useEffect(()=>{
    const handler = ()=>{ /* videos will auto pause via browser */ }
    document.addEventListener('visibilitychange', handler)
    return ()=> document.removeEventListener('visibilitychange', handler)
  },[])

  const toggleFollow = (handle:string)=>{
    setFollowed(prev=>{
      const n = new Set(prev)
      if(n.has(handle)) n.delete(handle)
      else n.add(handle)
      // TODO: CALL YOUR BACKEND API HERE
      // fetch('/api/follow', {method:'POST', body: JSON.stringify({handle, following: n.has(handle)})})
      return n
    })
  }

  return (
    <>
      <style>{`
        :root{--primary:#FF2E93;--secondary:#7B3FF2;--tint:#FFE3F0;--text:#2A1030;--text2:#7A6680;--bg:#FFF7FA;--shadow:0 8px 32px rgba(255,46,147,0.12)}
        .page{max-width:1440px;margin:0 auto;padding:24px;display:flex;gap:24px}
        .main-col{flex:1;min-width:0;width:70%}
        .side-col{width:30%;max-width:340px;position:sticky;top:24px}
        @media(max-width:1024px){.page{flex-direction:column}.main-col{width:100%}.side-col{width:100%;max-width:100%;position:static}}
        .hero{height:70vh;min-height:460px;border-radius:24px;overflow:hidden;position:relative;background:#FFE9F3;display:grid;place-items:center}
        .hero video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 1.2s}
        .hero video.active{opacity:1}
        .hero-grad{position:absolute;left:0;right:0;bottom:0;height:55%;background:linear-gradient(to top, var(--bg) 8%, transparent);z-index:1}
        .hero-content{position:relative;z-index:2;text-align:center}
        .hero-h1{font-size:clamp(32px,5vw,52px);font-weight:800;color:var(--text)}
        .hero-cta{display:inline-flex;height:52px;padding:0 28px;border-radius:999px;background:linear-gradient(90deg,var(--primary),var(--secondary));color:white;font-weight:700;margin-top:16px}
        .dots{position:absolute;bottom:18px;left:50%;transform:translateX(-50%);display:flex;gap:8px;z-index:3}
        .dot{width:8px;height:8px;border-radius:50%;background:rgba(42,16,48,.2);cursor:pointer}
        .dot.active{background:var(--primary);width:24px}
        .feat-track{display:flex;gap:20px;overflow-x:auto;scroll-snap-type:x mandatory;padding:4px}
        .feat-card{width:270px;height:430px;flex-shrink:0;border-radius:24px;overflow:hidden;position:relative;background:#2A1030}
        .feat-card img{width:100%;height:100%;object-fit:cover}
        .feat-grad{position:absolute;inset:0;background:linear-gradient(to top,#2A1030 0%,transparent 65%)}
        .feat-info{position:absolute;left:16px;bottom:16px}
        .feat-name{color:white;font-weight:800;text-transform:uppercase}
        .feat-title{color:#FF8CC6;font-style:italic;font-size:13px}
        .empty{padding:80px 24px;display:flex;flex-direction:column;align-items:center;background:white;border-radius:24px;border:1px dashed #F1C8DC;margin-top:24px;text-align:center}
        .x3d{width:120px;height:120px;position:relative;margin-bottom:24px;animation:float 3.2s ease-in-out infinite}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        .x-bar{position:absolute;left:50%;top:50%;width:28px;height:120px;border-radius:20px;background:linear-gradient(180deg,#FF5DB4,#FF2E93 45%,#E6006E)}
        .x-bar:first-child{transform:translate(-50%,-50%) rotate(45deg)}
        .x-bar:last-child{transform:translate(-50%,-50%) rotate(-45deg)}
        .s-card{height:130px;border-radius:16px;overflow:hidden;position:relative;background:#2A1030;margin-bottom:12px}
        .s-card img.banner{width:100%;height:100%;object-fit:cover}
        .s-grad{position:absolute;inset:0;background:linear-gradient(90deg,rgba(42,16,48,.75),rgba(42,16,48,.2) 60%)}
        .s-avatar{position:absolute;left:14px;top:50%;transform:translateY(-50%);width:64px;height:64px;border-radius:50%;border:3px solid var(--primary)}
        .s-info{position:absolute;left:92px;top:50%;transform:translateY(-50%)}
        .s-name{color:white;font-weight:700;font-size:14px}
        .s-handle{color:rgba(255,255,255,.7);font-size:12px}
        .follow{position:absolute;right:10px;top:10px;height:32px;padding:0 14px;border-radius:999px;background:white;color:var(--primary);font-weight:700;font-size:12px}
      `}</style>

      <div className="min-h-screen bg-[#FFF7FA]">
        <div className="page">
          <div className="main-col">
            {/* HERO */}
            <div className="hero">
              {HERO_VIDEOS.map((v,i)=>(
                <video key={i} className={i===heroIdx?'active':''} autoPlay muted loop playsInline poster={v.poster} src={v.src} />
              ))}
              <div className="hero-grad" />
              <div className="hero-content">
                <h1 className="hero-h1">[YOUR HEADLINE]</h1>
                <a href="#" className="hero-cta">[BUTTON TEXT]</a>
              </div>
              <div className="dots">
                {HERO_VIDEOS.map((_,i)=>(
                  <div key={i} onClick={()=>setHeroIdx(i)} className={`dot ${i===heroIdx?'active':''}`} />
                ))}
              </div>
            </div>

            {/* FEATURED */}
            <div className="mt-8">
              <h3 className="font-extrabold text-xl mb-3">Featured Creators</h3>
              <div className="feat-track" ref={featRef}>
                {featuredCreators.map(c=>(
                  <div key={c.handle} className="feat-card">
                    <img src={c.image} alt={c.name} />
                    <div className="feat-grad" />
                    <div className="feat-info">
                      <div className="feat-name">{c.name}</div>
                      <div className="feat-title">{c.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* EMPTY FEED */}
            {followed.size===0 && (
              <div className="empty">
                <div className="x3d"><div className="x-bar" /><div className="x-bar" /></div>
                <h3 className="font-extrabold text-[28px]">Create your feed</h3>
                <p className="text-[#7A6680] max-w-[340px] text-sm mt-2">Start following or subscribing to creators to fill your feed with content</p>
                <a href="#" className="mt-5 h-12 px-6 rounded-full bg-[#2A1030] text-white font-bold grid place-items-center hover:bg-[#FF2E93] transition">Discover Creators</a>
              </div>
            )}
          </div>

          <div className="side-col">
            <h3 className="font-extrabold text-lg mb-3">Suggested Creators</h3>
            {suggestedCreators.slice(sPage*3, sPage*3+3).map(c=>{
              const isFollowing = followed.has(c.handle)
              return (
                <div key={c.handle} className="s-card">
                  <img className="banner" src={c.banner} alt="" />
                  <div className="s-grad" />
                  <img className="s-avatar" src={c.avatar} alt={c.name} />
                  <div className="s-info">
                    <div className="s-name">{c.name}</div>
                    <div className="s-handle">{c.handle}</div>
                  </div>
                  <button onClick={()=>toggleFollow(c.handle)} className="follow">
                    {isFollowing?'Following':'Follow'}
                  </button>
                </div>
              )
            })}
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={()=>setSPage(p=> (p-1+Math.ceil(suggestedCreators.length/3))%Math.ceil(suggestedCreators.length/3))} className="w-8 h-8 rounded-full bg-white border grid place-items-center">‹</button>
              <div className="flex gap-1">
                {Array.from({length: Math.ceil(suggestedCreators.length/3)}).map((_,i)=>(
                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${i===sPage?'bg-[#FF2E93] w-4':'bg-[#E8D5E0]'}`} />
                ))}
              </div>
              <button onClick={()=>setSPage(p=> (p+1)%Math.ceil(suggestedCreators.length/3))} className="w-8 h-8 rounded-full bg-white border grid place-items-center">›</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
