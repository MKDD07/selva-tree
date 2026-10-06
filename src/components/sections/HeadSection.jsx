import { formatTitle } from '../ui';

export default function HeadSection({ eyebrow, title, text, image }) {
  return (
    <section className={`head ${image ? 'head--img' : ''}`}>
      {image && <><img src={image} alt="" fetchPriority="high" data-parallax /><div className="hero__shade" /></>}
      <div className="wrap head__body">
        <p className={`eyebrow ${image ? 'eyebrow--light' : ''}`} data-reveal>{eyebrow}</p>
        <h1 data-reveal>{formatTitle(title)}</h1>
        <p data-reveal>{text}</p>
      </div>
    </section>
  );
}
