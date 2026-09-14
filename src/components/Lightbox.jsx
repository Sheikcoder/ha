import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { audio } from '../audio'

/* ---- Fullscreen photo viewer with keyboard navigation ---- */
export default function Lightbox({ photos, index, onClose, onIndex }) {
  const open = index !== null && index >= 0
  const photo = open ? photos[index] : null

  const step = useCallback((dir) => {
    if (!open) return
    const next = (index + dir + photos.length) % photos.length
    onIndex(next)
    audio.tick()
  }, [open, index, photos.length, onIndex])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose, step])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={photo.alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <motion.figure
            key={index}
            className="lightbox-figure"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={photo.src} alt={photo.alt} />
            <figcaption>
              <span>{photo.caption}</span>
              <em>{String(index + 1).padStart(2, '0')} / {String(photos.length).padStart(2, '0')}</em>
            </figcaption>
          </motion.figure>

          <button type="button" className="lightbox-btn lightbox-close" onClick={onClose} aria-label="Close">×</button>
          {photos.length > 1 && (
            <>
              <button type="button" className="lightbox-btn lightbox-prev" onClick={(e) => { e.stopPropagation(); step(-1) }} aria-label="Previous photo">‹</button>
              <button type="button" className="lightbox-btn lightbox-next" onClick={(e) => { e.stopPropagation(); step(1) }} aria-label="Next photo">›</button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
