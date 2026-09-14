import { useEffect, useState, useCallback } from 'react'

/* ------------------------------------------------------------
   Tiny hash router — no extra dependencies.
   URLs look like:  #/about   #/contact/media   #/journey/spain
   The first segment is the page, the optional second segment is
   an element id on that page to scroll to.
   ------------------------------------------------------------ */

import { smoothScroll } from './smoothScroll'

const PAGES = ['home', 'about', 'journey', 'gallery', 'results', 'partners', 'contact']

export function parseHash(hash = window.location.hash) {
  const clean = hash.replace(/^#\/?/, '')
  const [pageRaw = '', section = ''] = clean.split('/')
  const page = PAGES.includes(pageRaw) ? pageRaw : (pageRaw ? 'notfound' : 'home')
  return { page, section }
}

export function hrefFor(page, section) {
  return section ? `#/${page}/${section}` : `#/${page}`
}

export function navigate(page, section) {
  const next = hrefFor(page, section)
  if (window.location.hash === next) {
    // Same route — still scroll (e.g. clicking a section link twice)
    scrollToSection(section)
    return
  }
  window.location.hash = next
}

export function scrollToSection(section) {
  if (!section) {
    smoothScroll.to(0)
    return
  }
  const el = document.getElementById(section)
  if (el) {
    const offset = 90 // fixed nav height
    const top = el.getBoundingClientRect().top + window.scrollY - offset
    smoothScroll.to(top)
  }
}

export function useRoute() {
  const [route, setRoute] = useState(() => parseHash())

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  // Scroll handling after route change
  useEffect(() => {
    if (route.section) {
      // Wait for the page to render before scrolling
      const t = setTimeout(() => scrollToSection(route.section), 120)
      return () => clearTimeout(t)
    }
    smoothScroll.reset(0)
  }, [route.page, route.section])

  const go = useCallback((page, section) => navigate(page, section), [])

  return { ...route, go }
}
