'use client'
import { motion } from 'framer-motion'

export function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      style={{
        position: 'fixed', inset: 0, background: 'var(--black)',
        zIndex: 9000, display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexDirection: 'column', gap: 24,
        padding: '0 24px',
      }}>
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
        <div style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: '3rem',
          color: 'var(--gold)', letterSpacing: '12px', textAlign: 'center', marginBottom: 16,
        }}>
          GL<span style={{ fontStyle: 'italic', color: 'var(--gold2)' }}>O</span>WX
        </div>
        <div style={{
          fontFamily: "'DM Mono', monospace", fontSize: '0.6rem',
          letterSpacing: '6px', color: 'var(--text)', textAlign: 'center',
          textTransform: 'uppercase', marginBottom: 32,
        }}>18+ Content Platform</div>
        <p style={{
          fontSize: '0.85rem', color: 'var(--text)', textAlign: 'center',
          maxWidth: 420, lineHeight: 1.7, marginBottom: 36, margin: '0 auto 36px',
        }}>
          GlowX is a premium adult creator platform. By continuing you confirm
          you are 18 years of age or older and consent to viewing mature content.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-gold"
            style={{ padding: '14px 40px', fontSize: '0.7rem' }}
            onClick={onConfirm}>
            I Am 18+ — Enter
          </button>
          <button className="btn-ghost"
            style={{ padding: '14px 28px' }}
            onClick={() => { window.location.href = 'https://google.com' }}>
            Exit
          </button>
        </div>
        <p style={{
          fontFamily: "'DM Mono', monospace", fontSize: '0.5rem',
          color: 'var(--dark4)', textAlign: 'center', marginTop: 32,
        }}>
          © 2026 GLOWX · DOLLAR DOUBLE EMPIRE
        </p>
      </motion.div>
    </motion.div>
  )
}
