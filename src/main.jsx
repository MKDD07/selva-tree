import React from 'react';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import barba from '@barba/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import App from './App.jsx';
import { pages } from './data/site';
import { updateSeo } from './seo';
import './styles/global.css';
import './styles/sections.css';
import './styles/buttons.css';

const roots = new WeakMap();
const curtain = document.getElementById('page-curtain');
const isIndexPage = location.pathname === '/' || location.pathname === '/index.html';

if (!isIndexPage) {
  document.documentElement.dataset.loading = 'true';
  curtain.style.visibility = 'visible';
} else {
  curtain.style.visibility = 'hidden';
}
const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function mount(container, href) {
  const url = new URL(href, location.origin);
  const root = createRoot(container.querySelector('#root'));
  roots.set(container, root);
  flushSync(() => root.render(<MemoryRouter initialEntries={[url.pathname + url.search + url.hash]}><App /></MemoryRouter>));
  updateSeo(url.pathname);
}
async function ready(container) {
  const images = [...container.querySelectorAll('img')].filter(img => img.loading !== 'lazy');
  await Promise.race([
    Promise.all([document.fonts.ready, ...images.map(img => img.decode().catch(() => {}))]),
    new Promise(resolve => setTimeout(resolve, 5000)),
  ]);
}
async function reveal(container, initial = false) {
  await ready(container);
  ScrollTrigger.refresh();
  await gsap.to(curtain, { yPercent: -100, duration: reduced() ? 0 : initial ? 0.85 : 0.55, ease: 'power3.inOut' });
  curtain.style.visibility = 'hidden';
  delete document.documentElement.dataset.loading;
  container.inert = false;
}
// Capture internal links before React Router: Barba is the only navigation owner.
function navigate(event) {
  const link = event.target.closest?.('a[href]');
  if (!link || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target === '_blank' || link.hasAttribute('download')) return;
  const url = new URL(link.href, location.href);
  if (url.origin !== location.origin || !pages[url.pathname]) return;
  if (url.pathname === '/admin-login' || url.pathname.startsWith('/admin')) return;
  if (url.pathname === location.pathname && url.hash) return;
  event.preventDefault();
  event.stopPropagation();
  if (document.documentElement.dataset.loading || barba.transitions.isRunning || url.href === location.href) return;
  barba.go(url.href, link);
}
document.addEventListener('click', navigate, true);
barba.init({
  preventRunning: true,
  timeout: 10000,
  prevent: ({ href }) => {
    const url = new URL(href, location.href);
    return !pages[url.pathname] || Boolean(url.hash) || url.pathname === '/admin-login' || url.pathname.startsWith('/admin');
  },

  transitions: [{
    name: 'estate-curtain',
    async once({ next }) {
      mount(next.container, location.href);
      if (isIndexPage) {
        next.container.inert = false;
        // Index page has its own dedicated luxury loader screen; Barba does not double-animate curtain
        await ready(next.container);
        ScrollTrigger.refresh();
      } else {
        next.container.inert = true;
        await reveal(next.container, true);
      }
    },
    async leave({ current }) {
      document.documentElement.dataset.loading = 'true';
      current.container.inert = true;
      gsap.set(curtain, { visibility: 'visible', yPercent: 100 });
      await gsap.to(curtain, { yPercent: 0, duration: reduced() ? 0 : 0.4, ease: 'power3.inOut' });
      roots.get(current.container)?.unmount();
      roots.delete(current.container);
    },
    beforeEnter({ next }) {
      window.scrollTo(0, 0);
      mount(next.container, next.url.href);
      next.container.inert = true;
    },
    async enter({ next }) {
      await reveal(next.container);
      const heading = next.container.querySelector('h1, h2');
      if (heading) { heading.setAttribute('tabindex', '-1'); heading.focus({ preventScroll: true }); }
      const hash = new URL(next.url.href).hash;
      if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    },
  }],
});
if (import.meta.hot) import.meta.hot.dispose(() => { document.removeEventListener('click', navigate, true); barba.destroy(); });
