'use client'
import { useState, useEffect, useRef } from 'react'

type Post = {
  id: string
  author: string
  text: string
  images: string[]
  isAi: boolean
  createdAt: string
}

export default function UploadPage() {
  const [key, setKey] = useState('')
  const [author, setAuthor] = useState('')
  const [text, setText] = useState('')
  const [isAi, setIsAi] = useState(true)
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')
  const [posts, setPosts] = useState<Post[]>([])
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setKey(localStorage.getItem('glowx_key') || '')
    setAuthor(localStorage.getItem('glowx_author') || '')
    loadPosts()
  }, [])

  const loadPosts = () => {
    fetch('/api/posts').then(r => r.json()).then(d => setPosts(d.posts || [])).catch(() => {})
  }

  const onPick = (list: FileList | null) => {
    if (!list) return
    const picked = Array.from(list).slice(0, 10)
    setFiles(picked)
    setPreviews(picked.map(f => URL.createObjectURL(f)))
  }

  const publish = async () => {
    setBusy(true)
    setMsg('')
    try {
      const fd = new FormData()
      fd.set('text', text)
      fd.set('author', author)
      fd.set('isAi', String(isAi))
      files.forEach(f => fd.append('images', f))
      const res = await fetch('/api/posts', { method: 'POST', headers: { 'x-upload-key': key }, body: fd })
      const data = await res.json()
      if (!res.ok) {
        setMsg('Error: ' + (data.error || res.status))
      } else {
        localStorage.setItem('glowx_key', key)
        localStorage.setItem('glowx_author', author)
        setMsg('Posted! It is live on the home feed now.')
        setText('')
        setFiles([])
        setPreviews([])
        if (fileRef.current) fileRef.current.value = ''
        loadPosts()
      }
    } catch (e: any) {
      setMsg('Upload failed: ' + (e?.message || 'network error'))
    }
    setBusy(false)
  }

  const remove = async (id: string) => {
    if (!confirm('Delete this post and its images?')) return
    const res = await fetch('/api/posts?id=' + id, { method: 'DELETE', headers: { 'x-upload-key': key } })
    if (res.ok) loadPosts()
    else setMsg('Delete failed — check your key')
  }

  return (
    <div className="min-h-screen bg-[#FFF7FA] text-black p-6">
      <div className="max-w-[640px] mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-[22px] font-bold">New Post</h1>
          <a href="/home" className="text-sm font-semibold text-[#FF2E93]">View home feed →</a>
        </div>

        <div className="bg-white rounded-[20px] border border-[#F1E6EF] p-5 flex flex-col gap-4">
          <div>
            <label className="text-sm font-semibold">Your upload key</label>
            <input
              type="password"
              value={key}
              onChange={e => setKey(e.target.value)}
              placeholder="Required to publish"
              className="w-full mt-1 p-3 rounded-xl border border-[#F1E6EF] bg-[#FFF7FA]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Posting as (creator name)</label>
            <input
              value={author}
              onChange={e => setAuthor(e.target.value)}
              placeholder="e.g. Sofia Martinez"
              className="w-full mt-1 p-3 rounded-xl border border-[#F1E6EF] bg-[#FFF7FA]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Story text</label>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              rows={4}
              placeholder="Write the caption / story..."
              className="w-full mt-1 p-3 rounded-xl border border-[#F1E6EF] bg-[#FFF7FA] min-h-[120px]"
            />
          </div>
          <div>
            <label className="text-sm font-semibold">Images (up to 10)</label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              onChange={e => onPick(e.target.files)}
              className="w-full mt-1 text-sm"
            />
            {previews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
                {previews.map(p => <img key={p} src={p} alt="" className="w-full h-24 object-cover rounded-lg" />)}
              </div>
            )}
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isAi} onChange={e => setIsAi(e.target.checked)} />
            This is AI-generated content (shows the AI badge — required for synthetic personas)
          </label>
          <button
            onClick={publish}
            disabled={busy || !key}
            className="h-11 rounded-full bg-[#0AE775] font-bold hover:scale-[1.01] transition disabled:opacity-50"
          >
            {busy ? 'Publishing...' : 'Publish post'}
          </button>
          {msg && <p className="text-sm font-semibold">{msg}</p>}
        </div>

        <h2 className="font-bold text-[18px] mt-8 mb-3">Your posts ({posts.length})</h2>
        <div className="flex flex-col gap-3">
          {posts.map(p => (
            <div key={p.id} className="bg-white rounded-[16px] border border-[#F1E6EF] p-4">
              <div className="flex items-center justify-between">
                <div className="font-bold text-sm">
                  {p.author} {p.isAi && <span className="text-[10px] bg-black text-white px-2 py-0.5 rounded-full ml-1">AI</span>}
                </div>
                <button onClick={() => remove(p.id)} className="text-xs font-bold text-[#FF2E93]">Delete</button>
              </div>
              <div className="text-xs text-black/50">{new Date(p.createdAt).toLocaleString()}</div>
              {p.text && <p className="text-sm mt-2 whitespace-pre-wrap">{p.text}</p>}
              {p.images.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {p.images.map(src => <img key={src} src={src} alt="" className="w-full h-24 object-cover rounded-lg" />)}
                </div>
              )}
            </div>
          ))}
          {posts.length === 0 && <p className="text-sm text-black/50">No posts yet — your first one will appear here and on the home feed.</p>}
        </div>
      </div>
    </div>
  )
}
