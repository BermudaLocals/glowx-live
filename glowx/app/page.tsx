'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { PayoutCalculator } from '@/components/glowx/PayoutCalculator'
import { ComparisonTable } from '@/components/glowx/ComparisonTable'
import { FeaturesMega } from '@/components/glowx/FeaturesMega'
import { NetworkGrid } from '@/components/glowx/NetworkGrid'
import { AgeGate } from '@/components/glowx/AgeGate'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.8, ease: 'easeOut' } }),
}

export default function HomePage() {
  const [ageConfirmed, setAgeConfirmed] = useState(false)

  if (!ageConfirmed) return <AgeGate onConfirm={() => setAgeConfirmed(true)} />

  return (
    <>
      {/* HERO */}
      <section className="min-h-screen flex items-center px-12 py-32 relative overflow-hidden">
        <div className="absolute inset-0 hero-radial pointer-events-none" />
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 40% 40% at 10% 80%, rgba(201,168,76,0.04) 0%, transparent 60%)' }} />
        <div className="relative z-10 max-w-3xl">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-gold/30">
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse-slow" />
            <span className="font-mono text-gold uppercase tracking-widest" style={{ fontSize: '0.6rem' }}>
              The platform OnlyFans wishes it was
            </span>
          </motion.div>

          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
            className="font-serif font-light leading-none mb-6"
            style={{ fontSize: 'clamp(3.5rem, 7vw, 6rem)', lineHeight: 0.95 }}>
            <em className="italic text-gold">Same payout.</em>
            <strong className="font-semibold block">Ten times the platform.</strong>
          </motion.h1>

          <motion.p custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="text-sm leading-relaxed mb-10 font-light max-w-xl"
            style={{ color: 'var(--white2)' }}>
            GLOWX matches the industry-standard 80% payout — but gives you multi-platform scheduling,
            a 3D mesh generator, real-time DMs, Twilio phone lines, and AI tools to earn it with.
          </motion.p>

          <motion.div custom={3} variants={fadeUp} initial="hidden" animate="show"
            className="flex gap-4 flex-wrap items-center mb-8">
            <Link href="/auth/signup">
              <button className="btn-gold" style={{ padding: '16px 40px', fontSize: '0.72rem', letterSpacing: '3px' }}>
                Start Earning Free
              </button>
            </Link>
            <Link href="/fan/discover">
              <button className="btn-ghost" style={{ padding: '16px 28px' }}>Browse Creators</button>
            </Link>
          </motion.div>

          <motion.div custom={4} variants={fadeUp} initial="hidden" animate="show"
            className="flex flex-wrap gap-2">
            {['80% payout', 'AI DMs 24/7', 'Multi-platform post', '3D Mesh Studio',
              'Live + gifts', 'Twilio Phone Lines', '9 posts/day', 'PayPal Payouts'].map(p => (
              <div key={p} className="flex items-center gap-1.5 px-3 py-1.5 border border-gold/20"
                style={{ fontFamily: 'DM Mono', fontSize: '0.52rem', letterSpacing: '2px', color: 'var(--text)', textTransform: 'uppercase' }}>
                <span style={{ color: 'var(--gold)' }}>✦</span> {p}
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* NETWORK */}
      <section className="px-12 py-24" style={{ background: 'var(--dark)', borderTop: '1px solid rgba(201,168,76,0.2)' }}>
        <div className="section-label">The GLOWX Pipeline</div>
        <h2 className="section-title">Multi-Platform <em className="italic text-gold">Distribution</em></h2>
        <NetworkGrid />
      </section>

      {/* COMPARISON */}
      <section className="px-12 py-24">
        <div className="section-label">Why GLOWX</div>
        <h2 className="section-title"><em className="italic text-gold">Same cut.</em> <strong className="font-semibold">Infinite more power.</strong></h2>
        <ComparisonTable />
      </section>

      {/* FEATURES */}
      <section className="px-12 py-24" style={{ background: 'var(--dark)' }}>
        <div className="section-label">Platform Features</div>
        <h2 className="section-title">Everything you need to <em className="italic text-gold">dominate.</em></h2>
        <FeaturesMega />
      </section>

      {/* PAYOUT */}
      <section className="px-12 py-24">
        <div className="grid grid-cols-2 gap-20 items-center" style={{ gridTemplateColumns: '1fr 1fr' }}>
          <div>
            <div className="section-label">The Payout</div>
            <h2 className="section-title">
              Matches OnlyFans.<br />
              <em className="italic text-gold">Beats them everywhere else.</em>
            </h2>
            <p className="text-sm leading-relaxed mb-8 max-w-md" style={{ color: 'var(--text)', fontWeight: 300 }}>
              We pay 80% — just like OnlyFans. But for that same 20% fee, we give you an entire
              creator empire, not just a profile page.
            </p>
            {[
              { name: 'GLOWX', pct: 80, gold: true },
              { name: 'OnlyFans', pct: 80, gold: false },
              { name: 'Fanvue', pct: 85, gold: false },
              { name: 'Fansly', pct: 80, gold: false },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-4 mb-3">
                <div className="font-mono text-xs w-24" style={{ color: 'var(--text)' }}>{p.name}</div>
                <div className="flex-1 h-1.5 rounded-sm overflow-hidden" style={{ background: 'var(--dark3)' }}>
                  <div className="h-full rounded-sm" style={{
                    width: `${p.pct}%`,
                    background: p.gold ? 'linear-gradient(90deg,var(--gold),var(--gold2))' : 'rgba(255,255,255,0.12)',
                  }} />
                </div>
                <div className="font-serif text-lg font-semibold w-10 text-right" style={{ color: p.gold ? 'var(--gold)' : 'var(--text)' }}>{p.pct}%</div>
              </div>
            ))}
          </div>
          <PayoutCalculator />
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-12 py-16" style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="flex justify-between items-center flex-wrap gap-5">
          <div className="font-serif text-3xl" style={{ color: 'var(--gold)', letterSpacing: '8px' }}>GLOWX</div>
          <div className="flex gap-8">
            {['Discover', 'Features', 'Payouts', 'Terms', 'Privacy'].map(l => (
              <span key={l} className="font-mono cursor-pointer hover:text-gold transition-colors" style={{ fontSize: '0.56rem', color: 'var(--text)', letterSpacing: '2px', textTransform: 'uppercase' }}>{l}</span>
            ))}
          </div>
          <div className="font-mono" style={{ fontSize: '0.56rem', color: 'var(--text)' }}>© 2026 GLOWX · NO FLUFF. MAX ROI.</div>
        </div>
      </footer>
    </>
  )
}
