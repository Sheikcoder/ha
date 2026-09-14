import { useRef, useCallback } from 'react'

/* ---- Buttons that lean towards the cursor (desktop only) ---- */
export default function Magnetic({ children, strength = 0.28, className = '' }) {
  const ref = useRef(null)

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el || !window.matchMedia('(pointer: fine)').matches) return
    const r = el.getBoundingClientRect()
    const dx = e.clientX - (r.left + r.width / 2)
    const dy = e.clientY - (r.top + r.height / 2)
    el.style.transform = `translate3d(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px, 0)`
  }, [strength])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (el) el.style.transform = 'translate3d(0, 0, 0)'
  }, [])

  return (
    <span ref={ref} className={`magnetic ${className}`} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </span>
  )
}
