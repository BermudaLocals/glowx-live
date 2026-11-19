'use client'
import { useEffect, useRef, useState } from 'react'
import GlowXLogo from '../components/GlowXLogo'

type Status = { live: boolean; viewers: number; hlsUrl: string | null }
type Setup = { server: string; streamKey: string }

function loadHls(): Promise<any> {
  return new Promise((resolve, reject) => {
    const w = window as any
    if (w.Hls) return resolve(w.Hls)
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/hls.js@1'
    s.onload = () => resolve(w.Hls)
    s.onerror = reject
    document.head.appendChild(s)
  })
}

export default function LivePage() {
  const [status, setStatus] = useState<Status | null>(null)
  const [setup, setSetup] = useState<Setup | null>(null)
  const [creatorKey, setCreatorKey] = useState('')
  const [setupErr, setSetupErr] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)

  // Poll live status
  useEffect(() => {
    let stop = false
    const tick = () => fetch('/api/live/status').then(r => r.json()).then(d => { if (!stop) setStatus(d) }).catch(() => {})
    tick()
    const id = setInterval(tick, 10000)
    return () => { stop = true; clearInterval(id) }
  }, [])

  // Attach player when live
  useEffect(() => {
    if (!status?.live || !status.hlsUrl || !videoRef.current) return
    const video = videoRef.current
    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = status.hlsUrl // Safari native HLS
      video.play().catch(() => {})
      return
    }
    let hls: any
    loadHls().then(Hls => {
      if (!Hls.isSupported()) return
      hls = new Hls({ liveSyncDurationCount: 3 })
      hls.loadSource(status.hlsUrl!)
      hls.attachMedia(video)
      video.play().catch(() => {})
    }).catch(() => {})
    return () => { hls?.destroy?.() }
  }, [status?.live, status?.hlsUrl])

  const loadSetup = async () => {
    setSetupErr('')
    const r = await fetch('/api/live/setup', { headers: { 'x-creator-key': creatorKey } })
    if (!r.ok) { setSetupErr('Wrong creator key'); return }
    const d = await r.json()
    setSetup(d)
    localStorage.setItem('glowx_key', creatorKey)
  }

  useEffect(() => {
    const saved = localStorage.getItem('glowx_key')
    if (saved) setCreatorKey(saved)
  }, [])

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white">
      <header className="border-b border-white/10 bg-[#0A0A0F]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-[1100px] mx-auto px-5 h-16 flex items-center justify-between">
          <a href="/"><GlowXLogo size={30} /></a>
          <a href="/home" className="text-sm text-white/60 hover:text-white transition">Back to Home</a>
        </div>
      </header>

      <main className="max-w-[1100px] mx-auto px-5 py-10">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight">GlowX <span className="text-glow-gradient">Live</span></h1>
          {status?.live ? (
            <span className="inline-flex items-center gap-1.5 bg-red-600 text-xs font-extrabold px-3 py-1 rounded-full">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" /> LIVE {status.viewers > 0 && `· ${status.viewers} watching`}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 bg-white/10 text-white/60 text-xs font-bold px-3 py-1 rounded-full">OFFLINE</span>
          )}
        </div>

        {/* PLAYER / OFFLINE */}
        {status?.live && status.hlsUrl ? (
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-black aspect-video">
            <video ref={videoRef} controls autoPlay muted className="w-full h-full" />
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-white/15 glass-card aspect-video grid place-items-center text-center p-8">
            <div>
              <div className="w-16 h-16 mx-auto mb-4 opacity-70"><GlowXLogo size={64} withWordmark={false} /></div>
              <p className="text-xl font-bold">No live stream right now</p>
              <p className="text-white/50 text-sm mt-2">Check back soon — this page updates automatically when a creator goes live.</p>
            </div>
          </div>
        )}

        {/* CREATOR SETUP */}
        <div className="mt-10 rounded-3xl glass-card p-8">
          <h2 className="text-xl font-extrabold mb-1">Go live on GlowX</h2>
          <p className="text-white/50 text-sm mb-6">Creators broadcast with OBS Studio (free). Enter your creator key to see your stream settings.</p>

          {!setup ? (
            <div className="flex gap-3 max-w-md">
              <input
                type="password"
                value={creatorKey}
                onChange={e => setCreatorKey(e.target.value)}
                placeholder="Creator key"
                className="flex-1 h-11 px-4 rounded-xl bg-white/5 border border-white/15 text-sm outline-none focus:border-pink-500"
              />
              <button onClick={loadSetup} className="h-11 px-6 rounded-xl glow-gradient font-bold text-sm hover:scale-[1.02] transition">Unlock</button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="text-xs text-white/50 mb-1">OBS → Settings → Stream → Server</div>
                    <code className="text-sm text-pink-400 break-all">{setup.server}</code>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="text-xs text-white/50 mb-1">Stream Key (keep private)</div>
                  <code className="text-sm text-pink-400 break-all">{setup.streamKey}</code>
                </div>
              </div>
              <ol className="text-sm text-white/70 space-y-2 list-decimal list-inside">
                <li>Download OBS Studio (free) from obsproject.com and install it.</li>
                <li>In OBS: Settings → Stream → Service: <b>Custom</b>.</li>
                <li>Paste the <b>Server</b> and <b>Stream Key</b> above, then Apply.</li>
                <li>Recommended output: 1280×720, 2500 kbps, keyframe interval 2s.</li>
                <li>Press <b>Start Streaming</b> in OBS — you appear on this page within ~15 seconds.</li>
              </ol>
            </div>
          )}
          {setupErr && <p className="text-red-400 text-sm mt-3">{setupErr}</p>}
        </div>
      </main>
    </div>
  )
}
