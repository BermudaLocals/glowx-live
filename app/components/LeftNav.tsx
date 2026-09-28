export function LeftNav(){
  const icons = ['🏠','💬','🔔','🔍','💰','🧭','👥','👑','📦','CG']
  return (
    <div className="w- border-r bg-white flex flex-col items-center py-6 gap-6 sticky top-0 h-screen">
      <div className="w-8 h-8 bg-[#b4ff39] rounded-lg" />
      {icons.map((ic,i)=><div key={i} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-zinc-100 cursor-pointer">{ic}</div>)}
    </div>
  )
}
