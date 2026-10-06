import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { Eyebrow, formatTitle } from '../ui';

export default function CardsSection({ eyebrow, title, items = [], variant }) {
  return (
    <section className="sec">
      <div className="wrap">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="sec__title" data-reveal>{formatTitle(title)}</h2>
        <div className={`cards cards--${variant}`}>
          {items.map((c) => {
            const Icon = c.icon && Icons[c.icon];
            const body = (
              <>
                {c.image && <div className="card__img"><img src={c.image} alt={c.title} loading="lazy" /></div>}
                {Icon && (
                  <div className="card__icon-wrap">
                    <Icon size={24} strokeWidth={1.5} />
                  </div>
                )}
                <div className="card__content">
                  <h3>{c.title}</h3>
                  {c.badge && <span className="card__badge">{c.badge}</span>}
                  {c.text && <p className="card__desc">{c.text}</p>}
                  {c.points && c.points.length > 0 && (
                    <ul className="card__list">
                      {c.points.map((pt, idx) => (
                        <li key={idx}>
                          <span className="card__list-bullet" aria-hidden="true">•</span>
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {c.cta && (
                    <div className="card__actions">
                      <Link to={c.cta.to || '/contact'} className="btn btn--solid btn--sm">
                        {c.cta.label || 'Reserve This Room'}
                      </Link>
                    </div>
                  )}
                </div>
              </>
            );
            return c.to
              ? <Link key={c.title} to={c.to} className="card" data-reveal>{body}</Link>
              : <article key={c.title} className="card" data-reveal>{body}</article>;
          })}
        </div>
      </div>
    </section>
  );
}
