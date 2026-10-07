import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Eyebrow, formatTitle } from '../ui';

export default function EventShowcaseSection({ eyebrow, title, text, items = [], theme = 'cream' }) {
  return (
    <section className={`sec event-showcase event-showcase--${theme}`}>
      <div className="wrap">
        <div className="event-showcase__header" data-reveal>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2>{formatTitle(title)}</h2>
          {text && <p>{text}</p>}
        </div>

        {/* Desktop Grid */}
        <div className="event-showcase__grid">
          {items.map((item, idx) => (
            <div key={idx} className="event-card" data-reveal>
              <div className="event-card__img">
                <img src={item.image} alt={item.title} loading="lazy" />
              </div>
              <div className="event-card__body">
                <h3>{item.title}</h3>
                <p>{item.text}</p>
                {item.badge && <span className="event-card__badge">{item.badge}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Swiper (1.2 slides visible) */}
        <div className="event-showcase__mobile-swiper">
          <Swiper
            slidesPerView={1.2}
            spaceBetween={16}
            className="event-showcase-swiper"
          >
            {items.map((item, idx) => (
              <SwiperSlide key={idx} style={{ height: 'auto', display: 'flex' }}>
                <div className="event-card" style={{ width: '100%', height: '100%' }}>
                  <div className="event-card__img">
                    <img src={item.image} alt={item.title} loading="lazy" />
                  </div>
                  <div className="event-card__body">
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                    {item.badge && <span className="event-card__badge">{item.badge}</span>}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
