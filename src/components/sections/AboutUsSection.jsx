import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowUpRight, Sparkles, Trees, ShieldCheck, HeartHandshake } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import logoSvg from '../../assets/logo/logo.svg';
import { Eyebrow, Btn, formatTitle } from '../ui';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutUsSection({
  eyebrow = 'About Selva Tree',
  badge = 'Est. 2005 · Sohna, Gurugram',
  title = 'A Sanctuary of Nature, Serenity & Private Luxury',
  subtitle = 'Nestled at the scenic foothills of the Aravallis, crafted for unforgettable stays & celebrations.',
  paragraphs = [
    'Established in 2005 in Sohna Rural, Gurugram, Selva Tree Hotels & Resorts was conceived as an eco-conscious sanctuary where luxury harmoniously blends with natural tranquility. Surrounded by pristine Aravalli greenery, our estate offers a serene escape from urban chaos.',
    'Spanning over 20,000 sq. ft. of manicured party lawns, 7 boutique suites, a private swimming pool with 6-seater jacuzzi, and dedicated indoor banquet spaces, we provide complete estate exclusivity for destination weddings, family getaways, pool parties, and corporate offsites.'
  ],
  pillars = [
    { icon: Trees, label: '20,000+ Sq. Ft. Lawns', desc: 'Up to 400 floating guests capacity' },
    { icon: Sparkles, label: '7 Boutique Suites', desc: 'Private buyout up to 25 guests' },
    { icon: ShieldCheck, label: '100% Estate Privacy', desc: 'Solar powered & groundwater harvested' },
    { icon: HeartHandshake, label: 'Bespoke Hospitality', desc: 'Custom catering, live BBQ & DJ allowed' }
  ],
  cta = { label: 'Explore Our Story', to: '/about-us' },
  cta2 = { label: 'Plan Your Stay', to: '/contact' }
}) {
  const containerRef = useRef(null);
  const logoWrapperRef = useRef(null);
  const logoImgRef = useRef(null);
  const glowRef = useRef(null);
  const textContentRef = useRef(null);
  const pillarsRef = useRef(null);
  const ctaRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 80%',
        toggleActions: 'play none none none',
      }
    });

    // Ambient glow entrance
    if (glowRef.current) {
      tl.fromTo(
        glowRef.current,
        { scale: 0.6, opacity: 0 },
        { scale: 1, opacity: 0.85, duration: 1.4, ease: 'power2.out' },
        0
      );
    }

    // Centered Logo entrance animation on viewport
    if (logoImgRef.current) {
      tl.fromTo(
        logoImgRef.current,
        { scale: 0.72, opacity: 0, y: 40, filter: 'blur(6px)' },
        { scale: 1, opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' },
        0.1
      );
    }

    // Badge and Eyebrow
    tl.fromTo(
      '.about-center__tag, .about-center__eyebrow',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
      0.3
    );

    // Title and story paragraphs
    if (textContentRef.current) {
      const heading = textContentRef.current.querySelector('h2');
      const paras = textContentRef.current.querySelectorAll('p');
      tl.fromTo(
        [heading, ...paras],
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9, stagger: 0.12, ease: 'power3.out' },
        0.45
      );
    }

    // Feature pillars stagger
    if (pillarsRef.current) {
      const cards = pillarsRef.current.querySelectorAll('.about-pillar');
      tl.fromTo(
        cards,
        { y: 35, opacity: 0, scale: 0.96 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
        0.65
      );
    }

    // Call to actions
    if (ctaRef.current) {
      tl.fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' },
        0.85
      );
    }
  }, { scope: containerRef });

  return (
    <section className="about-center-sec" ref={containerRef} id="about-us-preview">
      {/* Background radial luxury accents */}
      <div className="about-center__bg-orb about-center__bg-orb--top" aria-hidden="true" />
      <div className="about-center__bg-orb about-center__bg-orb--bottom" aria-hidden="true" />

      <div className="wrap">
        <div className="about-center__content">
          {/* Centered Crest / Logo Area */}
          <div className="about-center__logo-stage" ref={logoWrapperRef}>
            <div className="about-center__glow" ref={glowRef} aria-hidden="true" />
          
            <div className="about-center__logo-frame">
              <img
                ref={logoImgRef}
                src={logoSvg}
                alt="Selva Tree Hotels & Resorts Logo"
                className="about-center__logo-img"
                loading="lazy"
              />
            </div>
          </div>

          {/* Centered Editorial Story */}
          <div className="about-center__text-wrap" ref={textContentRef}>
            {eyebrow && (
              <p className="eyebrow about-center__eyebrow">{eyebrow}</p>
            )}
            <h2 className="about-center__title">{formatTitle(title)}</h2>
            {subtitle && <p className="about-center__lead">{subtitle}</p>}

            <div className="about-center__narrative">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>
          </div>

          {/* 4 Core Pillars Grid (Desktop) */}
          {pillars && pillars.length > 0 && (
            <div className="about-center__pillars" ref={pillarsRef}>
              {pillars.map((item, idx) => {
                const IconComponent = item.icon || Sparkles;
                return (
                  <div key={idx} className="about-pillar">
                    <div className="about-pillar__icon-box">
                      <IconComponent size={20} className="about-pillar__icon" />
                    </div>
                    <h4 className="about-pillar__label">{item.label}</h4>
                    <p className="about-pillar__desc">{item.desc}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* 4 Core Pillars Swiper (Mobile) */}
          {pillars && pillars.length > 0 && (
            <div className="about-center__mobile-swiper">
              <Swiper
                slidesPerView={1.2}
                spaceBetween={14}
                className="about-center-swiper"
              >
                {pillars.map((item, idx) => {
                  const IconComponent = item.icon || Sparkles;
                  return (
                    <SwiperSlide key={idx} style={{ height: 'auto', display: 'flex' }}>
                      <div className="about-pillar" style={{ width: '100%', height: '100%' }}>
                        <div className="about-pillar__icon-box">
                          <IconComponent size={20} className="about-pillar__icon" />
                        </div>
                        <h4 className="about-pillar__label">{item.label}</h4>
                        <p className="about-pillar__desc">{item.desc}</p>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>
          )}

          {/* Action Buttons */}
          {(cta || cta2) && (
            <div className="about-center__actions" ref={ctaRef}>
              {cta && (
                <Btn to={cta.to} variant="solid" icon={<ArrowUpRight size={16} />}>
                  {cta.label}
                </Btn>
              )}
              {cta2 && (
                <Btn to={cta2.to} variant="bordered">
                  {cta2.label}
                </Btn>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
