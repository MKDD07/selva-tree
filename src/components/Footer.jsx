import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Phone, Mail, MapPin } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { brand } from '../data/site';
import logoWhite from '../assets/logo/logo-white.svg';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Footer() {
  const footer = useRef(null);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.footer__watermark', { y: 65 }, {
        y: -35, ease: 'none',
        scrollTrigger: { trigger: footer.current, start: 'top bottom', end: 'bottom bottom', scrub: 1 },
      });
      gsap.fromTo('.footer__intro-copy', { y: 30 }, {
        y: 0, ease: 'none',
        scrollTrigger: { trigger: footer.current, start: 'top bottom', end: 'top 25%', scrub: 1 },
      });
    });
    return () => media.revert();
  }, { scope: footer });

  return (
    <footer className="footer-wrap" ref={footer}>
      <div className="footer">
        <div className="footer__watermark" aria-hidden="true">Dr Bhagat</div>
        <div className="wrap footer__container">
          <div className="footer__intro">
            <div className="footer__intro-copy">
              <p className="footer__eyebrow">A little closer to nature</p>
              <h2>Good times.<br /><em>Great company.</em></h2>
              <p>Your next favourite memory starts here.</p>
            </div>
            <Link to="/contact" className="footer__invitation">
              <span className="footer__invitation-icon"><ArrowUpRight size={34} aria-hidden="true" /></span>
              <span>Let's plan your visit</span>
            </Link>
          </div>

          <div className="footer__columns">
            <div className="footer__brand">
              <Link to="/" className="footer__logo-link"><img src={logoWhite} alt={brand.name} className="footer__logo-img" /></Link>
              <p className="footer__tagline">{brand.tagline}</p>
              <a className="footer__location" href={brand.mapsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16} aria-hidden="true" /> Sohna Rural, Gurugram <ArrowUpRight size={14} aria-hidden="true" /></a>
            </div>
            <nav className="footer__col" aria-label="Footer explore">
              <h3>Explore</h3>
              <Link to="/about-us">Our story</Link>
              <Link to="/stay">Suites & stays</Link>
              <Link to="/events">Weddings & events</Link>
              <Link to="/gallery">The gallery</Link>
            </nav>
            <nav className="footer__col" aria-label="Footer experiences">
              <h3>Make it an occasion</h3>
              <Link to="/events">A countryside wedding</Link>
              <Link to="/events">Celebrate together</Link>
              <Link to="/events">A team escape</Link>
              <Link to="/stay">A weekend away</Link>
            </nav>
            <div className="footer__col footer__col--connect">
              <h3>Say hello</h3>
              <a href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`}><Phone size={16} aria-hidden="true" /><span>{brand.phone}</span></a>
              <a href={`mailto:${brand.email}`}><Mail size={16} aria-hidden="true" /><span>{brand.email}</span></a>
              <a className="footer__whatsapp" href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <ArrowUpRight size={16} aria-hidden="true" /></a>
            </div>
          </div>

          <div className="footer__bottom">
            <p>&copy; {new Date().getFullYear()} {brand.name}. All rights reserved.</p>
            <a href="/api/photo-credits">Photo credits / Pexels</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
