import { createContext, useContext, useEffect, useState, useCallback } from 'react'

/* ------------------------------------------------------------
   Theme: 'wine' (white + burgundy, default) or 'dark' (charcoal).
   Stored in localStorage and applied as data-theme on <html>.
   ------------------------------------------------------------ */

export const THEMES = ['wine', 'dark']
const STORAGE_KEY = 'ha-theme'

function readStored() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return THEMES.includes(v) ? v : null
  } catch {
    return null
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? '#121215' : '#f8f6f6')
}

const ThemeContext = createContext({ theme: 'wine', setTheme: () => {}, toggleTheme: () => {} })

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readStored() || 'wine')

  useEffect(() => { applyTheme(theme) }, [theme])

  const setTheme = useCallback((next) => {
    if (!THEMES.includes(next)) return
    setThemeState(next)
    try { window.localStorage.setItem(STORAGE_KEY, next) } catch { /* ignore */ }
  }, [])

  const toggleTheme = useCallback(() => {
    setTheme(theme === 'dark' ? 'wine' : 'dark')
  }, [theme, setTheme])

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
