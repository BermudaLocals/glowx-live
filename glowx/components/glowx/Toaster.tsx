'use client'
import { useState, useEffect, createContext, useContext, useCallback } from 'react'

type Toast = { id: string; message: string; type?: 'success' | 'error' | 'info' }
type ToastCtx = { toast: (msg: string, type?: Toast['type']) => void }

const ToastContext = createContext<ToastCtx>({ toast: () => {} })
export const useToast = () => useContext(ToastContext)

export function Toaster() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            background: 'var(--dark2)',
            border: `1px solid ${t.type === 'error' ? 'var(--red)' : 'var(--gold)'}`,
            padding: '14px 20px',
            fontFamily: "'DM Mono', monospace", fontSize: '0.62rem', letterSpacing: '1px',
            color: t.type === 'error' ? 'var(--red)' : 'var(--gold)',
            maxWidth: 300,
            animation: 'fadeUp 0.3s ease',
          }}>{t.message}</div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
