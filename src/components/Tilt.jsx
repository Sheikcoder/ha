import { useRef, useCallback } from 'react'

/* ------------------------------------------------------------
   3D tilt + glare on hover. Pure CSS transforms driven by the
   pointer, so it costs nothing when idle.
   Usage: <Tilt as="article" className="card">…</Tilt>
   ------------------------------------------------------------ */
export default function Tilt({ as: Tag = 'div', className = '', max = 8, glare = true, children, ...props }) {
  const ref = useRef(null)

  const onMove = useCallback((e) => {
    const el = ref.current
    if (!el || window.matchMedia('(hover: none)').matches) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${((0.5 - py) * max * 2).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${((px - 0.5) * max * 2).toFixed(2)}deg`)
    el.style.setProperty('--gx', `${(px * 100).toFixed(1)}%`)
    el.style.setProperty('--gy', `${(py * 100).toFixed(1)}%`)
  }, [max])

  const onLeave = useCallback(() => {
    const el = ref.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }, [])

  return (
    <Tag
      ref={ref}
      className={`tilt ${glare ? 'tilt--glare' : ''} ${className}`}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      {...props}
    >
      {children}
    </Tag>
  )
}
