import { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import TennisScene from './TennisScene'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1, delay, ease: [0.25, 0.46, 0.45, 0.94] }
  })
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (delay = 0) => ({
    opacity: 1,
    transition: { duration: 1.2, delay, ease: 'easeOut' }
  })
}

export default function Hero() {
  const sectionRef = useRef(null)

  const scrollToJourney = () => {
    const el = document.getElementById('journey')
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" ref={sectionRef} id="hero" aria-label="Hero">
      <div className="hero-canvas">
        <TennisScene />
      </div>
      <div className="hero-overlay" />
      <motion.div
        className="hero-content"
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="hero-name"
          variants={fadeUp}
          custom={0.5}
        >
          HANIF ABDULLAH
        </motion.h1>

        <motion.p
          className="hero-coming-soon"
          variants={fadeUp}
          custom={0.9}
        >
          COMING SOON
        </motion.p>

        <motion.div
          className="hero-slogan"
          variants={fadeUp}
          custom={1.3}
        >
          A SMALL DREAM.<br />
          A BIG CHAMPIONSHIP.
        </motion.div>

        <motion.p
          className="hero-subslogan"
          variants={fadeIn}
          custom={1.8}
        >
          TRAINING TODAY. CHASING GREATNESS TOMORROW.
        </motion.p>

        <motion.button
          className="hero-cta"
          variants={fadeUp}
          custom={2.2}
          onClick={scrollToJourney}
          aria-label="Enter the journey - scroll to content"
        >
          ENTER THE JOURNEY
        </motion.button>
      </motion.div>

      <div className="scroll-indicator" aria-hidden="true">
        <div className="scroll-indicator-line" />
        <span className="scroll-indicator-text">SCROLL</span>
      </div>
    </section>
  )
}
