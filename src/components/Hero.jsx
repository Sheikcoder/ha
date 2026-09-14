import { useRef, useEffect, useState, Suspense, lazy } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { BRAND, HOME } from '../content/site'
import { hrefFor } from '../router'
import { trackerState } from './trackerState'
import HAMark from './HAMark'
import { useTheme } from '../theme'
import { useSound, audio } from '../audio'
import { useVisibleFrameloop } from '../perf'
import Magnetic from './Magnetic'

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
  // After the letter intro, swap to two static word spans: far cheaper to
  // paint, and the sheen then runs on 2 elements instead of 13.
  const [settled, setSettled] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 2400)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="hero-name-wrap">
      {/* soft halo behind the name (static, never repaints) */}
      <motion.span
        className="hero-name hero-name-halo"
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1.4 }}
      >
        {words.map((w, i) => <span className="word" key={i}>{w}</span>)}
      </motion.span>

      {settled ? (
        <h1 className="hero-name hero-name--sheen" aria-label={text}>
          {words.map((w, i) => <span className="word" key={i} style={{ '--i': i }}>{w}</span>)}
        </h1>
      ) : (
        <motion.h1 className="hero-name" variants={letterParent} initial="hidden" animate="visible" aria-label={text}>
          {words.map((word, wi) => (
            <span className="word" key={wi} aria-hidden="true">
              {word.split('').map((ch, ci) => (
                <motion.span className="char" key={ci} variants={letter}>{ch}</motion.span>
              ))}
            </span>
          ))}
        </motion.h1>
      )}
    </div>
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
  const [slowMo, setSlowMo] = useState(false)

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
    <div className="tracker" ref={hostRef}>
      {/* Follows the ball */}
      <div className="tracker-reticle" ref={reticleRef} aria-hidden="true">
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
        <div className="tracker-panel-controls">
          <button type="button" onClick={() => { trackerState.replay = true; audio.tick() }}>Replay point</button>
          <button
            type="button"
            className={slowMo ? 'active' : ''}
            aria-pressed={slowMo}
            onClick={() => { trackerState.slowMo = !trackerState.slowMo; setSlowMo(trackerState.slowMo); audio.tick() }}
          >
            Slow-mo
          </button>
        </div>
      </div>
    </div>
  )
}

function SceneFallback() {
  return <div className="hero-fallback" aria-hidden="true" />
}

/* ---- "Turn on sound" invitation shown until the visitor decides ---- */
function SoundInvite() {
  const { enabled } = useSound()
  const [dismissed, setDismissed] = useState(false)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 2600)
    return () => clearTimeout(t)
  }, [])

  const visible = show && !enabled && !dismissed

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="sound-invite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.6 }}
        >
          <button type="button" className="sound-invite-btn" onClick={() => audio.setEnabled(true)}>
            <span className="sound-bars" aria-hidden="true"><i /><i /><i /><i /></span>
            Turn on sound — music &amp; court effects
          </button>
          <button type="button" className="sound-invite-close" onClick={() => setDismissed(true)} aria-label="Dismiss">×</button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Hero() {
  const { theme } = useTheme()
  const canvasRef = useRef(null)
  const frameloop = useVisibleFrameloop(canvasRef)
  const { scrollY } = useScroll()
  const contentY = useTransform(scrollY, [0, 700], [0, 180])
  const contentOpacity = useTransform(scrollY, [0, 520], [1, 0])
  const canvasScale = useTransform(scrollY, [0, 900], [1, 1.12])
  const canvasY = useTransform(scrollY, [0, 900], [0, 120])

  useEffect(() => {
    // remembered preference: re-enable on the first interaction
    if (audio.preferred && !audio.enabled) {
      const once = () => { audio.setEnabled(true); window.removeEventListener('pointerdown', once); window.removeEventListener('keydown', once) }
      window.addEventListener('pointerdown', once)
      window.addEventListener('keydown', once)
      return () => { window.removeEventListener('pointerdown', once); window.removeEventListener('keydown', once) }
    }
  }, [])

  return (
    <section className="hero" id="hero" aria-label="Hero">
      <motion.div className="hero-canvas" style={{ scale: canvasScale, y: canvasY }} ref={canvasRef}>
        <Suspense fallback={<SceneFallback />}>
          {/* key remounts the scene so materials/lights rebuild for the new mode */}
          <TennisScene key={theme} theme={theme} frameloop={frameloop} />
        </Suspense>
      </motion.div>

      <TrackerHUD />

      <div className="hero-overlay" />
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-lines" aria-hidden="true"><span /><span /></div>

      <motion.div className="hero-content" initial="hidden" animate="visible" style={{ y: contentY, opacity: contentOpacity }}>
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
          <Magnetic><a href={hrefFor('journey')} className="btn btn--primary">Discover the journey</a></Magnetic>
          <Magnetic><a href={hrefFor('contact', 'sponsorship')} className="btn btn--ghost">Partner with Hanif</a></Magnetic>
        </motion.div>

        <motion.p className="hero-phrase" variants={fadeUp} custom={1.7}>
          {BRAND.phrase}
        </motion.p>
      </motion.div>

      <SoundInvite />

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-indicator-line" />
        <span className="scroll-indicator-text">Scroll</span>
      </div>
    </section>
  )
}
