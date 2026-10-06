import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/** Shared animated action with optional custom icon. */
export const Btn = ({ to, href, variant = 'solid', size = 'md', children,
  className = '', type = 'button', icon = true, iconPosition = 'end',
  disabled = false, loading = false, fullWidth = false, onClick, ...props }) => {
  const unavailable = disabled || loading;
  const btnClass = ['btn', `btn--${variant}`, `btn--${size}`,
    fullWidth && 'btn--full', loading && 'btn--loading', className].filter(Boolean).join(' ');
  const decoration = (loading || icon) && (
    <span className="btn__icon" aria-hidden="true">
      {loading ? <span className="btn__spinner" /> : icon === true ? <ArrowUpRight size={18} /> : icon}
    </span>
  );
  const content = <>{iconPosition === 'start' && decoration}<span className="btn__label">{children}</span>{iconPosition !== 'start' && decoration}</>;
  const shared = { ...props, className: btnClass, 'aria-busy': loading || undefined,
    onClick: (event) => {
      if (unavailable) { event.preventDefault(); return; }
      onClick?.(event);
    },
  };
  if (to || href) {
    const linkProps = { ...shared, 'aria-disabled': unavailable || undefined,
      tabIndex: unavailable ? -1 : props.tabIndex };
    if (unavailable) return <a {...linkProps} role="link">{content}</a>;
    if (href) return <a {...linkProps} href={href}>{content}</a>;
    return <Link {...linkProps} to={to}>{content}</Link>;
  }
  return <button {...shared} type={type} disabled={unavailable}>{content}</button>;
};

export const Eyebrow = ({ children, light }) => (
  <p className={`eyebrow ${light ? 'eyebrow--light' : ''}`} data-reveal>
    {children}
  </p>
);

/**
 * Formats headings with #cb958f italic accents
 */
export function formatTitle(title) {
  if (!title || typeof title !== 'string') return title;
  
  if (title.includes('<em>')) {
    const parts = title.split(/(<em>.*?<\/em>)/g);
    return parts.map((part, i) => {
      if (part.startsWith('<em>') && part.endsWith('</em>')) {
        return <em key={i} className="h-accent">{part.slice(4, -5)}</em>;
      }
      return part;
    });
  }

  const words = title.split(' ');
  if (words.length <= 1) return title;

  const accentTargets = ['quiet', 'quiet.', 'oasis', 'luxury', 'retreat', 'retreats', 'comfort', 'moments', 'celebrations', 'venues', 'venues,', 'events', 'inclusions', 'nature', 'vision', 'story'];
  let accentedIndex = words.findIndex((w) => accentTargets.includes(w.toLowerCase().replace(/[^a-z]/g, '')));
  
  if (accentedIndex === -1) {
    accentedIndex = words.length > 3 ? 1 : words.length - 1;
  }

  return words.map((w, i) => (
    <span key={i}>
      {i === accentedIndex ? <em className="h-accent">{w}</em> : w}
      {i < words.length - 1 ? ' ' : ''}
    </span>
  ));
}
