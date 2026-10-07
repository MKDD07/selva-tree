import { Users, Armchair, Sparkles, Check, ArrowRight } from 'lucide-react';
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
                <div className="venue-card__media-overlay">
                  {v.badge && <span className="venue-card__badge-glass">{v.badge}</span>}
                  {v.tag && <span className="venue-card__tag-glass">{v.tag}</span>}
                </div>
              </div>

              <div className="venue-card__content">
                <div className="venue-card__header-meta">
                  <span className="venue-card__kicker">Space {String(idx + 1).padStart(2, '0')}</span>
                  <h3>{v.name}</h3>
                </div>

                <p className="venue-card__description">{v.description}</p>
                
                {v.highlights && (
                  <div className="venue-card__features">
                    {v.highlights.map((h, i) => (
                      <span key={i} className="venue-card__feature-pill">
                        <Check size={14} className="venue-card__feature-check" />
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {v.capacities && (
                  <div className="venue-card__capacity-block">
                    <div className="venue-card__capacity-header">
                      <h4><Users size={15} /> Size &amp; Seating Capacity</h4>
                    </div>

                    {/* Primary Hero Capacities */}
                    <div className="venue-card__hero-capacities">
                      <div className="venue-card__hero-metric venue-card__hero-metric--primary">
                        <Armchair size={18} className="venue-card__metric-icon" />
                        <div>
                          <span className="venue-card__metric-num">{v.capacities.seating}</span>
                          <span className="venue-card__metric-label">Seated Guests</span>
                        </div>
                      </div>

                      <div className="venue-card__hero-metric venue-card__hero-metric--secondary">
                        <Sparkles size={18} className="venue-card__metric-icon" />
                        <div>
                          <span className="venue-card__metric-num">{v.capacities.floating}</span>
                          <span className="venue-card__metric-label">Floating Capacity</span>
                        </div>
                      </div>
                    </div>

                    {/* Secondary Setup Layouts */}
                    <div className="venue-card__setup-grid">
                      {v.capacities.theatre && (
                        <div className="venue-card__setup-item">
                          <span className="venue-card__setup-label">Theatre</span>
                          <strong className="venue-card__setup-val">{v.capacities.theatre}</strong>
                        </div>
                      )}
                      {v.capacities.cluster && (
                        <div className="venue-card__setup-item">
                          <span className="venue-card__setup-label">Cluster</span>
                          <strong className="venue-card__setup-val">{v.capacities.cluster}</strong>
                        </div>
                      )}
                      {v.capacities.classroom && (
                        <div className="venue-card__setup-item">
                          <span className="venue-card__setup-label">Classroom</span>
                          <strong className="venue-card__setup-val">{v.capacities.classroom}</strong>
                        </div>
                      )}
                      {(v.capacities.uShape || v.capacities.boardroom) && (
                        <div className="venue-card__setup-item">
                          <span className="venue-card__setup-label">U-Shape / Board</span>
                          <strong className="venue-card__setup-val">{v.capacities.uShape || v.capacities.boardroom}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="venue-card__cta">
                  <Btn
                    href="#contact-enquiry"
                    variant="solid"
                    size="md"
                    onClick={(event) => {
                      const contact = document.getElementById('contact-enquiry');
                      if (!contact) return;
                      event.preventDefault();
                      contact.scrollIntoView({
                        behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth',
                        block: 'start',
                      });
                    }}
                  >
                    Plan Event in This Space <ArrowRight size={16} />
                  </Btn>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
