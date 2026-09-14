import { useState, useEffect } from 'react'
import { NAV, BRAND } from '../content/site'
import { hrefFor } from '../router'
import HAMark from './HAMark'
import ThemeSwitch from './ThemeSwitch'
import SoundToggle from './SoundToggle'
import { motion, useScroll, useSpring } from 'framer-motion'

export default function Navigation({ page }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.3 })

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close the mobile menu whenever the route changes
  useEffect(() => { setMenuOpen(false) }, [page])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`nav ${scrolled || page !== 'home' ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        <a href={hrefFor('home')} className="nav-brand" aria-label={`${BRAND.name} — home`}>
          <HAMark className="nav-logo" />
          <span className="nav-brand-text">
            <span className="nav-brand-name">{BRAND.name}</span>
            <span className="nav-brand-phrase">{BRAND.phrase}</span>
          </span>
        </a>

        <ul className="nav-links">
          {NAV.map(item => (
            <li key={item.id}>
              <a
                href={hrefFor(item.id)}
                className={page === item.id ? 'active' : ''}
                aria-current={page === item.id ? 'page' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          <SoundToggle label={false} />
          <ThemeSwitch />
          <a href={hrefFor('contact', 'sponsorship')} className="nav-cta">Partner with Hanif</a>
        </div>

        <button
          className={`nav-hamburger ${menuOpen ? 'open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <motion.span className="nav-progress" style={{ scaleX: progress }} aria-hidden="true" />
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} role="dialog" aria-label="Mobile menu">
        {NAV.map((item, i) => (
          <a
            key={item.id}
            href={hrefFor(item.id)}
            className={page === item.id ? 'active' : ''}
            style={{ transitionDelay: `${0.05 * i}s` }}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <div className="mobile-menu-footer">
          <div className="mobile-menu-controls">
            <SoundToggle />
            <ThemeSwitch />
          </div>
          <span>{BRAND.tagline}</span>
        </div>
      </div>
    </>
  )
}
