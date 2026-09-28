'use client'
import { useState } from 'react'

export default function BuilderPage() {
  const [name, setName] = useState('Karima Style - ORIGINAL')
  const [loading, setLoading] = useState(false)
  const [morphs, setMorphs] = useState({ age: 24, skinTone: 50, hairStyle: 'long_wavy', bodyType: 'slim_curvy' })

  const createPersona = async () => {
    setLoading(true)
    const res = await fetch('/api/builder/create', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ displayName: name, morphJson: morphs, isAi: true })
    })
    const data = await res.json()
    if(data.url) window.location.href = data.url
    else alert(data.error)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900 rounded-2xl p-2 inline-block mb-4 text-xs">AI-Generated Profile • Disclosure required</div>
        <h1 className="text-4xl font-bold mb-2">GlowX Persona Studio</h1>
        <p className="text-zinc-400 mb-8">Build original realistic persona. No cloning karimaluvx. All media gets #AI badge. $9.99 build, $29/mo Pro.</p>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-zinc-900 p-6 rounded-xl">
            <label className="text-sm">Original Name</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full mt-2 p-3 bg-black rounded border border-zinc-700" />
            <div className="mt-6 space-y-4">
              <div><label>Age {morphs.age} (18+ only)</label><input type="range" min="18" max="35" value={morphs.age} onChange={e=>setMorphs({...morphs, age: parseInt(e.target.value)})} className="w-full" /></div>
              <div><label>Skin Tone</label><input type="range" min="0" max="100" value={morphs.skinTone} onChange={e=>setMorphs({...morphs, skinTone: parseInt(e.target.value)})} className="w-full" /></div>
            </div>
            <button onClick={createPersona} disabled={loading} className="w-full mt-8 bg-white text-black py-3 rounded-xl font-bold">{loading? 'Creating...' : 'Pay & Build $9.99'}</button>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl"><div className="aspect-[3/4] bg-black rounded-xl flex items-center justify-center border border-zinc-800">Preview {name}</div><p className="mt-4 text-xs text-zinc-400">Emulate karimaluvx vibe = selfie + lifestyle, pores, 85mm, but NEW face. Never copy exact likeness.</p></div>
        </div>
      </div>
    </div>
  )
}
