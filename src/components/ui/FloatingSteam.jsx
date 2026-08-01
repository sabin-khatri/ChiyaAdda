import { useEffect, useState } from 'react'

const STEAM_COUNT = 5

const FloatingSteam = () => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    setEnabled(!reduce && !coarse)
  }, [])

  if (!enabled) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
      {Array.from({ length: STEAM_COUNT }).map((_, i) => (
        <span
          key={i}
          className="steam-particle absolute bottom-0 rounded-full bg-white/15 blur-xl"
          style={{
            left: `${12 + i * 18}%`,
            width: `${36 + i * 8}px`,
            height: `${54 + i * 10}px`,
            animationDelay: `${i * 2.5}s`,
            animationDuration: `${14 + i * 2}s`,
          }}
        />
      ))}
    </div>
  )
}

export default FloatingSteam
