import { useState, useEffect } from 'react'

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    setMenuOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <nav className={`nav ${scrolled ? 'scrolled' : ''}`} role="navigation" aria-label="Main navigation">
        {/* Left Brand Area: Official HA Logo ONLY */}
        <a 
          href="#hero" 
          onClick={(e) => { e.preventDefault(); scrollTo('hero') }} 
          className="nav-brand"
          aria-label="Hanif Abdullah - Go to top"
        >
          <img src="/ha-logo.png" alt="HA Official Logo" className="nav-logo" />
        </a>

        <ul className="nav-links">
          <li><a href="#journey" onClick={(e) => { e.preventDefault(); scrollTo('journey') }}>Journey</a></li>
          <li><a href="#training" onClick={(e) => { e.preventDefault(); scrollTo('training') }}>Training</a></li>
          <li><a href="#vision" onClick={(e) => { e.preventDefault(); scrollTo('vision') }}>Vision</a></li>
        </ul>

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
      </nav>

      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} role="dialog" aria-label="Mobile menu">
        <a href="#journey" onClick={(e) => { e.preventDefault(); scrollTo('journey') }}>JOURNEY</a>
        <a href="#training" onClick={(e) => { e.preventDefault(); scrollTo('training') }}>TRAINING</a>
        <a href="#vision" onClick={(e) => { e.preventDefault(); scrollTo('vision') }}>VISION</a>
      </div>
    </>
  )
}
