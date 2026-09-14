import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LoadingScreen from './components/LoadingScreen'
import Navigation from './components/Navigation'
import Footer from './components/Footer'
import { useRoute } from './router'
import { ThemeProvider } from './theme'
import { audio } from './audio'
import { smoothScroll } from './smoothScroll'
import Cursor from './components/Cursor'
import BackToTop from './components/BackToTop'
import Home from './pages/Home'

// Inner pages are code-split so the home page loads as fast as possible
const About = lazy(() => import('./pages/About'))
const Journey = lazy(() => import('./pages/Journey'))
const Gallery = lazy(() => import('./pages/Gallery'))
const Results = lazy(() => import('./pages/Results'))
const Partners = lazy(() => import('./pages/Partners'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

const PAGES = { home: Home, about: About, journey: Journey, gallery: Gallery, results: Results, partners: Partners, contact: Contact, notfound: NotFound }

function PageFallback() {
  return <div className="page-fallback" aria-hidden="true" />
}

function AppShell() {
  const [loaded, setLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)
  const { page } = useRoute()

  useEffect(() => {
    if (loaded) {
      const timer = setTimeout(() => setShowContent(true), 150)
      smoothScroll.init()
      return () => clearTimeout(timer)
    }
  }, [loaded])

  useEffect(() => {
    const titles = {
      home: 'Hanif Abdullah — Hit with Heart. Ace Your Dreams.',
      about: 'About — Hanif Abdullah',
      journey: 'Journey — Hanif Abdullah',
      gallery: 'Gallery — Hanif Abdullah',
      results: 'Results — Hanif Abdullah',
      partners: 'Partners — Hanif Abdullah',
      contact: 'Contact — Hanif Abdullah',
      notfound: 'Page not found — Hanif Abdullah'
    }
    document.title = titles[page] || titles.home
  }, [page])

  const Page = PAGES[page] || Home

  // transition sound when moving between pages
  const firstRoute = useRef(true)
  useEffect(() => {
    if (firstRoute.current) { firstRoute.current = false; return }
    audio.whoosh()
  }, [page])

  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      {loaded && (
        <motion.div
          className="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <a href="#main" className="skip-link">Skip to content</a>
          <Cursor />
          <Navigation page={page} />

          <AnimatePresence mode="wait">
            <motion.main
              key={page}
              id="main"
              className={`page page--${page}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
            >
              {/* burgundy wipe that reveals the new page */}
              <motion.div
                className="page-wipe"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                aria-hidden="true"
              />
              <Suspense fallback={<PageFallback />}>
                <Page />
              </Suspense>
            </motion.main>
          </AnimatePresence>

          <Footer />
          <BackToTop />
        </motion.div>
      )}
    </>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppShell />
    </ThemeProvider>
  )
}
