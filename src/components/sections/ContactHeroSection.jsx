import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowDown } from 'lucide-react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { formatTitle } from '../ui';
import '../../styles/contact.css';

export default function ContactHeroSection({ image }) {
  const ref = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.contact-hero__image', { yPercent: -6 }, {
        yPercent: 6, ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.7 },
      });
    });
    return () => media.revert();
  }, { scope: ref });
  return (
    <section className="contact-hero" ref={ref}>
      <img className="contact-hero__image" src={image} alt="" fetchPriority="high" />
      <div className="contact-hero__shade" />
      <div className="wrap contact-hero__body">
        <nav className="contact-hero__breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span aria-hidden="true">/</span><span aria-current="page">Contact</span></nav>
        <p className="eyebrow">A stay worth looking forward to</p>
        <h1>{formatTitle('Contact Selva Tree & plan your visit.')}</h1>
        <p className="contact-hero__description">A quiet weekend, a joyful celebration, or time with your favourite people. Let us help you make it yours.</p>
        <div className="contact-hero__bottom"><span><MapPin size={16} aria-hidden="true" />Manesar, Gurgaon</span><a href="#contact-enquiry">Let's plan your visit <ArrowDown size={17} aria-hidden="true" /></a></div>
      </div>
    </section>
  );
}
