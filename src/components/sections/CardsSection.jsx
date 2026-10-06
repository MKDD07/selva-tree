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
                {Icon && <Icon size={26} strokeWidth={1.4} />}
                <h3>{c.title}</h3>
                <p>{c.text}</p>
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
