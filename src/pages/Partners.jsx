import PageHeader from '../components/PageHeader'
import { AnimatedSection, RevealText } from '../components/Reveal'
import { PARTNERS, VALUES } from '../content/site'
import { hrefFor } from '../router'
import Tilt from '../components/Tilt'

export default function Partners() {
  return (
    <>
      <PageHeader page="partners" label={PARTNERS.label} heading={PARTNERS.heading} intro={PARTNERS.intro} />

      {/* ---- Future sponsors ---- */}
      <AnimatedSection id="sponsors" className="section--split section--charcoal">
        <div className="split">
          <div className="split-text">
            <RevealText><div className="section-label">Future sponsors</div></RevealText>
            <RevealText delay={0.15}><h2 className="section-heading section-heading--md">{PARTNERS.sponsors.heading}</h2></RevealText>
            <RevealText delay={0.3}><div className="section-divider section-divider--left" /></RevealText>
            <RevealText delay={0.4}><p className="section-body section-body--left">{PARTNERS.sponsors.text}</p></RevealText>
            <RevealText delay={0.5}>
              <a href={hrefFor('contact', 'sponsorship')} className="btn btn--primary">{PARTNERS.sponsors.cta}</a>
            </RevealText>
          </div>
          <div className="split-media">
            <RevealText delay={0.2}>
              <div className="partner-slots" aria-label="Sponsor placements">
                {['Title partner', 'Equipment partner', 'Travel partner', 'Academy partner'].map(slot => (
                  <Tilt key={slot} className="partner-slot" max={10}>
                    <span className="partner-slot-mark" aria-hidden="true" />
                    <span>{slot}</span>
                    <em>Your brand here</em>
                  </Tilt>
                ))}
              </div>
            </RevealText>
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Equipment ---- */}
      <AnimatedSection id="equipment" className="section--dark">
        <div className="container">
          <div className="section-head">
            <div>
              <RevealText><div className="section-label">Equipment</div></RevealText>
              <RevealText delay={0.15}><h2 className="section-heading section-heading--md">{PARTNERS.equipment.heading}</h2></RevealText>
            </div>
          </div>
          <div className="goal-grid goal-grid--three">
            {PARTNERS.equipment.items.map((item, i) => (
              <RevealText key={i} delay={0.2 + i * 0.1}>
                <Tilt className="card goal-card">
                  <div className="goal-index">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="goal-title">{item.name}</h3>
                  <p className="goal-text">{item.text}</p>
                </Tilt>
              </RevealText>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Academies ---- */}
      <AnimatedSection id="academies" className="section--burgundy">
        <div className="container container--narrow center">
          <RevealText><div className="section-label section-label--light">Academies</div></RevealText>
          <RevealText delay={0.15}><h2 className="section-heading section-heading--md">{PARTNERS.academies.heading}</h2></RevealText>
          <RevealText delay={0.3}><p className="section-subheading">{PARTNERS.academies.text}</p></RevealText>
          <RevealText delay={0.45}>
            <div className="values-inline">
              {VALUES.map(v => <span key={v}>{v}</span>)}
            </div>
          </RevealText>
          <RevealText delay={0.55}>
            <a href={hrefFor('contact', 'academies')} className="btn btn--white">{PARTNERS.academies.cta}</a>
          </RevealText>
        </div>
      </AnimatedSection>
    </>
  )
}
