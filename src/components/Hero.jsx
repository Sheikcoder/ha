import { useRef, useEffect, Suspense, lazy } from 'react'
import { motion } from 'framer-motion'
import { BRAND, HOME } from '../content/site'
import { hrefFor } from '../router'
import { trackerState } from './trackerState'
import HAMark from './HAMark'
import { useTheme } from '../theme'

const TennisScene = lazy(() => import('./TennisScene'))

/* Per-letter reveal for the athlete's name */
const letterParent = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.7 } }
}
const letter = {
  hidden: { opacity: 0, y: 60, rotateX: -40 },
  visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
}

function AnimatedName({ text }) {
  const words = text.split(' ')
  return (
    <motion.h1 className="hero-name" variants={letterParent} initial="hidden" animate="visible" aria-label={text}>
      {words.map((word, wi) => (
        <span className="word" key={wi} aria-hidden="true">
          {word.split('').map((ch, ci) => (
            <motion.span className="char" key={ci} variants={letter}>{ch}</motion.span>
          ))}
        </span>
      ))}
    </motion.h1>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

/* ------------------------------------------------------------
   Screen-space tracking HUD.
   The 3D scene writes the ball's projected position into
   `trackerState` every frame; this component moves DOM elements
   with it — crisp text and lines at any resolution.
   ------------------------------------------------------------ */
function TrackerHUD() {
  const reticleRef = useRef(null)
  const speedRef = useRef(null)
  const shotRef = useRef(null)
  const phaseRef = useRef(null)
  const hostRef = useRef(null)

  useEffect(() => {
    let raf = 0
    let lastShot = -1
    let lastPhase = ''
    let lastSpeedText = ''

    const tick = () => {
      const host = hostRef.current
      const reticle = reticleRef.current
      if (host && reticle) {
        const w = host.clientWidth
        const h = host.clientHeight
        const x = trackerState.x * w
        const y = trackerState.y * h
        reticle.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`
        reticle.style.opacity = trackerState.visible ? '1' : '0'

        const speedText = `${Math.round(trackerState.speed)}`
        if (speedRef.current && speedText !== lastSpeedText) {
          speedRef.current.textContent = speedText
          lastSpeedText = speedText
        }
        if (shotRef.current && trackerState.shot !== lastShot) {
          shotRef.current.textContent = String(trackerState.shot + 1).padStart(2, '0')
          lastShot = trackerState.shot
        }
        if (phaseRef.current && trackerState.phase !== lastPhase) {
          phaseRef.current.textContent =
            trackerState.phase === 'serve' ? 'SERVE' :
            trackerState.phase === 'point' ? 'POINT OVER' : 'IN PLAY'
          lastPhase = trackerState.phase
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <div className="tracker" ref={hostRef} aria-hidden="true">
      {/* Follows the ball */}
      <div className="tracker-reticle" ref={reticleRef}>
        <span className="tracker-ring" />
        <span className="tracker-tick tracker-tick--n" />
        <span className="tracker-tick tracker-tick--s" />
        <span className="tracker-tick tracker-tick--e" />
        <span className="tracker-tick tracker-tick--w" />
        <div className="tracker-readout">
          <span className="tracker-readout-value"><b ref={speedRef}>0</b> km/h</span>
          <span className="tracker-readout-label">Ball speed</span>
        </div>
      </div>

      {/* Fixed corner panel */}
      <div className="tracker-panel">
        <div className="tracker-panel-row">
          <span className="tracker-live"><i />Live tracker</span>
          <span ref={phaseRef}>SERVE</span>
        </div>
        <div className="tracker-panel-row tracker-panel-row--sub">
          <span>Shot <b ref={shotRef}>01</b></span>
          <span>HA · Court view</span>
        </div>
      </div>
    </div>
  )
}

function SceneFallback() {
  return <div className="hero-fallback" aria-hidden="true" />
}

export default function Hero() {
  const { theme } = useTheme()

  return (
    <section className="hero" id="hero" aria-label="Hero">
      <div className="hero-canvas">
        <Suspense fallback={<SceneFallback />}>
          {/* key remounts the scene so materials/lights rebuild for the new mode */}
          <TennisScene key={theme} theme={theme} />
        </Suspense>
      </div>

      <TrackerHUD />

      <div className="hero-overlay" />
      <div className="hero-grain" aria-hidden="true" />

      <motion.div className="hero-content" initial="hidden" animate="visible">
        <motion.div variants={fadeUp} custom={0.3}>
          <HAMark className="hero-logo" />
        </motion.div>

        <motion.p className="hero-kicker" variants={fadeUp} custom={0.5}>
          {HOME.heroKicker}
        </motion.p>

        <AnimatedName text={BRAND.name} />

        <motion.p className="hero-tagline" variants={fadeUp} custom={1.0}>
          {BRAND.tagline}
        </motion.p>

        <motion.div className="hero-actions" variants={fadeUp} custom={1.3}>
          <a href={hrefFor('journey')} className="btn btn--primary">Discover the journey</a>
          <a href={hrefFor('contact', 'sponsorship')} className="btn btn--ghost">Partner with Hanif</a>
        </motion.div>

        <motion.p className="hero-phrase" variants={fadeUp} custom={1.7}>
          {BRAND.phrase}
        </motion.p>
      </motion.div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-indicator-line" />
        <span className="scroll-indicator-text">Scroll</span>
      </div>
    </section>
  )
}
