import { useEffect, useState } from 'react'

/* ------------------------------------------------------------
   Performance helpers shared by every 3D scene.
   ------------------------------------------------------------ */

/* Rough device tier — used to pick shadow quality, particle counts, dpr */
export const lowPower = (() => {
  if (typeof navigator === 'undefined') return false
  const cores = navigator.hardwareConcurrency || 8
  const mem = navigator.deviceMemory || 8
  const mobile = /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)
  return mobile || cores <= 4 || mem <= 4
})()

export const reducedMotion = (() => {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
})()

/**
 * Returns 'always' while the element is on screen and the tab is visible,
 * otherwise 'never' — pass it to <Canvas frameloop>. A scene that is
 * scrolled away or in a background tab then costs nothing.
 */
export function useVisibleFrameloop(ref, rootMargin = '120px') {
  const [active, setActive] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    let onScreen = true
    let tabVisible = !document.hidden
    const update = () => setActive(onScreen && tabVisible)
    const io = new IntersectionObserver(([entry]) => { onScreen = entry.isIntersecting; update() }, { rootMargin })
    io.observe(el)
    const onVis = () => { tabVisible = !document.hidden; update() }
    document.addEventListener('visibilitychange', onVis)
    return () => { io.disconnect(); document.removeEventListener('visibilitychange', onVis) }
  }, [ref, rootMargin])

  return active ? 'always' : 'never'
}
