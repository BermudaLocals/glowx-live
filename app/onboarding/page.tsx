'use client'
import { useState, useRef } from 'react'

const SLIDES = [
  {headline:"Top creators earn over $10,000 per month", emoji:"💰💰💰"},
  {headline:"One platform. Built to make creators money", emoji:"🌍"},
  {headline:"Keep 90% from day one. 92% after your first week", emoji:"🪙"},
  {headline:"Analytics built to grow your income", emoji:"📊"},
  {headline:"Refer a creator. Earn 10% of their income", emoji:"🥧"},
  {headline:"Verified fast. Earning faster", emoji:"✅"},
]

export default function OnboardingFixed(){
  const [idx, setIdx] = useState(0)
  const sx = useRef(0)
  const go = (d:number)=> setIdx(i=> Math.max(0, Math.min(SLIDES.length-1, i+d)))

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFF7FA] to-[#FFE3F0] flex items-center justify-center p-4 relative">
      <div className="w-full max-w-[512px] min-h-[85vh] flex flex-col justify-between bg-white/60 backdrop-blur rounded-[32px] p-8 shadow-xl border border-white">
        <div>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#FF2E93] to-[#7B3FF2] grid place-items-center text-white font-extrabold mx-auto mb-8">G</div>
          
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" style={{transform:`translateX(-${idx*100}%)`}}>
              {SLIDES.map((s,i)=>(
                <div key={i} className="min-w-full flex flex-col items-center text-center">
                  <div className="w-[200px] h-[200px] rounded-[24px] bg-gradient-to-br from-[#FFE3F0] to-white grid place-items-center text-6xl mb-6 shadow-inner">{s.emoji}</div>
                  <h2 className="text-[28px] font-extrabold leading-tight max-w-[360px] text-[#2A1030]">{s.headline}</h2>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between mt-8">
            <button disabled={idx===0} onClick={()=>go(-1)} className="w-11 h-11 rounded-full bg-white border border-[#F1E6EF] grid place-items-center disabled:opacity-30">‹</button>
            <div className="flex gap-2">
              {SLIDES.map((_,i)=><button key={i} onClick={()=>setIdx(i)} className={`h-2 rounded-full transition-all ${i===idx?'w-6 bg-[#FF2E93]':'w-2 bg-[#E8D5E0]'}`} />)}
            </div>
            <button onClick={()=>go(1)} className={`w-11 h-11 rounded-full grid place-items-center ${idx===SLIDES.length-1?'opacity-0 pointer-events-none':'bg-[#FF2E93] text-white'}`}>›</button>
          </div>
        </div>

        <div className="mt-8">
          <p className="text-[11px] text-[#7A6680] text-center mb-4">By becoming a creator on [BRAND] you reconfirm your agreement to our <a className="underline" href="#">Terms</a>, <a className="underline" href="#">Acceptable Use</a>, and <a className="underline" href="#">Privacy</a></p>
          <a href="/home" className="w-full h-14 rounded-full bg-gradient-to-r from-[#FF2E93] to-[#7B3FF2] text-white font-bold grid place-items-center shadow-lg hover:translate-y-[-2px] transition">Start earning</a>
          <a href="/home" className="block text-center text-[13px] text-[#7A6680] mt-3 hover:text-black">Close</a>
        </div>
      </div>

      {/* Swipe area */}
      <div className="absolute inset-0"
        onTouchStart={e=> sx.current = e.touches[0].clientX}
        onTouchEnd={e=>{
          const dx=e.changedTouches[0].clientX - sx.current
          if(Math.abs(dx)>50) go(dx<0?1:-1)
        }}
      />
    </div>
  )
}
