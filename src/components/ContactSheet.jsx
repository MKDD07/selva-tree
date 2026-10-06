import { X, Phone, Mail, MessageCircle, ArrowUpRight } from 'lucide-react';
import { brand } from '../data/site';
import OverlayDialog from './OverlayDialog';
import ContactSection from './sections/ContactSection';
import './ContactSheet.css';

export default function ContactSheet({ open, onClose }) {
  return <OverlayDialog open={open} onClose={onClose} className="contact-sheet" labelledBy="contact-sheet-title">
    <div className="contact-sheet__header">
      <div><p>SELVA TREE HOTELS &amp; RESORTS</p><h2 id="contact-sheet-title">Let’s plan your visit.</h2></div>
      <button type="button" onClick={onClose} aria-label="Close contact card" autoFocus><X size={22} /></button>
    </div>
    <div className="contact-sheet__body">
      <p className="contact-sheet__intro">A stay, a celebration, a little time away. Tell us what you have in mind.</p>
      <div className="contact-sheet__channels">
        <a href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`}><Phone size={18} /><span>Call us<small>{brand.phone}</small></span><ArrowUpRight size={16} /></a>
        <a href={`mailto:${brand.email}`}><Mail size={18} /><span>Email us<small>{brand.email}</small></span><ArrowUpRight size={16} /></a>
        <a href={`https://wa.me/${brand.whatsapp}`} target="_blank" rel="noopener noreferrer"><MessageCircle size={18} /><span>Chat on WhatsApp<small>Discuss dates and availability</small></span><ArrowUpRight size={16} /></a>
      </div>
      {open && <ContactSection compact />}
    </div>
  </OverlayDialog>;
}
