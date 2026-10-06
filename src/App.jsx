import { Fragment, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import Lenis from 'lenis';
import { setScrollController } from './scroll';

import FloatingContact from './components/FloatingContact';
import ContactSheet from './components/ContactSheet';
import { Header, Footer } from './components/Layout';
import { registry } from './components/Sections';
import { pages } from './data/site';
import AdminApp from './components/admin/AdminApp';
import Loader from './components/Loader';

gsap.registerPlugin(ScrollTrigger, useGSAP);

let hasShownInitialLoader = false;

export default function App() {
  const [contactOpen, setContactOpen] = useState(false);
  const [loading, setLoading] = useState(() => !hasShownInitialLoader);
  const { pathname } = useLocation();

  const isAdminRoute = pathname === '/admin-login' || pathname.startsWith('/admin');

  const main = useRef(null);
  const sections = pages[pathname] || pages['/'];

  useEffect(() => {
    if (isAdminRoute) return;
    const lenis = new Lenis({ lerp: 0.09 });
    setScrollController(lenis);
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { setScrollController(null); gsap.ticker.remove(tick); lenis.destroy(); };
  }, [isAdminRoute]);

  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);

  useGSAP(() => {
    if (isAdminRoute) return;
    gsap.utils.toArray('[data-reveal]').forEach((el) =>
      gsap.from(el, { y: 44, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' } })
    );
    gsap.utils.toArray('[data-parallax]').forEach((el) =>
      gsap.fromTo(el, { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: el.parentElement, scrub: true } })
    );
    ScrollTrigger.refresh();
  }, { scope: main, dependencies: [pathname, isAdminRoute] });

  if (isAdminRoute) {
    return <AdminApp />;
  }

  return (
    <>
      {loading && (
        <Loader
          onDone={() => {
            hasShownInitialLoader = true;
            setLoading(false);
          }}
        />
      )}
      <Header onContact={() => setContactOpen(true)} />
      <main ref={main}>
        {sections.map((s, i) => {
          const Section = registry[s.type];
          return <Section key={`${pathname}-${i}`} {...s} />;
        })}
      </main>
      <Footer />
      <FloatingContact onContact={() => setContactOpen(true)} />
      <ContactSheet open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}


