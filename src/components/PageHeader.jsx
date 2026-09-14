import { lazy, Suspense, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Lines } from './Reveal'
import HAMark from './HAMark'

const HeaderScene = lazy(() => import('./HeaderScene'))

const PAGE_VARIANT = { about: 0, journey: 1, gallery: 2, results: 3, partners: 4, contact: 5 }

/* ---- Cinematic header used on every inner page ---- */
export default function PageHeader({ label, heading, intro, compact = false, page = 'about' }) {
  const ref = useRef(null)
  const { scrollY } = useScroll()
  const textY = useTransform(scrollY, [0, 500], [0, 110])
  const sceneY = useTransform(scrollY, [0, 500], [0, 60])
  const fade = useTransform(scrollY, [0, 420], [1, 0])

  return (
    <header className={`page-header ${compact ? 'page-header--compact' : ''}`} ref={ref}>
      <div className="page-header-bg" aria-hidden="true">
        <HAMark className="page-header-mark" title="" />
      </div>

      <motion.div className="page-header-scene" style={{ y: sceneY, opacity: fade }}>
        <Suspense fallback={null}>
          <HeaderScene variant={PAGE_VARIANT[page] || 0} />
        </Suspense>
      </motion.div>

      <motion.div className="page-header-inner" style={{ y: textY, opacity: fade }}>
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
          initial={{ opacity: 0, y: 60, clipPath: 'inset(0 0 100% 0)' }}
          animate={{ opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
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
      </motion.div>
    </header>
  )
}
