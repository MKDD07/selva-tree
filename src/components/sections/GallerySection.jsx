import { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { farmhouses } from '../../data/site';
import { Btn } from '../ui';
import { jumpTo } from '../../scroll';
import '../../styles/gallery.css';

const photos = farmhouses.flatMap(house => house.images.map((src, index) => ({ src, house, index })));

export default function GallerySection() {
  const [active, setActive] = useState('all');
  const [selected, setSelected] = useState(0);
  const rail = useRef(null);
  const explorer = useRef(null);
  const photoTriggers = useRef([]);
  const filterScroll = useRef(null);
  const visible = active === 'all' ? photos : photos.filter(photo => photo.house.id === active);
  const photo = visible[selected] || visible[0];
  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 769px)', () => {
      const feature = explorer.current.querySelector('.gallery-explorer__feature');
      const filters = document.querySelector('.gallery-page__filters');
      const topOffset = () => {
        if (!filters) return 100;
        return Math.ceil(parseFloat(getComputedStyle(filters).top || '0') + filters.offsetHeight);
      };
      const fitFeature = () => {
        explorer.current.style.setProperty('--feature-height', Math.max(1, window.innerHeight - topOffset()) + 'px');
      };
      fitFeature();
      ScrollTrigger.addEventListener('refreshInit', fitFeature);
      // Pin the gallery explorer and cycle through all visible images as user scrolls
      const itemScrollDistance = Math.max(260, feature.offsetHeight * 0.55);
      const sequence = ScrollTrigger.create({
        trigger: explorer.current,
        start: () => 'top ' + topOffset() + 'px',
        end: () => '+=' + (visible.length * itemScrollDistance),
        pin: explorer.current,
        pinSpacing: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (filterScroll.current !== null) return;
          const index = Math.min(visible.length - 1, Math.floor(self.progress * visible.length));
          setSelected(index);
          if (rail.current) {
            const button = rail.current.children[index];
            if (button) {
              const targetScroll = index * (button.offsetHeight + 12);
              rail.current.scrollTo({ top: targetScroll, behavior: 'smooth' });
            }
          }
        },
      });

      photoTriggers.current = visible.map((_, index) => ({
        get start() { return sequence.start + (sequence.end - sequence.start) * index / visible.length; },
      }));
      return () => {
        ScrollTrigger.removeEventListener('refreshInit', fitFeature);
        explorer.current?.style.removeProperty('--feature-height');
        photoTriggers.current = [];
      };
    });
    if (filterScroll.current !== null) {
      // Refresh the shorter layout before restoring the gallery anchor.
      ScrollTrigger.refresh();
      jumpTo(filterScroll.current);
      ScrollTrigger.update();
      setSelected(0);
      filterScroll.current = null;
    }
    return () => media.revert();
  }, { scope: explorer, dependencies: [active], revertOnUpdate: true });

  const filter = (value) => {
    if (value === active) return;
    const filters = document.querySelector('.gallery-page__filters');
    const offset = parseFloat(getComputedStyle(filters).top) + filters.offsetHeight;
    const galleryTop = window.scrollY + explorer.current.getBoundingClientRect().top - offset;
    filterScroll.current = Math.max(0, Math.min(window.scrollY, galleryTop));
    // Cancel smooth-scroll momentum before the long thumbnail list shrinks.
    jumpTo(filterScroll.current);
    setActive(value);
    setSelected(0);
    if (rail.current) rail.current.scrollTo(0, 0);
  };
  const choose = (index, scroll = false) => {
    setSelected(index);
    if (window.matchMedia('(min-width: 769px)').matches) {
      const trigger = photoTriggers.current[index];
      if (trigger) jumpTo(Math.max(0, trigger.start + 1));
      return;
    }
    if (scroll && rail.current) {
      const button = rail.current.children[index];
      const panel = rail.current;
      const horizontal = window.matchMedia('(max-width: 768px)').matches;
      const edge = horizontal ? 'left' : 'top';
      const delta = button.getBoundingClientRect()[edge] - panel.getBoundingClientRect()[edge] - 6;
      if (horizontal) panel.scrollLeft += delta;
      else panel.scrollTop += delta;
    }
  };
  const onScroll = () => {
    if (window.matchMedia('(min-width: 769px)').matches) return;
    const panel = rail.current;
    if (!panel) return;
    const edge = window.matchMedia('(max-width: 768px)').matches ? 'left' : 'top';
    const start = panel.getBoundingClientRect()[edge];
    let closest = 0;
    let distance = Infinity;
    [...panel.children].forEach((button, index) => {
      const delta = Math.abs(button.getBoundingClientRect()[edge] - start - 6);
      if (delta < distance) { distance = delta; closest = index; }
    });
    setSelected(closest);
  };
  return (
    <section className="gallery-page">
      <div className="wrap">
        <header className="gallery-page__heading">
          <div><p className="eyebrow">The estate, frame by frame</p><h1>Find your <em>favourite corner.</em></h1></div>
          <p>Explore Selva Tree Hotels & Resorts. Scroll down or select a thumbnail to discover each space.</p>
        </header>
        {farmhouses.length > 1 && (
          <div className="gallery-page__filters" role="group" aria-label="Filter by property">
            <button type="button" aria-pressed={active === 'all'} onClick={() => filter('all')}>All spaces <span>{photos.length}</span></button>
            {farmhouses.map(house => <button type="button" key={house.id} aria-pressed={active === house.id} onClick={() => filter(house.id)}>{house.name}<span>{house.images.length}</span></button>)}
          </div>
        )}
        <p className="gallery-page__count">{visible.length} photographs / {farmhouses[0]?.name || 'The Estate'}</p>
        {photo && <div className="gallery-explorer" ref={explorer}>
          <figure className="gallery-explorer__feature" id="gallery-feature">
            <div className="gallery-explorer__image"><img key={photo.src} src={photo.src} alt={photo.house.name + ' - view ' + (photo.index + 1)} fetchPriority="high" /></div>
            <figcaption>
              <div><span className="eyebrow">{photo.house.tag}</span><h2>{photo.house.name}</h2><p>{photo.house.blurb}</p></div>
              <div className="gallery-explorer__controls"><button type="button" disabled={selected === 0} onClick={() => choose(selected - 1, true)} aria-label="Previous photograph"><ArrowLeft size={18} /></button><span>{String(selected + 1).padStart(2, '0')} / {visible.length}</span><button type="button" disabled={selected === visible.length - 1} onClick={() => choose(selected + 1, true)} aria-label="Next photograph"><ArrowRight size={18} /></button></div>
            </figcaption>
          </figure>
          <aside className="gallery-explorer__sidebar" aria-label="Photograph selection">
            <div className="gallery-explorer__thumbnails" ref={rail} onScroll={onScroll} tabIndex={0} aria-label="Scrollable photo thumbnails">
              {visible.map((item, index) => <button type="button" key={item.src} className="gallery-thumbnail" aria-pressed={selected === index} aria-controls="gallery-feature" aria-label={item.house.name + ', view ' + (item.index + 1)} title={item.house.name + ' / ' + (item.index + 1)} onClick={() => choose(index)}>
                <img src={item.src} alt="" loading="lazy" /><span className="gallery-thumbnail__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
              </button>)}
            </div>
          </aside>
        </div>}
        <div className="gallery-page__end"><div><p className="eyebrow">Make the next memory yours</p><h2>Better when you are here.</h2></div><Btn to="/contact">Plan your visit</Btn></div>
      </div>
    </section>
  );
}
