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
            <span className="stats__reel" data-steps={steps} style={{ transform: `translateY(${-100 * steps / (steps + 1)}%)` }}>
              {Array.from({ length: steps + 1 }, (_, row) => <span className="stats__digit-row" key={row}>{row % 10}</span>)}
            </span>
          </span>;
        })}
        {suffix && <span className="stats__suffix">{suffix}</span>}
      </span>
    </strong>
  );
}

export default function StatsSection({ items = [] }) {
  const ref = useRef(null);
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add({ animated: '(prefers-reduced-motion: no-preference)', reduced: '(prefers-reduced-motion: reduce)' }, (context) => {
      const reels = gsap.utils.toArray('.stats__reel', ref.current);
      const finalPosition = (_, element) => {
        const steps = Number(element.dataset.steps);
        return -100 * steps / (steps + 1);
      };
      if (context.conditions.reduced) {
        gsap.set(reels, { yPercent: finalPosition });
        return;
      }
      gsap.fromTo(reels, { yPercent: 0 }, {
        yPercent: finalPosition, duration: 2.4, stagger: 0.09, ease: 'power3.inOut',
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });
      gsap.from('.stats__item', {
        y: 20, opacity: 0, duration: 0.7, stagger: 0.12,
        scrollTrigger: { trigger: ref.current, start: 'top 80%', once: true },
      });
    });
    return () => media.revert();
  }, { scope: ref, dependencies: [items], revertOnUpdate: true });
  return (
    <section className="sec sec--dark stats-section" ref={ref} aria-label="The estate in numbers">
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
