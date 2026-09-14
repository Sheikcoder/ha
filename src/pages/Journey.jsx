import PageHeader from '../components/PageHeader'
import { AnimatedSection, RevealText } from '../components/Reveal'
import { JOURNEY, BRAND } from '../content/site'
import { hrefFor } from '../router'

export default function Journey() {
  return (
    <>
      <PageHeader label={JOURNEY.label} heading={JOURNEY.heading} intro={JOURNEY.intro} />

      <AnimatedSection id="timeline" className="section--charcoal">
        <div className="container container--narrow">
          <ol className="timeline">
            {JOURNEY.milestones.map((m, i) => (
              <li key={m.id} id={m.id} className={`timeline-item timeline-item--${m.status}`}>
                <RevealText delay={0.1 + i * 0.08}>
                  <div className="timeline-marker" aria-hidden="true">
                    <span />
                  </div>
                  <div className="timeline-card" data-chapter={m.chapter}>
                    <div className="timeline-chapter">Chapter {m.chapter}</div>
                    <h3 className="timeline-title">{m.title}</h3>
                    <div className="timeline-location">{m.location}</div>
                    <p className="timeline-text">{m.text}</p>
                    {m.status === 'next' && <span className="timeline-badge">Up next</span>}
                  </div>
                </RevealText>
              </li>
            ))}
          </ol>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section--closing section--closing-sm">
        <div className="container container--narrow center">
          <RevealText><p className="closing-line">{BRAND.altClosingLine}</p></RevealText>
          <RevealText delay={0.2}>
            <div className="hero-actions">
              <a href={hrefFor('results')} className="btn btn--primary">See the results</a>
              <a href={hrefFor('gallery')} className="btn btn--ghost">Open the gallery</a>
            </div>
          </RevealText>
        </div>
      </AnimatedSection>
    </>
  )
}
