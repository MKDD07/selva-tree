import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

function Odometer({ value, suffix = '' }) {
  return (
    <strong className="stats__value" aria-label={String(value) + suffix}>
      <span className="stats__digits" aria-hidden="true">
        {String(value).split('').map((digit, index) => {
          if (!/\d/.test(digit)) return <span key={index}>{digit}</span>;
          const steps = 20 + Number(digit);
          return <span className="stats__digit" key={index}>
            <span className="stats__reel" data-steps={steps}>
              {Array.from({ length: steps + 1 }, (_, row) => <span className="stats__digit-row" key={row}>{row % 10}</span>)}
            </span>
          </span>;
        })}
        {suffix && <span className="stats__suffix">{suffix}</span>}
      </span>
    </strong>
  );
}

export default function StatsSection({ items = [], theme = 'dark' }) {
  const ref = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ animated: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
      const reels = gsap.utils.toArray('.stats__reel', ref.current);
      const finalPosition = (_, element) => {
        const steps = Number(element.dataset.steps);
        // Translate by -(steps * 100 / (steps + 1))% so the last digit (steps % 10) is perfectly centered
        return -((steps / (steps + 1)) * 100);
      };
      if (context.conditions.reduced) {
        reels.forEach(el => {
          const steps = Number(el.dataset.steps);
          el.style.transform = `translateY(-${(steps / (steps + 1)) * 100}%)`;
        });
        return;
      }
      gsap.fromTo(reels, 
        { yPercent: 0 }, 
        {
          yPercent: finalPosition,
          duration: 2.2,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
        }
      );
      gsap.from('.stats__item', {
        y: 20, opacity: 0, duration: 0.7, stagger: 0.1,
        scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
      });
    });
    return () => media.revert();
  }, { scope: ref, dependencies: [items], revertOnUpdate: true });
  return (
    <section className={`sec stats-section stats-section--${theme} ${theme === 'dark' || theme === 'forest' ? 'sec--dark' : ''}`} ref={ref} aria-label="The estate in numbers">
      <div className="wrap">
        <div className="stats-section__intro">
          <p className="eyebrow">Space to make memories</p>
          <p>A little more room. A lot more possibility.</p>
        </div>
        <div className="stats">
          {items.map((item) => <div className="stats__item" key={item.label}>
            <Odometer value={item.value} suffix={item.suffix} />
            <span className="stats__label">{item.label}</span>
          </div>)}
        </div>
      </div>
    </section>
  );
}
