import { Phone, MessageSquare } from 'lucide-react';
import { brand } from '../data/site';
import './FloatingContact.css';

export default function FloatingContact({ onContact }) {
  return (
    <nav className="floating-contact" aria-label="Quick contact">
      <button type="button" className="floating-contact__link floating-contact__link--contact" onClick={onContact} aria-haspopup="dialog">
        <MessageSquare size={19} aria-hidden="true" /><span>Contact</span>
      </button>
      <a
        className="floating-contact__link floating-contact__link--call"
        href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`}
        aria-label={`Call ${brand.name}`}
        title={`Call ${brand.phone}`}
      >
        <Phone size={22} aria-hidden="true" />
      </a>
      <a
        className="floating-contact__link floating-contact__link--whatsapp"
        href={`https://wa.me/${brand.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat with ${brand.name} on WhatsApp (opens in a new tab)`}
        title="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
          <path d="M20.52 3.48A11.87 11.87 0 0 0 12.06 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.15 1.59 5.96L.06 24l6.29-1.65a11.9 11.9 0 0 0 5.7 1.45h.01c6.56 0 11.9-5.34 11.9-11.9 0-3.18-1.23-6.17-3.44-8.42ZM12.06 21.8a9.88 9.88 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.24-.38a9.86 9.86 0 0 1-1.52-5.27C2.17 6.44 6.6 2 12.07 2a9.83 9.83 0 0 1 7 2.9 9.84 9.84 0 0 1 2.89 7c0 5.46-4.44 9.9-9.9 9.9Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.78-1.48-1.75-1.65-2.05-.18-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.2-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.5 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.42.25-.69.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Z" />
        </svg>
      </a>
    </nav>
  );
}
