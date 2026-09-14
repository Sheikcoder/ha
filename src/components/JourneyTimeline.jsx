import { useLayoutEffect, useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Tilt from './Tilt'
import { RevealText } from './Reveal'
import { reducedMotion } from '../perf'

gsap.registerPlugin(ScrollTrigger)

/* ------------------------------------------------------------
   Journey timeline.
   Desktop: the section pins and the chapters travel horizontally
   as you scroll (GSAP ScrollTrigger) with a progress line and a
   huge chapter number that counts along.
   Mobile / reduced motion: a vertical timeline.
   ------------------------------------------------------------ */

function useDesktop() {
  const [desktop, setDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024 && !reducedMotion)
  useEffect(() => {
    const onResize = () => setDesktop(window.innerWidth >= 1024 && !reducedMotion)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return desktop
}

function ChapterCard({ m }) {
  return (
    <Tilt className="timeline-card" data-chapter={m.chapter} max={5}>
      <div className="timeline-chapter">Chapter {m.chapter}</div>
      <h3 className="timeline-title">{m.title}</h3>
      <div className="timeline-location">{m.location}</div>
      <p className="timeline-text">{m.text}</p>
      {m.status === 'next' && <span className="timeline-badge">Up next</span>}
    </Tilt>
  )
}

export default function JourneyTimeline({ milestones }) {
  const desktop = useDesktop()
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const lineRef = useRef(null)
  const counterRef = useRef(null)

  useLayoutEffect(() => {
    if (!desktop) return
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const ctx = gsap.context(() => {
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 120)

      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            if (lineRef.current) lineRef.current.style.transform = `scaleX(${self.progress.toFixed(4)})`
            if (counterRef.current) {
              const idx = Math.min(milestones.length - 1, Math.floor(self.progress * milestones.length + 0.0001))
              const chapter = milestones[idx]?.chapter
              if (chapter && counterRef.current.textContent !== chapter) counterRef.current.textContent = chapter
            }
          }
        }
      })

      // chapters slide + fade in as they arrive
      gsap.utils.toArray('.timeline-item--h').forEach((item) => {
        gsap.fromTo(item, { opacity: 0.3, y: 28 }, {
          opacity: 1, y: 0, ease: 'none',
          scrollTrigger: { trigger: item, containerAnimation: tween, start: 'left 92%', end: 'left 58%', scrub: true }
        })
      })
    }, section)

    // fonts / images can change the track width after mount
    const t = setTimeout(() => ScrollTrigger.refresh(), 400)
    return () => { clearTimeout(t); ctx.revert() }
  }, [desktop, milestones])

  if (!desktop) {
    return (
      <div className="container container--narrow">
        <ol className="timeline">
          {milestones.map((m, i) => (
            <RevealText key={m.id} delay={0.1 + i * 0.08} as="li" className={`timeline-item timeline-item--${m.status}`}>
              <div id={m.id} className="timeline-marker" aria-hidden="true"><span /></div>
              <ChapterCard m={m} />
            </RevealText>
          ))}
        </ol>
      </div>
    )
  }

  return (
    <div className="journey-h" ref={sectionRef}>
      <div className="journey-h-head">
        <div className="journey-h-counter" aria-hidden="true">
          <span ref={counterRef}>{milestones[0]?.chapter || '01'}</span>
          <small>/ {milestones[milestones.length - 1]?.chapter}</small>
        </div>
        <div className="journey-h-hint">Scroll to travel through the chapters</div>
      </div>
      <div className="journey-h-line" aria-hidden="true"><span ref={lineRef} /></div>
      <ol className="journey-h-track" ref={trackRef}>
        {milestones.map((m) => (
          <li key={m.id} id={m.id} className={`timeline-item timeline-item--${m.status} timeline-item--h`}>
            <ChapterCard m={m} />
          </li>
        ))}
      </ol>
    </div>
  )
}
