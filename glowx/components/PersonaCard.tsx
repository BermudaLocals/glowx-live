export function PersonaCard({ persona }: any) {
  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
      <div className="h-64 bg-black flex items-center justify-center">AI Image</div>
      <div className="p-3">
        <span className="bg-white text-black text- px-2 py-0.5 rounded-full">AI-Generated Profile</span>
        <h3 className="font-bold mt-2">{persona.displayName}</h3>
      </div>
    </div>
  )
}
