import { Eyebrow, Btn, formatTitle } from '../ui';

export default function FeatureBannerSection({ eyebrow, title, text, cta, image, badges = [], theme = 'cream' }) {
  const badgePositions = ['tl', 'mr', 'bl'];

  return (
    <section className={`sec feature-banner feature-banner--${theme}`}>
      <div className="wrap">
        <div className="feature-banner__card">
          <div className="feature-banner__copy" data-reveal>
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            <h2>{formatTitle(title)}</h2>
            <p>{text}</p>
            {cta && <Btn to={cta.to} variant="solid">{cta.label}</Btn>}
          </div>
          <div className="feature-banner__media" data-reveal>
            <div className="feature-banner__img">
              <img src={image} alt={title} loading="lazy" />
            </div>
            {badges.map((b, i) => (
              <div key={i} className={`pill-badge pill-badge--${b.pos || badgePositions[i % badgePositions.length]}`}>
                <strong>{b.prefix}</strong> {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
