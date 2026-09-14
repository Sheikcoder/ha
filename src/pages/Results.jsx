import PageHeader from '../components/PageHeader'
import { AnimatedSection, RevealText } from '../components/Reveal'
import { RESULTS } from '../content/site'
import Tilt from '../components/Tilt'

export default function Results() {
  return (
    <>
      <PageHeader page="results" label={RESULTS.label} heading={RESULTS.heading} intro={RESULTS.intro} />

      {/* ---- Titles / summary ---- */}
      <AnimatedSection id="titles" className="section--charcoal section--tight">
        <div className="container">
          <div className="stats-row stats-row--cards">
            {RESULTS.titles.map((t, i) => (
              <RevealText key={i} delay={0.1 + i * 0.1}>
                <Tilt className="stat stat--card">
                  <div className="stat-number">{t.value}</div>
                  <div className="stat-label">{t.title}</div>
                  <div className="stat-note">{t.note}</div>
                </Tilt>
              </RevealText>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Tournament history ---- */}
      <AnimatedSection id="history" className="section--dark">
        <div className="container">
          <div className="section-head">
            <div>
              <RevealText><div className="section-label">Tournament history</div></RevealText>
              <RevealText delay={0.15}><h2 className="section-heading section-heading--md">Every match, recorded</h2></RevealText>
            </div>
            <RevealText delay={0.3}><p className="section-note">{RESULTS.note}</p></RevealText>
          </div>

          <RevealText delay={0.3}>
            <div className="table-wrap">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Location</th>
                    <th>Surface</th>
                    <th>Result</th>
                    <th>What he took from it</th>
                  </tr>
                </thead>
                <tbody>
                  {RESULTS.history.map((row, i) => (
                    <tr key={i}>
                      <td data-label="Event">{row.event}</td>
                      <td data-label="Location">{row.location}</td>
                      <td data-label="Surface">{row.surface}</td>
                      <td data-label="Result"><span className="result-pill">{row.result}</span></td>
                      <td data-label="Takeaway">{row.outcome}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </RevealText>
        </div>
      </AnimatedSection>

      {/* ---- Rankings ---- */}
      <AnimatedSection id="rankings" className="section--burgundy section--tight">
        <div className="container container--narrow center">
          <RevealText><div className="section-label section-label--light">{RESULTS.rankings.heading}</div></RevealText>
          <RevealText delay={0.15}><h2 className="section-heading section-heading--md">When applicable</h2></RevealText>
          <RevealText delay={0.3}><p className="section-subheading">{RESULTS.rankings.text}</p></RevealText>
        </div>
      </AnimatedSection>
    </>
  )
}
