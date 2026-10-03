'use client'
import { useState, useEffect, useRef } from 'react'

// === ADD YOUR REAL DATA HERE ===
const featured = [
  {name:"Sofia Martinez", title:"Professional golfer", img:"https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&q=80"},
  {name:"Aitana Lopez", title:"AI Influencer", img:"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80"},
  {name:"Elena Rossi", title:"Football Journalist", img:"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80"},
  {name:"Mia Chen", title:"Fitness Coach", img:"https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80"},
]

const suggested = [
  {name:"Summyahmarie", handle:"@legendary.myahh", banner:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", avatar:"https://i.pravatar.cc/150?img=32"},
  {name:"Whatevaacecewants", handle:"@whatevaacecewants", banner:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80", avatar:"https://i.pravatar.cc/150?img=26"},
  {name:"Inas X", handle:"@inasx", banner:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", avatar:"https://i.pravatar.cc/150?img=5"},
  {name:"Lena Wilde", handle:"@lena", banner:"https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&q=80", avatar:"https://i.pravatar.cc/150?img=16"},
  {name:"Ruby Cole", handle:"@ruby", banner:"https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&q=80", avatar:"https://i.pravatar.cc/150?img=8"},
  {name:"Ava Stone", handle:"@ava", banner:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80", avatar:"https://i.pravatar.cc/150?img=29"},
]

export default function HomeFixed(){
  const [heroIdx, setHeroIdx] = useState(0)
  const [featIdx, setFeatIdx] = useState(0)
  const [sPage, setSPage] = useState(0)
  const [followed, setFollowed] = useState<Set<string>>(new Set())
  const featRef = useRef<HTMLDivElement>(null)
  const totalSPages = Math.ceil(suggested.length/3)

  // Hero rotates every 6s
  useEffect(()=>{
    const id=setInterval(()=>setHeroIdx(i=>(i+1)%3),6000)
    return ()=>clearInterval(id)
  },[])

  // Featured auto slides every 3s - FIXED: now actually moves
  useEffect(()=>{
    const id=setInterval(()=>{
      setFeatIdx(i=>{
        const next=(i+1)%featured.length
        if(featRef.current){
          const w=290 // 270 + gap
          featRef.current.scrollTo({left: next*w, behavior:'smooth'})
        }
        return next
      })
    },3000)
    return ()=>clearInterval(id)
  },[])

  const toggleFollow = (h:string)=>{
    setFollowed(prev=>{
      const n=new Set(prev)
      if(n.has(h)) n.delete(h); else n.add(h)
      // TODO: CALL YOUR BACKEND API HERE
      // fetch('/api/follow',{method:'POST',body:JSON.stringify({handle:h, follow:n.has(h)})})
      return n
    })
  }

  return (
    <div className="min-h-screen bg-[#FFF7FA] flex">
      {/* LEFT SIDEBAR - 72px fixed like Fanvue */}
      <aside className="w-[72px] bg-white border-r border-[#F1E6EF] fixed left-0 top-0 bottom-0 z-50 flex flex-col items-center py-4 gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#0AE775] grid place-items-center font-bold text-sm">F</div>
        <button className="w-11 h-11 rounded-xl bg-[#FFE3F0] text-[#FF2E93] grid place-items-center">🏠</button>
        <button className="w-11 h-11 rounded-xl hover:bg-[#FFF0F6] grid place-items-center">💬</button>
        <button className="w-11 h-11 rounded-xl hover:bg-[#FFF0F6] grid place-items-center">🔔</button>
        <button className="w-11 h-11 rounded-xl hover:bg-[#FFF0F6] grid place-items-center">🔍</button>
        <button className="w-11 h-11 rounded-xl hover:bg-[#FFF0F6] grid place-items-center">💲</button>
        <button className="w-11 h-11 rounded-xl hover:bg-[#FFF0F6] grid place-items-center">👥</button>
        <button className="w-11 h-11 rounded-xl hover:bg-[#FFF0F6] grid place-items-center">👑</button>
        <div className="mt-auto flex flex-col gap-3 items-center">
          <button className="w-11 h-11 rounded-xl hover:bg-[#FFF0F6] grid place-items-center">🎁</button>
          <img src="https://i.pravatar.cc/150?img=32" className="w-9 h-9 rounded-full" alt="me" />
        </div>
      </aside>

      <main className="ml-[72px] flex-1 p-6 max-w-[1600px]">
        {/* TOP BAR like Fanvue */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[22px] font-bold">Home</h1>
          <div className="flex items-center gap-3">
            <div className="h-9 px-4 rounded-full bg-white border border-[#F1E6EF] flex items-center gap-2 text-sm font-semibold shadow-sm">0.00 <span className="text-[10px]">💲</span></div>
            <button className="w-9 h-9 rounded-full bg-white border border-[#F1E6EF] grid place-items-center">💬</button>
            <button className="w-9 h-9 rounded-full bg-white border border-[#F1E6EF] grid place-items-center">🔔</button>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          {/* MAIN COLUMN - 70% */}
          <div className="flex-1 min-w-0">
            {/* HERO - matches Fanvue hero */}
            <div className="relative h-[70vh] min-h-[520px] rounded-[24px] overflow-hidden bg-black">
              <img src={["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200","https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200","https://images.unsplash.com/photo-1517841905240-472988babdf9?w=1200"][heroIdx]} alt="" className="absolute inset-0 w-full h-full object-cover opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-white via-white/70 to-transparent" />
              <div className="absolute inset-0 grid place-items-center text-center p-8">
                <div className="max-w-[520px]">
                  <h2 className="text-[clamp(28px,4vw,40px)] font-extrabold leading-[1.05] text-black">The No1 AI monetisation platform made for Creators trusted by Icons.</h2>
                  <a href="/onboarding" className="inline-flex mt-5 h-11 px-6 rounded-full bg-[#0AE775] text-black font-bold hover:scale-[1.02] transition">Become a creator</a>
                </div>
              </div>
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {[0,1,2].map(i=><button key={i} onClick={()=>setHeroIdx(i)} className={`h-1.5 rounded-full transition-all ${i===heroIdx?'w-6 bg-black':'w-1.5 bg-black/30'}`} />)}
              </div>
            </div>

            {/* FEATURED CAROUSEL - FIXED MOVING */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[18px]">Featured Creators</h3>
                <div className="flex gap-2">
                  <button onClick={()=>{
                    const n=(featIdx-1+featured.length)%featured.length
                    setFeatIdx(n)
                    featRef.current?.scrollTo({left:n*290, behavior:'smooth'})
                  }} className="w-8 h-8 rounded-full bg-white border grid place-items-center">‹</button>
                  <button onClick={()=>{
                    const n=(featIdx+1)%featured.length
                    setFeatIdx(n)
                    featRef.current?.scrollTo({left:n*290, behavior:'smooth'})
                  }} className="w-8 h-8 rounded-full bg-white border grid place-items-center">›</button>
                </div>
              </div>
              <div ref={featRef} className="flex gap-5 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-2">
                {featured.map(c=>(
                  <div key={c.name} className="w-[270px] h-[400px] rounded-[24px] overflow-hidden relative flex-shrink-0 snap-start bg-[#111] group cursor-pointer hover:scale-[1.02] transition">
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-3 text-white">
                      <div className="font-extrabold uppercase">{c.name}</div>
                      <div className="text-[#FF8CC6] italic text-sm font-serif">{c.title}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR - SUGGESTED LIKE FANVUE IMAGE - 340px sticky */}
          <aside className="w-[340px] flex-shrink-0 sticky top-6">
            <h3 className="font-bold text-[18px] mb-3">Suggested Creators</h3>
            <div className="flex flex-col gap-3">
              {suggested.slice(sPage*3, sPage*3+3).map(c=>{
                const isF=followed.has(c.handle)
                return (
                  <div key={c.handle} className="h-[130px] rounded-[16px] overflow-hidden relative bg-[#111] group">
                    <img src={c.banner} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    {/* Avatar like Fanvue */}
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-3">
                      <img src={c.avatar} alt={c.name} className="w-[72px] h-[72px] rounded-full border-2 border-white object-cover" />
                      <div className="text-white">
                        <div className="font-bold text-[15px] leading-tight">{c.name}</div>
                        <div className="text-white/70 text-[12px]">{c.handle}</div>
                      </div>
                    </div>
                    <button onClick={()=>toggleFollow(c.handle)} className={`absolute right-2 top-2 h-7 px-3 rounded-full text-[12px] font-bold transition ${isF?'bg-transparent border border-white text-white':'bg-white text-black hover:scale-105'}`}>
                      {isF?'Following':'Follow'}
                    </button>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-center gap-3 mt-4">
              <button onClick={()=>setSPage(p=>(p-1+totalSPages)%totalSPages)} className="w-7 h-7 rounded-full bg-white border grid place-items-center">‹</button>
              <div className="flex gap-1.5">
                {Array.from({length:totalSPages}).map((_,i)=><div key={i} className={`w-1.5 h-1.5 rounded-full ${i===sPage?'bg-black w-3':'bg-black/20'}`} />)}
              </div>
              <button onClick={()=>setSPage(p=>(p+1)%totalSPages)} className="w-7 h-7 rounded-full bg-white border grid place-items-center">›</button>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}
