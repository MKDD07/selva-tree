import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { brand } from '../data/site';
import logoWhite from '../assets/logo/logo-white.svg';

export default function Loader({ onDone }) {
  const root = useRef(null);

  useGSAP(() => {
    document.documentElement.dataset.loading = 'true';
    const tl = gsap.timeline({
      onComplete: () => {
        delete document.documentElement.dataset.loading;
        onDone();
      },
    });

    tl.from('.loader__tag', { opacity: 0, y: -12, duration: 0.6, ease: 'power2.out' })
      .from('.loader__logo-icon', { scale: 0.85, opacity: 0, duration: 0.7, ease: 'back.out(1.7)' }, '-=0.3')
      .fromTo('.loader__bar-fill', { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'power2.inOut' }, '-=0.4')
      .to('.loader__logo', { y: -20, opacity: 0, duration: 0.45, ease: 'power2.in' }, '+=0.2')
      .to('.loader__curtain', { scaleY: 0, duration: 0.8, ease: 'power4.inOut' }, '-=0.1')
      .to(root.current, { autoAlpha: 0, duration: 0.2 }, '-=0.1');
  }, { scope: root });

  return (
    <div className="loader" ref={root}>
      <div className="loader__curtain" />
      <div className="loader__logo">
        <span className="loader__tag">PRIVATE RETREAT & ESTATES</span>
        <img src={logoWhite} alt={brand.name} className="loader__logo-icon" />
        <div className="loader__bar">
          <div className="loader__bar-fill" />
        </div>
      </div>
    </div>
  );
}
