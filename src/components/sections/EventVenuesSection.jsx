import { Check, Users, Sparkles } from 'lucide-react';
import { Btn, Eyebrow, formatTitle } from '../ui';
import '../../styles/event-venues.css';

export default function EventVenuesSection({ eyebrow, title, subtitle, intro, venues = [] }) {
  return (
    <section className="event-venues-sec">
      <div className="wrap">
        <div className="event-venues-header" data-reveal>
          <Eyebrow>{eyebrow || 'Your Dream Event'}</Eyebrow>
          <h2>{formatTitle(title || 'Banquet & Lawn Spaces in Gurgaon')}</h2>
          {subtitle && <p className="event-venues-header__subtitle">{subtitle}</p>}
          {intro && <p className="event-venues-header__intro">{intro}</p>}
        </div>

        <div className="event-venues-list">
          {venues.map((v, idx) => (
            <article key={v.name || idx} className={`venue-card ${idx % 2 === 1 ? 'venue-card--flip' : ''}`} data-reveal>
              <div className="venue-card__media">
                <img src={v.image} alt={v.name} loading="lazy" />
                {v.tag && <span className="venue-card__tag">{v.tag}</span>}
              </div>

              <div className="venue-card__content">
                <span className="venue-card__badge">{v.badge || 'Event Space'}</span>
                <h3>{v.name}</h3>
                <p className="venue-card__description">{v.description}</p>
                
                {v.highlights && (
                  <ul className="venue-card__highlights">
                    {v.highlights.map((h, i) => (
                      <li key={i}><Check size={16} aria-hidden="true" /> {h}</li>
                    ))}
                  </ul>
                )}

                {v.capacities && (
                  <div className="venue-card__table-wrap">
                    <h4><Users size={16} aria-hidden="true" /> Size &amp; Occupancy</h4>
                    <div className="venue-card__table-scroll">
                      <table className="venue-card__table">
                        <thead>
                          <tr>
                            <th>Seating</th>
                            <th>Floating</th>
                            <th>Theatre</th>
                            <th>Classroom</th>
                            <th>Cluster</th>
                            <th>U-Shape</th>
                            <th>Boardroom</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td><strong>{v.capacities.seating}</strong></td>
                            <td>{v.capacities.floating}</td>
                            <td>{v.capacities.theatre}</td>
                            <td>{v.capacities.classroom}</td>
                            <td>{v.capacities.cluster}</td>
                            <td>{v.capacities.uShape}</td>
                            <td>{v.capacities.boardroom}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                <div className="venue-card__cta">
                  <Btn
                    href="#contact-enquiry"
                    variant="bordered"
                    size="sm"
                    onClick={(event) => {
                      const contact = document.getElementById('contact-enquiry');
                      if (!contact) return;
                      event.preventDefault();
                      contact.scrollIntoView({
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                        block: 'start',
                      });
                    }}
                  >Plan Event in This Space</Btn>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
