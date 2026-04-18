'use client'
import { useEffect, useRef } from 'react'

export function GlowxCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mx = 0, my = 0, rx = 0, ry = 0
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY
      if (dotRef.current) { dotRef.current.style.left = `${mx}px`; dotRef.current.style.top = `${my}px` }
    }
    const animate = () => {
      rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12
      if (ringRef.current) { ringRef.current.style.left = `${rx}px`; ringRef.current.style.top = `${ry}px` }
      requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', onMove)
    animate()
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div ref={dotRef} style={{
        width: 8, height: 8, background: 'var(--gold)', borderRadius: '50%',
        position: 'fixed', pointerEvents: 'none', zIndex: 9999,
        transform: 'translate(-50%,-50%)', transition: 'transform 0.1s',
      }} />
      <div ref={ringRef} style={{
        width: 32, height: 32, border: '1px solid rgba(201,168,76,0.4)', borderRadius: '50%',
        position: 'fixed', pointerEvents: 'none', zIndex: 9998,
        transform: 'translate(-50%,-50%)',
      }} />
    </>
  )
}
