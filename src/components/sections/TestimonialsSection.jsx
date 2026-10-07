import { useRef } from 'react';
import { Star, ArrowLeft, ArrowRight } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { formatTitle } from '../ui';

export default function TestimonialsSection({ title = 'Loved by Guests & Hosts', subtitle, items = [] }) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="sec testimonials-sec">
      <div className="wrap testimonials-grid">
        {/* Left Column (col-3 area) */}
        <div className="testimonials-col-left" data-reveal>
          <div className="testimonials-header">
            <h2>{formatTitle(title)}</h2>
            {subtitle && <p className="hero__text" style={{ color: 'var(--text-muted)', fontSize: 'var(--fs-base)', marginTop: '-14px', marginBottom: '28px' }}>{subtitle}</p>}
          </div>
          <div className="testimonials-nav">
            <button ref={prevRef} className="testimonials-btn testimonials-btn--prev" aria-label="Previous review">
              <ArrowLeft size={18} />
            </button>
            <button ref={nextRef} className="testimonials-btn testimonials-btn--next" aria-label="Next review">
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        {/* Right Column (col-9 area with Swiper) */}
        <div className="testimonials-col-right" data-reveal>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              prevEl: prevRef.current,
              nextEl: nextRef.current,
            }}
            onBeforeInit={(swiper) => {
              swiper.params.navigation.prevEl = prevRef.current;
              swiper.params.navigation.nextEl = nextRef.current;
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
                spaceBetween: 24,
              },
            }}
            loop={items.length > 2}
            className="testimonials-swiper"
          >
            {items.map((item, index) => (
              <SwiperSlide key={index} style={{ height: 'auto', display: 'flex' }}>
                <div className="testimonial-card">
                  <div className="testimonial-card__top">
                    <div className="testimonial-stars">
                      {[...Array(item.stars || 5)].map((_, i) => (
                        <Star key={i} size={16} fill="#c88b48" color="#c88b48" />
                      ))}
                    </div>
                    <h3 className="testimonial-title">"{item.title}"</h3>
                    <p className="testimonial-body">{item.review}</p>
                  </div>
                  
                  {item.name && (
                    <div className="testimonial-author">
                      <div className="testimonial-avatar-initial" aria-hidden="true">
                        {item.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div className="testimonial-author-info">
                        <strong>{item.name}</strong>
                        <span>{item.role}{item.location ? ` · ${item.location}` : ''}</span>
                      </div>
                    </div>
                  )}
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
