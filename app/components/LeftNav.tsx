export function LeftNav() {
  return (
    <div className="w-[72px] bg-white border-r border-zinc-200 hidden md:flex flex-col items-center py-6 gap-6 h-screen sticky top-0">
      <div className="w-9 h-9 rounded-xl bg-[#ff2d7a] grid place-items-center font-black text-white">G</div>
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
