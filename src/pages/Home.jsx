import { Suspense, lazy } from 'react'
import Hero from '../components/Hero'
import { AnimatedSection, RevealText, RevealHeading } from '../components/Reveal'
import { BRAND, HOME, VALUES, JOURNEY } from '../content/site'
import { hrefFor } from '../router'
import HAMark from '../components/HAMark'
import Tilt from '../components/Tilt'

const Logo3D = lazy(() => import('../components/Logo3D'))

export default function Home() {
  const nextMilestone = JOURNEY.milestones.find(m => m.status === 'next')

  return (
    <>
      <Hero />

      {/* ---- Marquee strip ---- */}
      <div className="marquee" aria-label="Brand values">
        <div className="marquee-track">
          {[0, 1].map(copy => (
            <div key={copy} style={{ display: 'flex' }} aria-hidden={copy === 1}>
              {[BRAND.tagline, ...VALUES, BRAND.phrase, BRAND.hashtag].map((item, i) => (
                <span key={i} className="marquee-item">{item}<i /></span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ---- Introduction ---- */}
      <AnimatedSection id="intro" className="section--split">
        <div className="split">
          <div className="split-media">
            <Suspense fallback={<div className="logo3d-fallback" />}>
              <Logo3D height="440px" />
            </Suspense>
          </div>
          <div className="split-text">
            <RevealText><div className="section-label">{HOME.intro.label}</div></RevealText>
            <RevealHeading className="section-heading" text={HOME.intro.heading} delay={0.1} />
            <RevealText delay={0.3}><div className="section-divider section-divider--left" /></RevealText>
            {HOME.intro.body.map((p, i) => (
              <RevealText key={i} delay={0.4 + i * 0.1}>
                <p className="section-body section-body--left">{p}</p>
              </RevealText>
            ))}
            <RevealText delay={0.7}>
              <a href={hrefFor('about')} className="text-link">Read Hanif's story</a>
            </RevealText>
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Latest news ---- */}
      <AnimatedSection id="news" className="section--charcoal">
        <div className="container">
          <div className="section-head">
            <div>
              <RevealText><div className="section-label">Latest news</div></RevealText>
              <RevealHeading className="section-heading section-heading--md" text="From the court" delay={0.1} />
            </div>
            <RevealText delay={0.3}>
              <a href={hrefFor('gallery')} className="text-link">View the gallery</a>
            </RevealText>
          </div>

          <div className="news-grid">
            {HOME.news.map((item, i) => (
              <RevealText key={i} delay={0.2 + i * 0.12}>
                <Tilt as="article" className="card news-card">
                  <div className="news-card-meta">
                    <span className="news-card-tag">{item.tag}</span>
                    <span className="news-card-date">{item.date}</span>
                  </div>
                  <h3 className="news-card-title">{item.title}</h3>
                  <p className="news-card-excerpt">{item.excerpt}</p>
                </Tilt>
              </RevealText>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Next milestone / CTA ---- */}
      <AnimatedSection id="next" className="section--burgundy">
        <div className="container container--narrow center">
          <RevealText><div className="section-label section-label--light">Next milestone</div></RevealText>
          <RevealText delay={0.15}>
            <h2 className="section-heading">{nextMilestone ? nextMilestone.title : 'The road ahead'}</h2>
          </RevealText>
          <RevealText delay={0.3}>
            <p className="section-subheading">{nextMilestone ? nextMilestone.text : ''}</p>
          </RevealText>
          <RevealText delay={0.45}>
            <div className="hero-actions">
              <a href={hrefFor('journey')} className="btn btn--white">See the timeline</a>
              <a href={hrefFor('partners')} className="btn btn--ghost-light">Become a partner</a>
            </div>
          </RevealText>
        </div>
      </AnimatedSection>

      {/* ---- Closing statement ---- */}
      <AnimatedSection className="section--closing">
        <div className="container container--narrow center">
          <RevealText><HAMark className="closing-logo" /></RevealText>
          <RevealText delay={0.2}><p className="closing-line">{BRAND.closingLine}</p></RevealText>
          <RevealText delay={0.4}><p className="closing-phrase">{BRAND.phrase}</p></RevealText>
        </div>
      </AnimatedSection>
    </>
  )
}
