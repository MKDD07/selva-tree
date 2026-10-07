import * as Icons from 'lucide-react';
import { Eyebrow, formatTitle } from '../ui';

export default function FeatureSplitSection({ 
  eyebrow, 
  title, 
  subtitle, 
  paragraphs = [], 
  points = [], 
  image, 
  tag, 
  flip, 
  theme = 'default' 
}) {
  return (
    <section className={`sec feature-split ${theme !== 'default' ? `feature-split--${theme}` : ''} ${flip ? 'feature-split--flip' : ''}`}>
      <div className="wrap feature-split__grid">
        <div className="feature-split__media" data-reveal>
          <img src={image} alt={title} loading="lazy" />
          {tag && <div className="feature-split__tag">{tag}</div>}
        </div>
        <div className="feature-split__copy" data-reveal>
          {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
          <h2>{formatTitle(title)}</h2>
          {subtitle && <p style={{ fontWeight: 500, color: 'var(--text)', fontSize: 'var(--fs-base)', marginBottom: '14px' }}>{subtitle}</p>}
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {points.length > 0 && (
            <div className="feature-split__highlights">
              {points.map((pt, i) => (
                <span key={i} className="feature-split__pill">
                  <Icons.CheckCircle2 size={15} />
                  {pt}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
