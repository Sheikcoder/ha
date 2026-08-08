import { useState, useEffect, useRef, Suspense, lazy } from 'react'
import { motion, useInView } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'
import Hero from './components/Hero'

// Lazy load heavy 3D components
const PlayerScene = lazy(() => import('./components/PlayerScene'))
const TrainingScene = lazy(() => import('./components/TrainingSection'))
const StrokeScene = lazy(() => import('./components/StrokeScene'))
const ChampionshipScene = lazy(() => import('./components/ChampionshipSection'))
const Logo3D = lazy(() => import('./components/Logo3D'))

/* ---- Animated Section Wrapper ---- */
function AnimatedSection({ children, className = '', id, ...props }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`section ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1.2, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.section>
  )
}

/* ---- Text Reveal Animation ---- */
function RevealText({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  )
}

/* ---- 3D Scene Placeholder ---- */
function SceneFallback() {
  return (
    <div style={{
      width: '100%',
      height: '100%',
      minHeight: '400px',
      background: 'radial-gradient(ellipse at center, #240a08 0%, #100404 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '0.7rem',
        letterSpacing: '0.5em',
        color: '#ff4500',
        textTransform: 'uppercase'
      }}>
        Loading 3D Scene...
      </div>
    </div>
  )
}

/* ---- Main App ---- */
export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setShowContent(true), 200)
      return () => clearTimeout(timer)
    }
  }, [loaded])

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {loaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <Navigation />

          {/* ========== HERO ========== */}
          <Hero />

          {/* ========== SECTION 01 — THE BEGINNING ========== */}
          <AnimatedSection id="journey" className="section--dark">
            <div className="section-canvas" style={{ position: 'absolute', inset: 0 }}>
              <Suspense fallback={<SceneFallback />}>
                <PlayerScene />
              </Suspense>
            </div>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(20,5,4,0.1) 0%, rgba(20,5,4,0.5) 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }} />
            <div className="section-content" style={{ zIndex: 2 }}>
              <RevealText>
                <div className="section-label">SECTION 01</div>
              </RevealText>
              <RevealText delay={0.2}>
                <h2 className="section-heading">THE JOURNEY<br/>BEGINS</h2>
              </RevealText>
              <RevealText delay={0.4}>
                <div className="section-divider" />
              </RevealText>
              <RevealText delay={0.5}>
                <p className="section-subheading">Every champion starts somewhere.</p>
              </RevealText>
              <RevealText delay={0.6}>
                <p className="section-body">
                  A young boy. A tennis racket. An empty court.<br/>
                  The beginning of something extraordinary.
                </p>
              </RevealText>
            </div>
          </AnimatedSection>

          {/* ========== SECTION 02 — TRAINING & ATHLETE GALLERY ========== */}
          <AnimatedSection id="training" className="section--gradient">
            <div className="section-canvas" style={{ position: 'absolute', inset: 0 }}>
              <Suspense fallback={<SceneFallback />}>
                <TrainingScene />
              </Suspense>
            </div>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(20,5,4,0.1) 0%, rgba(20,5,4,0.5) 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }} />
            <div className="section-content" style={{ zIndex: 2 }}>
              <RevealText>
                <div className="section-label">SECTION 02</div>
              </RevealText>
              <RevealText delay={0.2}>
                <h2 className="section-heading">
                  FOCUS.<br/>
                  PRACTICE.<br/>
                  PERFORM.
                </h2>
              </RevealText>
              <RevealText delay={0.4}>
                <div className="section-divider" />
              </RevealText>
              <RevealText delay={0.5}>
                <p className="section-subheading">
                  TRAINING TODAY. CHASING GREATNESS TOMORROW.
                </p>
              </RevealText>

              {/* Showcase Poster Cards */}
              <RevealText delay={0.6}>
                <div className="poster-showcase-grid">
                  <div className="poster-card">
                    <img src="/poster1.jpg" alt="Hanif Abdullah Tennis Training Montage" className="poster-img" />
                    <div className="poster-overlay">
                      <span className="poster-tag">THE COURT IS MY STAGE</span>
                      <span className="poster-subtag">EVERY POINT BUILDS MY STRENGTH</span>
                    </div>
                  </div>

                  <div className="poster-card">
                    <img src="/poster2.jpg" alt="Hanif Abdullah Backhand Stroke" className="poster-img" />
                    <div className="poster-overlay">
                      <span className="poster-tag">FOCUS • DRIVE • WIN • REPEAT</span>
                      <span className="poster-subtag">#TEAMHANIF</span>
                    </div>
                  </div>
                </div>
              </RevealText>

              <RevealText delay={0.8}>
                <div className="training-icons">
                  <div className="training-icon">
                    <div className="training-icon-circle">🏃</div>
                    <span className="training-icon-label">FOOTWORK</span>
                  </div>
                  <div className="training-icon">
                    <div className="training-icon-circle">🎾</div>
                    <span className="training-icon-label">STROKES</span>
                  </div>
                  <div className="training-icon">
                    <div className="training-icon-circle">💪</div>
                    <span className="training-icon-label">STRENGTH</span>
                  </div>
                  <div className="training-icon">
                    <div className="training-icon-circle">🧠</div>
                    <span className="training-icon-label">MENTAL</span>
                  </div>
                </div>
              </RevealText>
            </div>
          </AnimatedSection>

          {/* ========== SECTION 03 — THE STROKE ========== */}
          <AnimatedSection className="section--reverse-gradient">
            <div className="section-canvas" style={{ position: 'absolute', inset: 0 }}>
              <Suspense fallback={<SceneFallback />}>
                <StrokeScene />
              </Suspense>
            </div>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(20,5,4,0.1) 0%, rgba(20,5,4,0.5) 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }} />
            <div className="section-content" style={{ zIndex: 2 }}>
              <RevealText>
                <div className="section-label">SECTION 03</div>
              </RevealText>
              <RevealText delay={0.2}>
                <h2 className="section-heading">
                  EVERY POINT<br/>
                  BUILDS STRENGTH.
                </h2>
              </RevealText>
              <RevealText delay={0.4}>
                <div className="section-divider" />
              </RevealText>
              <RevealText delay={0.5}>
                <p className="section-subheading">
                  THE COURT IS MY STAGE.
                </p>
              </RevealText>
            </div>
          </AnimatedSection>

          {/* ========== SECTION 04 — DISCIPLINE ========== */}
          <AnimatedSection className="section--dark">
            <div className="section-content">
              <RevealText>
                <div className="section-label">SECTION 04</div>
              </RevealText>
              <RevealText delay={0.2}>
                <h2 className="section-heading">
                  DISCIPLINE<br/>
                  CREATES<br/>
                  CHAMPIONS.
                </h2>
              </RevealText>
              <RevealText delay={0.4}>
                <div className="section-divider" />
              </RevealText>
              <RevealText delay={0.5}>
                <p className="section-subheading">
                  FOCUS • DRIVE • WIN • REPEAT
                </p>
              </RevealText>

              <RevealText delay={0.7}>
                <div className="stats-row">
                  <div className="stat">
                    <div className="stat-number">365</div>
                    <div className="stat-label">DAYS A YEAR</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">∞</div>
                    <div className="stat-label">DEDICATION</div>
                  </div>
                  <div className="stat">
                    <div className="stat-number">1</div>
                    <div className="stat-label">DREAM</div>
                  </div>
                </div>
              </RevealText>
            </div>
          </AnimatedSection>

          {/* ========== SECTION 05 — THE DREAM ========== */}
          <AnimatedSection id="vision" className="section--gradient">
            <div className="section-canvas" style={{ position: 'absolute', inset: 0 }}>
              <Suspense fallback={<SceneFallback />}>
                <ChampionshipScene />
              </Suspense>
            </div>
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(ellipse at center, rgba(20,5,4,0.1) 0%, rgba(20,5,4,0.5) 100%)',
              zIndex: 1,
              pointerEvents: 'none'
            }} />
            <div className="section-content" style={{ zIndex: 2 }}>
              <RevealText>
                <div className="section-label">SECTION 05</div>
              </RevealText>
              <RevealText delay={0.2}>
                <h2 className="section-heading">
                  THE DREAM<br/>
                  IS BIGGER.
                </h2>
              </RevealText>
              <RevealText delay={0.4}>
                <div className="section-divider" />
              </RevealText>
              <RevealText delay={0.5}>
                <p className="section-subheading">
                  Small player. Big stadium. Limitless future.
                </p>
              </RevealText>
            </div>
          </AnimatedSection>

          {/* ========== SECTION 06 — FUTURE CHAMPION ========== */}
          <AnimatedSection className="section--reverse-gradient">
            <div className="section-content">
              <RevealText>
                <div className="section-label">SECTION 06</div>
              </RevealText>
              <RevealText delay={0.2}>
                <h2 className="section-heading">
                  THE FUTURE<br/>
                  IS STILL<br/>
                  BEING WRITTEN.
                </h2>
              </RevealText>
              <RevealText delay={0.4}>
                <div className="section-divider" />
              </RevealText>
              <RevealText delay={0.5}>
                <p className="section-subheading">
                  He is still small. The dream is not.
                </p>
              </RevealText>
              <RevealText delay={0.7}>
                <Suspense fallback={<SceneFallback />}>
                  <Logo3D height="380px" />
                </Suspense>
              </RevealText>
            </div>
          </AnimatedSection>

          {/* ========== FINAL REVEAL ========== */}
          <AnimatedSection className="final-section">
            <RevealText>
              <img
                src="/ha-logo.png"
                alt="HA Logo"
                className="final-logo"
              />
            </RevealText>
            <RevealText delay={0.3}>
              <h2 className="final-name">HANIF ABDULLAH</h2>
            </RevealText>
            <RevealText delay={0.5}>
              <p className="final-coming-soon">COMING SOON</p>
            </RevealText>
            <RevealText delay={0.7}>
              <div className="final-slogan">
                A SMALL DREAM.<br/>
                A BIG CHAMPIONSHIP.
              </div>
            </RevealText>
            <RevealText delay={0.9}>
              <div className="final-statement">
                HE IS STILL SMALL.<br/>
                THE DREAM IS NOT.
              </div>
            </RevealText>
            <RevealText delay={1.1}>
              <div className="final-never-give-up">NEVER GIVE UP.</div>
            </RevealText>
            <RevealText delay={1.3}>
              <p className="final-copyright">© HANIF ABDULLAH</p>
            </RevealText>
          </AnimatedSection>
        </motion.div>
      )}
    </>
  )
}
