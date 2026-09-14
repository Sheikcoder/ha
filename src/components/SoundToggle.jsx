import { useSound, audio } from '../audio'

/* ---- Speaker button: turns music + sound effects on/off ---- */
export default function SoundToggle({ className = '', label = true }) {
  const { enabled } = useSound()

  return (
    <button
      type="button"
      className={`sound-toggle ${enabled ? 'on' : ''} ${className}`}
      onClick={() => audio.toggle()}
      aria-pressed={enabled}
      aria-label={enabled ? 'Turn sound off' : 'Turn sound on'}
      title={enabled ? 'Sound on — click to mute' : 'Sound off — click for music & effects'}
    >
      <span className="sound-bars" aria-hidden="true">
        <i /><i /><i /><i />
      </span>
      {label && <span className="sound-label">{enabled ? 'Sound on' : 'Sound off'}</span>}
    </button>
  )
}
