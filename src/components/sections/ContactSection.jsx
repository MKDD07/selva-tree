import { useId, useState } from 'react';
import { Phone, Mail, MapPin, ArrowUpRight, MessageCircle } from 'lucide-react';
import { brand } from '../../data/site';
import { Btn } from '../ui';
import '../../styles/contact.css';

export default function ContactSection({ compact = false }) {
  const id = useId();
  const [f, setF] = useState({ name: '', phone: '', date: '', guests: '', type: 'Stay', msg: '' });
  const set = (key) => (event) => setF({ ...f, [key]: event.target.value });
  const today = new Date();
  const minDate = [today.getFullYear(), String(today.getMonth() + 1).padStart(2, '0'), String(today.getDate()).padStart(2, '0')].join('-');
  const send = (event) => {
    event.preventDefault();
    const text = 'Hello ' + brand.name + ', I would like to enquire.\nName: ' + f.name + '\nPhone: ' + f.phone + '\nOccasion: ' + f.type + '\nDate: ' + (f.date || 'Flexible') + '\nGuests: ' + (f.guests || 'To be decided') + '\nNotes: ' + (f.msg || 'None');
    window.open('https://wa.me/' + brand.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener,noreferrer');
  };
  return (
    <section className={compact ? 'contact-page contact-page--compact' : 'contact-page'} id={compact ? undefined : 'contact-enquiry'}>
      <div className="wrap contact-page__grid">
        {!compact && <div className="contact-page__copy">
          <p className="eyebrow">Good plans begin with a hello</p>
          <h2>Tell us what you<br />have <em>in mind.</em></h2>
          <p>Share your dates and a little about your plans. We will help you explore the right stay or celebration at the farm.</p>
          <div className="contact-page__channels">
            <a href={'tel:' + brand.phone.replace(/[^+\d]/g, '')}><span className="contact-page__icon"><Phone size={20} aria-hidden="true" /></span><span><small>Give us a call</small><strong>{brand.phone}</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a>
            <a href={'mailto:' + brand.email}><span className="contact-page__icon"><Mail size={20} aria-hidden="true" /></span><span><small>Write to us</small><strong>{brand.email}</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a>
            <a href={'https://wa.me/' + brand.whatsapp} target="_blank" rel="noopener noreferrer"><span className="contact-page__icon"><MessageCircle size={20} aria-hidden="true" /></span><span><small>Prefer a quick chat?</small><strong>Connect on WhatsApp</strong></span><ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <div className="contact-location">
            <MapPin size={24} aria-hidden="true" />
            <p className="eyebrow">Find your way here</p>
            <h3>A countryside address.</h3>
            <p>{brand.address}</p>
            <Btn href={brand.mapsUrl} target="_blank" rel="noopener noreferrer" variant="bordered" size="sm">Get directions</Btn>
          </div>
        </div>}
        <form className="contact-enquiry" onSubmit={send} aria-labelledby={id + '-title'}>
          <div className="contact-enquiry__intro"><span className="eyebrow">Your visit, your way</span><h2 id={id + '-title'}>Let's make a plan.</h2><p>Fill in the details below to start your enquiry.</p></div>
          <div className="contact-enquiry__fields">
            <label htmlFor={id + '-name'}>Your name <span>*</span><input id={id + '-name'} name="name" autoComplete="name" required placeholder="Full name" value={f.name} onChange={set('name')} /></label>
            <label htmlFor={id + '-phone'}>Phone number <span>*</span><input id={id + '-phone'} name="phone" type="tel" autoComplete="tel" required placeholder="Your contact number" value={f.phone} onChange={set('phone')} /></label>
            <label htmlFor={id + '-date'}>Preferred date<input id={id + '-date'} name="date" type="date" min={minDate} value={f.date} onChange={set('date')} /></label>
            <label htmlFor={id + '-guests'}>Number of guests<input id={id + '-guests'} name="guests" type="number" min="1" step="1" placeholder="How many of you?" value={f.guests} onChange={set('guests')} /></label>
            <label className="contact-enquiry__full" htmlFor={id + '-type'}>What are you planning?<select id={id + '-type'} name="occasion" value={f.type} onChange={set('type')}>{['Stay', 'Wedding', 'Birthday / party', 'Corporate retreat'].map((option) => <option key={option}>{option}</option>)}</select></label>
            <label className="contact-enquiry__full" htmlFor={id + '-message'}>A little more about your plans<textarea id={id + '-message'} name="message" rows="4" placeholder="A special occasion, room preferences, or anything you would like us to know?" value={f.msg} onChange={set('msg')} /></label>
          </div>
          <div className="contact-enquiry__submit"><Btn type="submit" fullWidth>Send enquiry on WhatsApp</Btn><p>This opens WhatsApp with your details ready to send. Your booking is confirmed only after availability is agreed.</p></div>
        </form>
      </div>
    </section>
  );
}
