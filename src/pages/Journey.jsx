import PageHeader from '../components/PageHeader'
import { AnimatedSection, RevealText } from '../components/Reveal'
import { JOURNEY, BRAND } from '../content/site'
import { hrefFor } from '../router'
import JourneyTimeline from '../components/JourneyTimeline'

export default function Journey() {
  return (
    <>
      <PageHeader page="journey" label={JOURNEY.label} heading={JOURNEY.heading} intro={JOURNEY.intro} />

      <section id="timeline" className="section section--charcoal section--timeline">
        <JourneyTimeline milestones={JOURNEY.milestones} />
      </section>

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
