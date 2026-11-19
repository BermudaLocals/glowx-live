import GlowXLogo from './components/GlowXLogo'

const FEATURES = [
  { title: 'GlowX AI Content Assistant', desc: 'Generate captions, plan posting schedules and draft content briefs with AI tools built for creators.', icon: 'M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3zM19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z' },
  { title: 'Multi-Tier Subscriptions', desc: 'Create subscription tiers with custom pricing, perks and exclusive content for each level of fan.', icon: 'M4 6h16v3H4zM4 11h16v3H4zM4 16h10v3H4z' },
  { title: 'Direct Messaging & Live', desc: 'Connect with your audience through DMs and live moments — no third-party tools needed.', icon: 'M21 12a8 8 0 01-8 8H5l-2 2V12a8 8 0 018-8h2a8 8 0 018 8z' },
  { title: 'Pay-Per-View & Tipping', desc: 'Monetise individual posts with PPV pricing and let fans show appreciation through instant tips.', icon: 'M12 2v20M17 7H9.5a3 3 0 000 6h5a3 3 0 010 6H6' },
  { title: 'GlowX Shield Protection', desc: 'Watermarking and content-protection tooling to help keep your premium work yours.', icon: 'M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7l8-4z' },
  { title: 'Creator Analytics', desc: 'Clear insight into subscriber behaviour, content performance and revenue trends.', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
]

const CREATORS = [
  { name: 'Sofia Martinez', title: 'Professional golfer', img: 'https://images.unsplash.com/photo-1526510747491-58f928ec870f?w=600&q=80' },
  { name: 'Aitana Lopez', title: 'AI Influencer', img: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80' },
  { name: 'Elena Rossi', title: 'Football Journalist', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80' },
  { name: 'Mia Chen', title: 'Fitness Coach', img: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&q=80' },
]

const PLAN_FEATURES = [
  'Subscriptions, pay-per-view and tips',
  'AI persona studio included',
  'Unlimited posts and messages',
  'No monthly cost — we only earn when you do',
  'No tiers, no locked features — everyone gets everything',
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0F] text-white overflow-x-hidden">
      {/* HEADER */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-white/10 bg-[#0A0A0F]/80 backdrop-blur-xl">
        <div className="max-w-[1200px] mx-auto px-5 h-16 flex items-center justify-between">
          <a href="/"><GlowXLogo size={30} /></a>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/70">
            <a href="#features" className="hover:text-white transition">Features</a>
            <a href="#creators" className="hover:text-white transition">Creators</a>
            <a href="#pricing" className="hover:text-white transition">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/home" className="hidden sm:inline-block text-sm font-semibold text-white/80 hover:text-white transition">Sign in</a>
            <a href="/onboarding" className="glow-gradient text-sm font-bold px-5 py-2.5 rounded-full shadow-lg shadow-purple-500/25 hover:scale-105 transition-transform">Become a creator</a>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[120px] animate-float" />
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-pink-500/20 blur-[100px] animate-float-delayed" />
          <div className="absolute bottom-1/4 left-1/3 w-[350px] h-[350px] rounded-full bg-cyan-500/10 blur-[80px] animate-float" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0A0A0F]" />
        </div>
        <div className="relative z-10 max-w-[900px] mx-auto px-5 text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-8 text-sm text-white/70">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            The creator-first monetisation platform
          </div>
          <h1 className="animate-fade-up-1 text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-6">
            Illuminate Your Content.<br />
            <span className="text-glow-gradient">Ignite Your Empire.</span>
          </h1>
          <p className="animate-fade-up-2 text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            GlowX gives creators the tools to earn on their own terms — subscriptions, pay-per-view, AI personas and direct fan connection, all in one place.
          </p>
          <div className="animate-fade-up-3 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="/onboarding" className="glow-gradient px-8 py-4 rounded-full font-bold shadow-lg shadow-purple-500/30 hover:shadow-pink-500/40 hover:scale-105 transition-all">
              Start Creating on GlowX
            </a>
            <a href="/home" className="glass-card px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition">
              Explore Creators
            </a>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Everything You Need to <span className="text-glow-gradient">Build Your Empire</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">Powerful tools designed to help you create, grow and monetise your content.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="group relative rounded-2xl p-6 glass-card glow-border hover:bg-white/[0.08] transition-all duration-300">
                <div className="w-12 h-12 rounded-xl glow-gradient flex items-center justify-center mb-4 shadow-lg shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={f.icon} /></svg>
                </div>
                <h3 className="text-lg font-bold mb-2">{f.title}</h3>
                <p className="text-sm text-white/55 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CREATORS */}
      <section id="creators" className="py-24 sm:py-32 relative">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-pink-600/10 blur-[120px]" />
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              Made for Creators. <span className="text-glow-gradient">Trusted by Icons.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">From athletes to AI influencers — GlowX is built for anyone with an audience.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {CREATORS.map(c => (
              <div key={c.name} className="group relative h-[380px] rounded-3xl overflow-hidden glow-border">
                <img src={c.img} alt={c.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <div className="font-extrabold uppercase tracking-wide">{c.name}</div>
                  <div className="text-pink-400 italic text-sm">{c.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-5">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">
              One Simple Fee. <span className="text-glow-gradient">You Keep 90%.</span>
            </h2>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">The big platforms take 20%. GlowX takes 10% — that covers payment processing, hosting and support, and keeps the lights on. The rest is yours.</p>
          </div>
          <div className="max-w-[560px] mx-auto">
            <div className="relative rounded-3xl p-[2px] glow-gradient shadow-2xl shadow-purple-500/30">
              <div className="rounded-3xl bg-[#0A0A0F] p-10 text-center">
                <div className="inline-block text-xs font-extrabold px-4 py-1 rounded-full glow-gradient mb-6">EVERYONE. EVERYTHING. ONE RATE.</div>
                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-7xl font-extrabold text-glow-gradient">90%</span>
                  <span className="text-xl text-white/60 font-semibold">yours</span>
                </div>
                <p className="text-white/60 mt-3">10% flat platform fee. No monthly cost, no tiers, no locked features.</p>
                <ul className="mt-8 space-y-3 text-sm text-white/70 text-left max-w-[380px] mx-auto">
                  {PLAN_FEATURES.map(f => (
                    <li key={f} className="flex gap-2.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 shrink-0 text-pink-500"><path d="M20 6L9 17l-5-5" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href="/onboarding" className="mt-10 glow-gradient h-12 rounded-full font-bold grid place-items-center text-white hover:scale-[1.03] transition">
                  Become a Creator
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 sm:py-32 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-purple-600/20 blur-[140px]" />
        </div>
        <div className="relative max-w-[800px] mx-auto px-5 text-center">
          <GlowXLogo size={64} withWordmark={false} />
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-8 mb-6">
            Ready to <span className="text-glow-gradient">Glow</span>?
          </h2>
          <p className="text-white/60 text-lg mb-10">Set up your creator profile in minutes and start building your empire today.</p>
          <a href="/onboarding" className="glow-gradient inline-block px-10 py-4 rounded-full font-bold text-lg shadow-lg shadow-purple-500/30 hover:scale-105 transition-transform">
            Become a Creator
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 py-12">
        <div className="max-w-[1200px] mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-6">
          <GlowXLogo size={26} />
          <p className="text-white/40 text-sm text-center">Illuminate Your Content. Ignite Your Empire.</p>
          <div className="flex items-center gap-6 text-sm text-white/50">
            <a href="/home" className="hover:text-white transition">Explore</a>
            <a href="/upload" className="hover:text-white transition">Upload</a>
            <a href="/builder" className="hover:text-white transition">Persona Studio</a>
          </div>
        </div>
        <p className="text-center text-white/25 text-xs mt-8">© {new Date().getFullYear()} GlowX. All rights reserved.</p>
      </footer>
    </div>
  )
}
