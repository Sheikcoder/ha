import PageHeader from '../components/PageHeader'
import { AnimatedSection, RevealText, RevealHeading } from '../components/Reveal'
import Tilt from '../components/Tilt'
import { ABOUT, BRAND, VALUES } from '../content/site'
import { hrefFor } from '../router'

export default function About() {
  return (
    <>
      <PageHeader
        page="about"
        label="About"
        heading={'Every champion\nbegins as a learner.'}
        intro="Who Hanif is, what he is working towards, and the kind of person we hope this journey helps him become."
      />

      {/* ---- Story ---- */}
      <AnimatedSection id="story" className="section--split">
        <div className="split">
          <div className="split-media">
            <RevealText>
              <Tilt as="figure" className="photo-frame" max={6}>
                <img src="/poster2.jpg" alt="Hanif Abdullah on court" />
                <figcaption>{BRAND.hashtag}</figcaption>
              </Tilt>
            </RevealText>
          </div>
          <div className="split-text">
            <RevealText><div className="section-label">{ABOUT.story.label}</div></RevealText>
            <RevealHeading className="section-heading" text={ABOUT.story.heading} delay={0.1} />
            <RevealText delay={0.3}><div className="section-divider section-divider--left" /></RevealText>
            {ABOUT.story.paragraphs.map((p, i) => (
              <RevealText key={i} delay={0.4 + i * 0.1}>
                <p className="section-body section-body--left">{p}</p>
              </RevealText>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Goals ---- */}
      <AnimatedSection id="goals" className="section--charcoal">
        <div className="container">
          <div className="section-head">
            <div>
              <RevealText><div className="section-label">{ABOUT.goals.label}</div></RevealText>
              <RevealText delay={0.15}><h2 className="section-heading section-heading--md">{ABOUT.goals.heading}</h2></RevealText>
            </div>
          </div>
          <div className="goal-grid">
            {ABOUT.goals.items.map((g, i) => (
              <RevealText key={i} delay={0.2 + i * 0.1}>
                <Tilt className="card goal-card">
                  <div className="goal-index">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="goal-title">{g.title}</h3>
                  <p className="goal-text">{g.text}</p>
                </Tilt>
              </RevealText>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Vision ---- */}
      <AnimatedSection id="vision" className="section--burgundy">
        <div className="container container--narrow center">
          <RevealText><div className="section-label section-label--light">{ABOUT.vision.label}</div></RevealText>
          <RevealText delay={0.15}><h2 className="section-heading">{ABOUT.vision.heading}</h2></RevealText>
          <RevealText delay={0.3}>
            <blockquote className="vision-quote">“{ABOUT.vision.quote}”</blockquote>
          </RevealText>
          <RevealText delay={0.45}><p className="section-subheading">{ABOUT.vision.body}</p></RevealText>
          <RevealText delay={0.6}>
            <div className="values-inline">
              {VALUES.map(v => <span key={v}>{v}</span>)}
            </div>
          </RevealText>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section--closing section--closing-sm">
        <div className="container container--narrow center">
          <RevealText><p className="closing-line">{BRAND.altClosingLine}</p></RevealText>
          <RevealText delay={0.2}>
            <a href={hrefFor('journey')} className="btn btn--primary">Follow the journey</a>
          </RevealText>
        </div>
      </AnimatedSection>
    </>
  )
}
