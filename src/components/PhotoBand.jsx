import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { RevealText } from './Reveal'

/* ------------------------------------------------------------
   Full-bleed hero photograph with parallax and an automatic
   burgundy duotone — any photo drops in and comes out on-brand
   (black / white / burgundy) without editing.
   ------------------------------------------------------------ */
export default function PhotoBand({ src, alt, kicker, lines = [], position = '50% 30%' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['-12%', '12%'])
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1.02])

  return (
    <section className="photo-band" ref={ref} aria-label={alt}>
      <motion.div className="photo-band-media" style={{ y, scale }}>
        <img src={src} alt={alt} style={{ objectPosition: position }} />
        <div className="photo-band-duotone" aria-hidden="true" />
      </motion.div>
      <div className="photo-band-content">
        {kicker && <RevealText><div className="section-label section-label--light">{kicker}</div></RevealText>}
        <ul className="photo-band-lines">
          {lines.map((line, i) => (
            <RevealText key={i} delay={0.12 + i * 0.1} as="li">{line}</RevealText>
          ))}
        </ul>
      </div>
    </section>
  )
}
