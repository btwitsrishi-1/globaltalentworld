'use client'

// Lightweight CSS-only logo icon - replaces the heavy Three.js Canvas
// that was loading a full WebGL context + 1.3MB GLB on every page
export function Logo3DIcon() {
  return (
    <div className="w-10 h-10 relative flex items-center justify-center">
      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-400 via-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/30 animate-[spin_8s_linear_infinite]">
        <span className="text-white font-bold text-sm tracking-tight select-none" style={{ animationDirection: 'reverse', animation: 'spin 8s linear infinite reverse' }}>
          G
        </span>
      </div>
    </div>
  )
}
