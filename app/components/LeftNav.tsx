import GlowXLogo from './GlowXLogo'

export function LeftNav() {
  return (
    <div className="w-[72px] bg-white border-r border-zinc-200 hidden md:flex flex-col items-center py-6 gap-6 h-screen sticky top-0">
      <a href="/" aria-label="GlowX home"><GlowXLogo size={34} withWordmark={false} /></a>
      <div className="flex flex-col gap-7 text-[20px]">
        <span>🏠</span>
        <span>🔍</span>
        <span>🔔</span>
        <span>💬</span>
        <span>👤</span>
      </div>
    </div>
  )
}
