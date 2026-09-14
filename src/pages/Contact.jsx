import { useState } from 'react'
import PageHeader from '../components/PageHeader'
import { AnimatedSection, RevealText } from '../components/Reveal'
import { CONTACT, BRAND } from '../content/site'

export default function Contact() {
  const [topic, setTopic] = useState(CONTACT.channels[0].id)
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    const channel = CONTACT.channels.find(c => c.id === topic) || CONTACT.channels[0]
    const subject = encodeURIComponent(`[${channel.title}] ${form.get('name') || 'Website enquiry'}`)
    const body = encodeURIComponent(
      `Name: ${form.get('name')}\nOrganisation: ${form.get('org')}\nEmail: ${form.get('email')}\n\n${form.get('message')}`
    )
    // Opens the visitor's email client with everything pre-filled.
    window.location.href = `mailto:${channel.email}?subject=${subject}&body=${body}`
    setSent(true)
  }

  return (
    <>
      <PageHeader label={CONTACT.label} heading={CONTACT.heading} intro={CONTACT.intro} />

      {/* ---- Channels ---- */}
      <AnimatedSection id="channels" className="section--charcoal section--tight">
        <div className="container">
          <div className="contact-grid">
            {CONTACT.channels.map((c, i) => (
              <RevealText key={c.id} delay={0.1 + i * 0.1}>
                <div className="card contact-card" id={c.id}>
                  <div className="contact-card-index">{String(i + 1).padStart(2, '0')}</div>
                  <h3 className="contact-card-title">{c.title}</h3>
                  <p className="contact-card-text">{c.text}</p>
                  <a href={`mailto:${c.email}`} className="contact-card-email">{c.email}</a>
                  <button type="button" className="text-link" onClick={() => { setTopic(c.id); document.getElementById('form')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
                    Write to us
                  </button>
                </div>
              </RevealText>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* ---- Form ---- */}
      <AnimatedSection id="form" className="section--dark">
        <div className="container container--narrow">
          <RevealText><div className="section-label">Send a message</div></RevealText>
          <RevealText delay={0.15}><h2 className="section-heading section-heading--md">We read every message</h2></RevealText>

          <RevealText delay={0.3}>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label className="field">
                  <span>Your name</span>
                  <input name="name" type="text" required autoComplete="name" />
                </label>
                <label className="field">
                  <span>Organisation</span>
                  <input name="org" type="text" autoComplete="organization" />
                </label>
              </div>
              <div className="form-row">
                <label className="field">
                  <span>Email</span>
                  <input name="email" type="email" required autoComplete="email" />
                </label>
                <label className="field">
                  <span>Topic</span>
                  <select name="topic" value={topic} onChange={(e) => setTopic(e.target.value)}>
                    {CONTACT.channels.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </label>
              </div>
              <label className="field">
                <span>Message</span>
                <textarea name="message" rows="6" required />
              </label>
              <div className="form-actions">
                <button type="submit" className="btn btn--primary">Send message</button>
                {sent && <span className="form-hint">Your email app should open with the message ready to send.</span>}
              </div>
            </form>
          </RevealText>
        </div>
      </AnimatedSection>

      <AnimatedSection className="section--closing section--closing-sm">
        <div className="container container--narrow center">
          <RevealText><p className="closing-line">{BRAND.tagline}</p></RevealText>
          <RevealText delay={0.2}><p className="closing-phrase">{BRAND.phrase}</p></RevealText>
        </div>
      </AnimatedSection>
    </>
  )
}
