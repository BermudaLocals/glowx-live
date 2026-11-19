export default function GlowXLogo({ size = 32, withWordmark = true, light = true }: { size?: number; withWordmark?: boolean; light?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 select-none">
      <svg width={size} height={size} viewBox="0 0 256 256" aria-label="GlowX logo">
        <defs>
          <linearGradient id="gxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
        </defs>
        <rect width="256" height="256" rx="56" fill="#0F0F1E" />
        <circle cx="128" cy="128" r="96" fill="#EC4899" opacity="0.12" />
        <path d="M85 65 L128 128 L171 65 L158 65 L128 110 L98 65 Z M128 128 L85 191 L98 191 L128 146 L158 191 L171 191 Z" fill="url(#gxGrad)" />
      </svg>
      {withWordmark && (
        <span className={`font-extrabold tracking-tight ${light ? 'text-white' : 'text-[#2A1030]'}`} style={{ fontSize: size * 0.62 }}>
          Glow<span className="text-glow-gradient">X</span>
        </span>
      )}
    </span>
  )
}
