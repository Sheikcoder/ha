import { hrefFor } from '../router'
import HAMark from '../components/HAMark'

export default function NotFound() {
  return (
    <section className="section section--closing notfound">
      <div className="container container--narrow center">
        <HAMark className="closing-logo" />
        <div className="section-label">Out</div>
        <h1 className="section-heading">That page is<br />outside the lines.</h1>
        <p className="section-subheading">The link may be old or mistyped. Let's get back on court.</p>
        <div className="hero-actions">
          <a href={hrefFor('home')} className="btn btn--primary">Back to home</a>
          <a href={hrefFor('journey')} className="btn btn--ghost">See the journey</a>
        </div>
      </div>
    </section>
  )
}
