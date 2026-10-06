import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { brand, nav } from '../data/site';
import logoDark from '../assets/logo/logo-dark.svg';
import { Btn } from './ui';

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mainNav = nav.filter((n) => n.to !== '/contact');
  const ctaNav = nav.find((n) => n.to === '/contact');

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="header__inner">
        <Link to="/" className="header__logo" onClick={() => setOpen(false)}>
          <img src={logoDark} alt={brand.name} className="header__logo-img" />
        </Link>
        <nav className={`header__nav ${open ? 'is-open' : ''}`}>
          {mainNav.map((n) => (
            <NavLink 
              key={n.to} 
              to={n.to} 
              end 
              onClick={() => setOpen(false)}
            >
              {n.label}
            </NavLink>
          ))}
          {ctaNav && (
            <div className="header__nav-action">
              <Btn 
                to={ctaNav.to} 
                variant="solid" 
                className="header__btn" size="sm" icon={false}
                onClick={() => setOpen(false)}
              >
                {ctaNav.label}
              </Btn>
            </div>
          )}
        </nav>
        <button className="header__burger" aria-label="Menu" onClick={() => setOpen(!open)}>
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  );
}
