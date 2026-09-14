import { useTheme } from '../theme'

/* ---- Wine / Dark display switch ---- */
export default function ThemeSwitch({ className = '' }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={`theme-switch ${className}`} role="group" aria-label="Display mode">
      <button
        type="button"
        className={theme === 'wine' ? 'active' : ''}
        onClick={() => setTheme('wine')}
        aria-pressed={theme === 'wine'}
        title="Wine mode — white & burgundy"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" fill="currentColor" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" /></svg>
        <span>Wine</span>
      </button>
      <button
        type="button"
        className={theme === 'dark' ? 'active' : ''}
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        title="Dark mode — charcoal & burgundy"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a7 7 0 1 0 10.5 10.5z" fill="currentColor" /></svg>
        <span>Dark</span>
      </button>
      <span className="theme-switch-thumb" aria-hidden="true" data-theme={theme} />
    </div>
  )
}
