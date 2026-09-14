import PageHeader from '../components/PageHeader'
import { AnimatedSection, RevealText } from '../components/Reveal'
import { GALLERY } from '../content/site'
import HAMark from '../components/HAMark'
import Tilt from '../components/Tilt'

function PhotoTile({ photo, index }) {
  const hasImage = Boolean(photo.src)
  return (
    <Tilt as="figure" className={`photo-tile ${index === 0 ? 'photo-tile--wide' : ''} ${hasImage ? '' : 'photo-tile--empty'}`} max={6}>
      {hasImage ? (
        <img src={photo.src} alt={photo.alt} loading="lazy" />
      ) : (
        <div className="photo-tile-placeholder" aria-hidden="true">
          <HAMark title="" />
        </div>
      )}
      <figcaption>
        <span>{photo.caption}</span>
        {!hasImage && <em>Photo coming soon</em>}
      </figcaption>
    </Tilt>
  )
}

function VideoTile({ video }) {
  return (
    <Tilt className="video-tile" max={6}>
      {video.embed ? (
        <div className="video-embed">
          <iframe
            src={video.embed}
            title={video.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="video-placeholder" aria-hidden="true">
          <span className="video-play">
            <svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" fill="currentColor" /></svg>
          </span>
        </div>
      )}
      <div className="video-meta">
        <span className="video-title">{video.title}</span>
        <span className="video-duration">{video.duration}</span>
      </div>
    </Tilt>
  )
}

export default function Gallery() {
  return (
    <>
      <PageHeader page="gallery" label={GALLERY.label} heading={GALLERY.heading} intro={GALLERY.intro} />

      <AnimatedSection id="photos" className="section--charcoal">
        <div className="container">
          <div className="section-head">
            <div>
              <RevealText><div className="section-label">Photos</div></RevealText>
              <RevealText delay={0.15}><h2 className="section-heading section-heading--md">On and off the court</h2></RevealText>
            </div>
            <RevealText delay={0.3}>
              <p className="section-note">Black · White · Burgundy — one consistent look.</p>
            </RevealText>
          </div>

          <div className="photo-grid">
            {GALLERY.photos.map((p, i) => (
              <RevealText key={i} delay={0.15 + i * 0.07}>
                <PhotoTile photo={p} index={i} />
              </RevealText>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection id="videos" className="section--dark">
        <div className="container">
          <div className="section-head">
            <div>
              <RevealText><div className="section-label">Videos</div></RevealText>
              <RevealText delay={0.15}><h2 className="section-heading section-heading--md">Moving pictures</h2></RevealText>
            </div>
          </div>
          <div className="video-grid">
            {GALLERY.videos.map((v, i) => (
              <RevealText key={i} delay={0.15 + i * 0.1}>
                <VideoTile video={v} />
              </RevealText>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </>
  )
}
