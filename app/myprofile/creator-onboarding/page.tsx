'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import GlowXLogo from '../../components/GlowXLogo'

const SLIDES = [
  { icon: '💰', title: 'Turn your content into\nmonthly income', vid: 'https://cdnl.iconscout.com/lottie/premium/thumb/coins-stack-3d-icon-download-in-lottie-json-gif-static-svg-file-formats--money-finance-pack-business-icons-9483973.mp4', color: 'from-[#7C3AED] to-[#EC4899]' },
  { icon: '🌍', title: 'One platform. Built\nto make creators money', color: 'from-purple-400 to-purple-700' },
  { icon: '📊', title: 'Analytics built to\ngrow your income', color: 'from-pink-400 to-pink-600' },
  { icon: '👥', title: 'Refer a creator. Earn\nwhen they earn', color: 'from-fuchsia-400 to-purple-500' },
  { icon: '✅', title: 'Verified fast. Earning\nfaster', color: 'from-pink-500 to-purple-700' },
]

export default function Onboarding() {
  const [active, setActive] = useState(0)
  useEffect(()=>{
    const t = setInterval(()=> setActive(s => (s+1)%SLIDES.length), 3000)
    return ()=> clearInterval(t)
  },[])

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-[#2A1030] flex flex-col items-center justify-between p-8">
      <div className="w-full flex justify-center pt-6">
        <GlowXLogo size={28} light={false} />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-lg">
        <div className={`w-40 h-40 rounded-3xl bg-gradient-to-br ${SLIDES[active].color} flex items-center justify-center text-7xl shadow-2xl transition-all duration-700`}>
          {SLIDES[active].icon}
        </div>
        <h1 className="text-4xl font-bold mt-10 whitespace-pre-line leading-tight">{SLIDES[active].title}</h1>

        <div className="flex gap-2 mt-12">
          {SLIDES.map((_,i)=><div key={i} className={`h-1.5 rounded-full transition-all ${i===active?'w-6 bg-[#EC4899]':'w-1.5 bg-zinc-300'}`} />)}
        </div>
      </div>

      <div className="w-full max-w-md">
        <p className="text-sm text-center text-zinc-500 mb-4">By becoming a creator on GlowX you reconfirm your agreement to our Terms & Conditions, Acceptable Use Policy, and Privacy Policy.</p>
        <Link href="/builder" className="block w-full text-center py-4 glow-gradient text-white rounded-full font-bold">Start earning</Link>
        <div className="flex justify-between mt-6 px-4">
          <button onClick={()=>setActive(a=>a===0?SLIDES.length-1:a-1)}>‹</button>
          <button onClick={()=>setActive(a=>(a+1)%SLIDES.length)}>›</button>
        </div>
      </div>
    </div>
  )
}
