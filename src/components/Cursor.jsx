import { useEffect, useRef } from 'react'

/* ------------------------------------------------------------
   Companion cursor: a soft ring that trails the pointer, grows
   over links/buttons, and shows a label over elements that carry
   data-cursor="view" / "play" / "drag". Desktop (fine pointer) only.
   ------------------------------------------------------------ */
export default function Cursor() {
  const ringRef = useRef(null)
  const dotRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return
    const ring = ringRef.current, dot = dotRef.current, label = labelRef.current
    if (!ring || !dot) return
    document.documentElement.classList.add('has-cursor')

    let x = window.innerWidth / 2, y = window.innerHeight / 2
    let rx = x, ry = y
    let raf = 0
    let visible = false

    const onMove = (e) => {
      x = e.clientX; y = e.clientY
      if (!visible) { visible = true; ring.style.opacity = '1'; dot.style.opacity = '1' }
      const target = e.target.closest && e.target.closest('a, button, [data-cursor], input, select, textarea, label')
      const cursorType = target && target.getAttribute('data-cursor')
      const isText = target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)
      ring.classList.toggle('is-active', !!target && !isText && !cursorType)
      ring.classList.toggle('is-label', !!cursorType)
      ring.classList.toggle('is-text', !!isText)
      if (label) label.textContent = cursorType ? cursorType.toUpperCase() : ''
    }
    const onLeave = () => { visible = false; ring.style.opacity = '0'; dot.style.opacity = '0' }
    const onDown = () => ring.classList.add('is-down')
    const onUp = () => ring.classList.remove('is-down')

    const loop = () => {
      rx += (x - rx) * 0.16
      ry += (y - ry) * 0.16
      ring.style.transform = `translate3d(${rx.toFixed(1)}px, ${ry.toFixed(1)}px, 0)`
      dot.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerup', onUp)
      document.documentElement.classList.remove('has-cursor')
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ringRef} aria-hidden="true"><span ref={labelRef} /></div>
      <div className="cursor-dot" ref={dotRef} aria-hidden="true" />
    </>
  )
}
