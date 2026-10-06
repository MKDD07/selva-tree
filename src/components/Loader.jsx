import { useRef, useState } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { brand } from '../data/site';
import logoWhite from '../assets/logo/logo-white.svg';

export default function Loader({ onDone }) {
  const root = useRef(null);
  const [percent, setPercent] = useState(0);

  useGSAP(() => {
    document.documentElement.dataset.loading = 'true';
    const countObj = { val: 0 };

    const tl = gsap.timeline({
      onComplete: () => {
        delete document.documentElement.dataset.loading;
        onDone();
      },
    });

    // Animate loader counter and elements smoothly
    tl.to(countObj, {
      val: 100,
      duration: 1.3,
      ease: 'power2.inOut',
      onUpdate: () => setPercent(Math.round(countObj.val)),
    }, 0);

    tl.from('.loader__tag', { opacity: 0, y: -14, duration: 0.6, ease: 'power3.out' }, 0.1)
      .from('.loader__logo-icon', { scale: 0.9, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0.2)
      .from('.loader__desc', { opacity: 0, y: 12, duration: 0.6, ease: 'power3.out' }, 0.3)
      .fromTo('.loader__bar-fill', { scaleX: 0 }, { scaleX: 1, duration: 1.3, ease: 'power2.inOut' }, 0)
      // Exit animation
      .to(['.loader__tag', '.loader__logo-icon', '.loader__desc', '.loader__progress-group'], {
        y: -24,
        opacity: 0,
        stagger: 0.05,
        duration: 0.45,
        ease: 'power3.in',
      }, '+=0.2')
      .to('.loader__curtain', {
        yPercent: -100,
        duration: 0.85,
        ease: 'power4.inOut',
      }, '-=0.1')
      .to(root.current, {
        autoAlpha: 0,
        duration: 0.1,
      });
  }, { scope: root });

  return (
    <aside className="loader" ref={root} aria-label="Loading Selva Tree">
      <div className="loader__curtain" />
      <div className="loader__content">
        <div className="loader__logo-wrap">
          <img src={logoWhite} alt={brand.name} className="loader__logo-icon" />
        </div>
        <p className="loader__desc">A Little Closer to Nature</p>
        
        <div className="loader__progress-group">
          <div className="loader__bar">
            <div className="loader__bar-fill" />
          </div>
          <span className="loader__counter">{percent}%</span>
        </div>
      </div>
    </aside>
  );
}
