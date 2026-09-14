/* ---- Official HA mark as inline SVG (fills with currentColor so it follows the theme) ---- */
export default function HAMark({ className = '', title = 'HA logo', ...props }) {
  return (
    <svg
      className={`ha-mark ${className}`}
      viewBox="0 0 500 600"
      role="img"
      aria-label={title}
      fill="currentColor"
      {...props}
    >
      <path d="M 160 85 L 195 85 L 195 505 L 160 535 Z" />
      <path d="M 240 95 L 275 95 L 275 420 L 240 470 Z" />
      <path d="M 115 265 C 105 265 105 240 120 240 L 335 240 L 335 272 L 120 272 C 110 272 108 268 115 265 Z" />
      <path d="M 240 95 C 335 95 405 160 405 265 C 405 345 375 395 370 415 C 365 390 370 345 370 265 C 370 185 320 132 240 132 Z" />
    </svg>
  )
}
