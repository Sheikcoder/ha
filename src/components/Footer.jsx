import { BRAND, NAV } from '../content/site'
import { hrefFor } from '../router'
import HAMark from './HAMark'

function SocialIcon({ icon }) {
  switch (icon) {
    case 'instagram':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <circle cx="17.3" cy="6.7" r="1.1" fill="currentColor" />
        </svg>
      )
    case 'youtube':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="2.5" y="5.5" width="19" height="13" rx="4" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M10 9l5 3-5 3z" fill="currentColor" />
        </svg>
      )
    case 'facebook':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M14 8h2.5V5H14c-2.2 0-3.5 1.5-3.5 3.6V11H8v3h2.5v7h3v-7H16l.5-3h-3V9c0-.6.3-1 .5-1z" fill="currentColor" />
        </svg>
      )
    default:
      return null
  }
}

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer">
      <HAMark className="footer-mark" title="" aria-hidden="true" />
      <div className="footer-inner">
        <div className="footer-brand">
          <HAMark className="footer-logo" />
          <div className="footer-name">{BRAND.name}</div>
          <div className="footer-tagline">{BRAND.tagline}</div>
          <div className="footer-phrase">{BRAND.phrase}</div>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Explore</div>
          <ul>
            {NAV.map(item => (
              <li key={item.id}><a href={hrefFor(item.id)}>{item.label}</a></li>
            ))}
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Contact</div>
          <ul>
            <li><a href={hrefFor('contact', 'sponsorship')}>Sponsorship</a></li>
            <li><a href={hrefFor('contact', 'media')}>Media</a></li>
            <li><a href={hrefFor('contact', 'academies')}>Academies</a></li>
          </ul>
        </div>

        <div className="footer-col">
          <div className="footer-col-title">Follow</div>
          <div className="footer-socials">
            {BRAND.socials.map(s => (
              <a key={s.label} href={s.href} aria-label={s.label} className="footer-social">
                <SocialIcon icon={s.icon} />
              </a>
            ))}
          </div>
          <div className="footer-hashtag">{BRAND.hashtag}</div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} {BRAND.name}. All rights reserved.</span>
        <span className="footer-closing">{BRAND.closingLine}</span>
      </div>
    </footer>
  )
}
