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
