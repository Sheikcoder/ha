/* ------------------------------------------------------------
   Weighted smooth scroll — no dependencies.
   Intercepts the mouse wheel on desktop and eases the window
   towards the target position, giving the "heavy, cinematic"
   scroll feel of award-winning sites. Touch, keyboard, scrollbar
   drags and reduced-motion users keep native scrolling.
   ------------------------------------------------------------ */

import { reducedMotion } from './perf'

const EASE = 0.11        // 0..1 — lower is heavier
const WHEEL_SCALE = 1.0

class SmoothScroll {
  constructor() {
    this.enabled = false
    this.target = 0
    this.current = 0
    this.raf = null
    this.onWheel = this.onWheel.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.tick = this.tick.bind(this)
  }

  init() {
    if (this.enabled || typeof window === 'undefined') return
    const finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches
    if (!finePointer || reducedMotion) return
    this.enabled = true
    this.current = this.target = window.scrollY
    document.documentElement.classList.add('smooth-scroll')
    window.addEventListener('wheel', this.onWheel, { passive: false })
    window.addEventListener('scroll', this.onScroll, { passive: true })
  }

  destroy() {
    if (!this.enabled) return
    this.enabled = false
    document.documentElement.classList.remove('smooth-scroll')
    window.removeEventListener('wheel', this.onWheel)
    window.removeEventListener('scroll', this.onScroll)
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = null
  }

  maxScroll() {
    return Math.max(0, document.documentElement.scrollHeight - window.innerHeight)
  }

  onWheel(e) {
    if (e.ctrlKey || e.metaKey) return               // pinch-zoom
    // let natively scrollable regions (tables, textareas, menus) handle their own wheel
    const scrollable = e.target.closest && e.target.closest('[data-native-scroll], .table-wrap, textarea, select')
    if (scrollable && scrollable.scrollHeight > scrollable.clientHeight + 1) return
    if (scrollable && scrollable.scrollWidth > scrollable.clientWidth + 1 && e.shiftKey) return
    if (document.body.style.overflow === 'hidden') return   // mobile menu / lightbox open

    e.preventDefault()
    let delta = e.deltaY
    if (e.deltaMode === 1) delta *= 16
    else if (e.deltaMode === 2) delta *= window.innerHeight
    this.target = Math.max(0, Math.min(this.maxScroll(), this.target + delta * WHEEL_SCALE))
    this.start()
  }

  onScroll() {
    // scrollbar drag / keyboard / programmatic jumps — resync when we are idle
    if (!this.raf) this.current = this.target = window.scrollY
  }

  start() {
    if (!this.raf) this.raf = requestAnimationFrame(this.tick)
  }

  tick() {
    const diff = this.target - this.current
    if (Math.abs(diff) < 0.4) {
      this.current = this.target
      window.scrollTo(0, this.current)
      this.raf = null
      return
    }
    this.current += diff * EASE
    window.scrollTo(0, this.current)
    this.raf = requestAnimationFrame(this.tick)
  }

  /** Animate to an absolute position */
  to(y) {
    if (!this.enabled) { window.scrollTo({ top: y, behavior: 'smooth' }); return }
    this.target = Math.max(0, Math.min(this.maxScroll(), y))
    this.start()
  }

  /** Jump instantly (route changes) */
  reset(y = 0) {
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = null
    this.current = this.target = y
    window.scrollTo(0, y)
  }
}

export const smoothScroll = new SmoothScroll()
