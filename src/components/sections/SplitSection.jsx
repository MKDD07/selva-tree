import { Eyebrow, Btn, formatTitle } from '../ui';

export default function SplitSection({ eyebrow, title, text = [], image, points = [], link, flip }) {
  return (
    <section className={`sec split ${flip ? 'split--flip' : ''}`}>
      <div className="wrap">
        <div className="split__header" data-reveal>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2>{formatTitle(title)}</h2>
        </div>
        <div className="split__grid">
          <div className="split__media" data-reveal>
            <img src={image} alt={title} loading="lazy" />
          </div>
          <div className="split__copy">
            {text.map((t, i) => <p key={i} data-reveal>{t}</p>)}
            {points.length > 0 && <ul data-reveal>{points.map((p) => <li key={p}>{p}</li>)}</ul>}
            {link && <div data-reveal><Btn to={link.to} variant="bordered">{link.label}</Btn></div>}
          </div>
        </div>
      </div>
    </section>
  );
}
