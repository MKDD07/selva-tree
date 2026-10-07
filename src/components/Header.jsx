import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Phone, Mail, MessageCircle, MapPin, Instagram, Facebook } from 'lucide-react';
import { brand, nav } from '../data/site';
import logoDark from '../assets/logo/logo-dark.svg';
import { Btn } from './ui';
import OverlayDialog from './OverlayDialog';
import './Header.css';

export default function Header({ onContact }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    const desktop = window.matchMedia('(min-width: 991px)');
    const resize = () => { if (desktop.matches) setOpen(false); };
    desktop.addEventListener('change', resize);
    return () => { window.removeEventListener('scroll', handleScroll); desktop.removeEventListener('change', resize); };
  }, []);
  const mainNav = nav.filter(n => n.to !== '/contact');
  const contact = () => { setOpen(false); onContact(); };
  return <>
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo"><img src={logoDark} alt={brand.name} className="header__logo-img" /></Link>
        <nav className="header__nav" aria-label="Main navigation">
          {mainNav.map(n => <NavLink key={n.to} to={n.to} end>{n.label}</NavLink>)}
          <div className="header__nav-action"><Btn to="/contact" className="header__btn" size="sm" icon={false}>Book Now</Btn></div>
        </nav>
        <div className="header__mobile-actions">
          <button type="button" className="header__menu-toggle" aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={23} /></button>
        </div>
      </div>
    </header>
    <OverlayDialog open={open} onClose={() => setOpen(false)} className="mobile-menu" labelledBy="mobile-menu-title">
      <div className="mobile-menu__top">
        <Link to="/" onClick={() => setOpen(false)} className="mobile-menu__logo-link" id="mobile-menu-title" aria-label={brand.name}>
          <img src={logoDark} alt={brand.name} className="mobile-menu__logo-img" />
        </Link>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close navigation menu" autoFocus><X size={22} /></button>
      </div>
      <nav aria-label="Mobile navigation">{nav.map((n, i) => <NavLink key={n.to} to={n.to} end onClick={() => setOpen(false)}><span>{n.label}</span><ArrowUpRight size={20} aria-hidden="true" /></NavLink>)}</nav>
      <div className="mobile-menu__bottom">
        <p className="mobile-menu__tagline">A little closer to nature.</p>
        
        {/* Action row with Plan your visit and 2 quick-action icons: Mail and Phone */}
        <div className="mobile-menu__actions-row">
          <button className="btn btn--solid btn--md mobile-menu__plan-btn" type="button" onClick={contact}>
            Plan your visit <ArrowUpRight size={17} aria-hidden="true" />
          </button>
          <a
            href={`mailto:${brand.email}`}
            className="mobile-menu__icon-btn"
            aria-label="Email Selva Tree"
            title="Email us"
          >
            <Mail size={19} aria-hidden="true" />
          </a>
          <a
            href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`}
            className="mobile-menu__icon-btn"
            aria-label={`Call ${brand.phone}`}
            title="Call us"
          >
            <Phone size={19} aria-hidden="true" />
          </a>
        </div>

        {/* Social media and quick links row */}
        <div className="mobile-menu__socials">
          <span className="mobile-menu__socials-label">Follow & Connect</span>
          <div className="mobile-menu__social-links">
            <a
              href={`https://wa.me/${brand.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="mobile-menu__social-link"
              title="WhatsApp"
            >
              <MessageCircle size={18} aria-hidden="true" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Instagram"
              className="mobile-menu__social-link"
              title="Instagram"
            >
              <Instagram size={18} aria-hidden="true" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit our Facebook"
              className="mobile-menu__social-link"
              title="Facebook"
            >
              <Facebook size={18} aria-hidden="true" />
            </a>
            <a
              href={brand.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on Google Maps"
              className="mobile-menu__social-link"
              title="Google Maps"
            >
              <MapPin size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </OverlayDialog>
  </>;
}
