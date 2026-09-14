import { motion } from 'framer-motion'
import { Lines } from './Reveal'
import HAMark from './HAMark'

/* ---- Cinematic header used on every inner page ---- */
export default function PageHeader({ label, heading, intro, compact = false }) {
  return (
    <header className={`page-header ${compact ? 'page-header--compact' : ''}`}>
      <div className="page-header-bg" aria-hidden="true">
        <HAMark className="page-header-mark" title="" />
      </div>
      <div className="page-header-inner">
        <motion.div
          className="section-label"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
        >
          {label}
        </motion.div>
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Lines text={heading} />
        </motion.h1>
        {intro && (
          <motion.p
            className="page-intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.45 }}
          >
            {intro}
          </motion.p>
        )}
      </div>
    </header>
  )
}
