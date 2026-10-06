import { Fragment, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { setScrollController } from './scroll';

import FloatingContact from './components/FloatingContact';
import PageGuide from './components/PageGuide';
import { Header, Footer } from './components/Layout';
import { registry } from './components/Sections';
import { pages } from './data/site';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function App() {
  const { pathname } = useLocation();

  const main = useRef(null);
  const sections = pages[pathname] || pages['/'];

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.09 });
    setScrollController(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { setScrollController(null); gsap.ticker.remove(tick); lenis.destroy(); };
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  useGSAP(() => {
    gsap.utils.toArray('[data-reveal]').forEach((el) =>
      gsap.from(el, { y: 44, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
    );
    gsap.utils.toArray('[data-parallax]').forEach((el) =>
      gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, scrub: true } })
    );
    ScrollTrigger.refresh();
  }, { scope: main, dependencies: [pathname] });

  return (
    <>

      <Header />
      <main ref={main}>
        {sections.map((s, i) => {
          const Section = registry[s.type];
          return <Fragment key={`${pathname}-${i}`}><Section {...s} />{i === 0 && <PageGuide pathname={pathname} />}</Fragment>;
        })}
      </main>
      <Footer />
      <FloatingContact />
    </>
  );
}
