import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, ArrowUpRight, Phone } from 'lucide-react';
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
          <button type="button" className="btn btn--solid btn--md" onClick={contact} aria-haspopup="dialog">Contact <ArrowUpRight size={15} aria-hidden="true" /></button>
          <button type="button" className="header__menu-toggle" aria-label="Open navigation menu" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}><Menu size={23} /></button>
        </div>
      </div>
    </header>
    <OverlayDialog open={open} onClose={() => setOpen(false)} className="mobile-menu" labelledBy="mobile-menu-title">
      <div className="mobile-menu__top"><span id="mobile-menu-title">Explore Selva Tree</span><button type="button" onClick={() => setOpen(false)} aria-label="Close navigation menu" autoFocus><X size={22} /></button></div>
      <nav aria-label="Mobile navigation">{nav.map((n, i) => <NavLink key={n.to} to={n.to} end onClick={() => setOpen(false)}><span className="mobile-menu__number">0{i + 1}</span><span>{n.label}</span><ArrowUpRight size={20} aria-hidden="true" /></NavLink>)}</nav>
      <div className="mobile-menu__bottom"><p>A little closer to nature.</p><button className='btn btn--solid btn--md' type="button" onClick={contact}>Plan your visit <ArrowUpRight size={18} /></button><a href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`}><Phone size={15} />{brand.phone}</a></div>
    </OverlayDialog>
  </>;
}
