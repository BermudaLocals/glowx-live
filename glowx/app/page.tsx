'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const HERO_VIDEOS = [
  'https://videos.pexels.com/video-files/18069234/18069234-uhd_1440_1440_24fps.mp4',
  'https://videos.pexels.com/video-files/3191576/3191576-hd_1280_720_25fps.mp4'
]

export default function LandingPage() {
  const [vidIndex, setVidIndex] = useState(0)
  useEffect(()=>{
    const i = setInterval(()=> setVidIndex(v=> (v+1)%HERO_VIDEOS.length), 6000)
    return ()=> clearInterval(i)
  },[])

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <nav className="absolute top-0 w-full z-50 flex justify-between items-center p-6 px-8">
        <div className="font-black text-xl tracking-tighter">GLOWX</div>
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2 rounded-full bg-zinc-800 text-sm">Login</Link>
          <Link href="/home" className="px-5 py-2 rounded-full bg-[#b4ff39] text-black font-bold text-sm">Sign up</Link>
        </div>
      </nav>

      <section className="relative h- w-full overflow-hidden rounded-b-">
        {HERO_VIDEOS.map((src, idx)=>(
          <video key={src} autoPlay muted loop playsInline
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${idx===vidIndex?'opacity-100':'opacity-0'}`}
            src={src} />
        ))}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute bottom-0 left-0 p-10 md:p-20 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold leading-[0.9]">The No1 AI monetisation platform<br/>made for Creators trusted by Icons.</h1>
          <div className="flex gap-4 mt-8">
            <Link href="/myprofile/creator-onboarding" className="px-8 py-4 rounded-full bg-[#b4ff39] text-black font-bold">Become a creator</Link>
            <Link href="/home" className="px-8 py-4 rounded-full bg-white/10 backdrop-blur border border-white/20">Discover Creators</Link>
          </div>
        </div>
      </section>

      <section className="px-8 py-12">
        <h2 className="text-xl font-bold mb-6">Featured Creators</h2>
        <div className="grid grid-cols-4 gap-4">
          {[1,2,3,4].map(i=>(
            <div key={i} className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 relative">
              <video autoPlay muted loop playsInline className="w-full h-full object-cover" src={HERO_VIDEOS[0]} />
              <div className="absolute bottom-0 p-3 text-sm font-bold">@creator_{i}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
