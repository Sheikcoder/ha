import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

/* ---- Fade-in section wrapper ---- */
export function AnimatedSection({ children, className = '', id, ...props }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <motion.section
      ref={ref}
      id={id}
      className={`section ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 1, ease: 'easeOut' }}
      {...props}
    >
      {children}
    </motion.section>
  )
}

/* ---- Slide-up text reveal ---- */
export function RevealText({ children, delay = 0, className = '', as = 'div', y = 40 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-40px' })
  const Tag = motion[as] || motion.div

  return (
    <Tag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y }}
      transition={{ duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </Tag>
  )
}

/* ---- Renders "line\nline" strings with <br/> ---- */
export function Lines({ text }) {
  const parts = String(text).split('\n')
  return parts.map((line, i) => (
    <span key={i}>
      {line}
      {i < parts.length - 1 && <br />}
    </span>
  ))
}

/* ---- Heading that reveals word by word (clip + rise) ---- */
export function RevealHeading({ text, as = 'h2', className = '', delay = 0 }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-60px' })
  const Tag = motion[as] || motion.h2
  const lines = String(text).split('\n')
  let index = 0
  return (
    <Tag ref={ref} className={`reveal-heading ${className}`} aria-label={text}>
      {lines.map((line, li) => (
        <span className="reveal-line" key={li} aria-hidden="true">
          {line.split(' ').map((word, wi) => {
            const d = delay + index++ * 0.07
            return (
              <span className="reveal-word" key={wi}>
                <motion.span
                  initial={{ y: '110%', opacity: 0 }}
                  animate={isInView ? { y: '0%', opacity: 1 } : { y: '110%', opacity: 0 }}
                  transition={{ duration: 0.8, delay: d, ease: [0.22, 1, 0.36, 1] }}
                >
                  {word}
                </motion.span>
              </span>
            )
          })}
        </span>
      ))}
    </Tag>
  )
}
