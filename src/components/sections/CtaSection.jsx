import { useId, useState } from 'react';
import { brand } from '../../data/site';
import { Btn, formatTitle } from '../ui';

export default function CtaSection({ title, text }) {
  const id = useId();
  const [f, setF] = useState({ name: '', phone: '', checkIn: '', checkOut: '', guests: '2-4 Guests (1-2 Suites)', type: 'Private Staycation', msg: '' });
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });

  const send = (e) => {
    e.preventDefault();
    const message = `Hello ${brand.name}, I would like to book a stay.\nName: ${f.name}\nPhone: ${f.phone}\nOccasion: ${f.type}\nCheck-in: ${f.checkIn || 'Flexible'}\nCheck-out: ${f.checkOut || 'Flexible'}\nGuests: ${f.guests}\nNotes: ${f.msg || 'None'}`;
    window.open(`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section className="sec sec--dark cta">
      <div className="wrap cta__container">
        <div className="cta__header" data-reveal>
          <span className="eyebrow eyebrow--light">RESERVATIONS & CELEBRATIONS</span>
          <h2>{formatTitle(title || 'Your dates, your people, your farm.')}</h2>
          <p>{text || 'Reserve your private countryside oasis or plan an exclusive event tailored just for you.'}</p>
          <div className="cta__contact">
            <span>Prefer a conversation?</span>
            <a href={`tel:${brand.phone.replace(/[^+\d]/g, '')}`}>{brand.phone}</a>
            <span>Private stays &middot; Celebrations &middot; Time together</span>
          </div>
        </div>

        <form className="cta__form" onSubmit={send} aria-labelledby={id + '-heading'} data-reveal>
          <div className="cta__form-intro">
            <span className="eyebrow">Make it yours</span>
            <h3 id={id + '-heading'}>Plan your escape</h3>
            <p>Share a few details. We will help with the rest.</p>
          </div>
          <div className="cta__form-grid">
            <div className="cta__form-field">
              <label htmlFor={id + '-name'}>Full Name *</label>
              <input id={id + '-name'} required placeholder="e.g. Rahul Sharma" value={f.name} onChange={set('name')} />
            </div>

            <div className="cta__form-field">
              <label htmlFor={id + '-phone'}>Phone Number *</label>
              <input id={id + '-phone'} required type="tel" placeholder="+91 98765 43210" value={f.phone} onChange={set('phone')} />
            </div>

            <div className="cta__form-field">
              <label htmlFor={id + '-checkIn'}>Check-in Date</label>
              <input id={id + '-checkIn'} type="date" value={f.checkIn} onChange={set('checkIn')} />
            </div>

            <div className="cta__form-field">
              <label htmlFor={id + '-checkOut'}>Check-out Date</label>
              <input id={id + '-checkOut'} type="date" value={f.checkOut} onChange={set('checkOut')} />
            </div>

            <div className="cta__form-field">
              <label htmlFor={id + '-guests'}>Guests & Rooms</label>
              <select id={id + '-guests'} value={f.guests} onChange={set('guests')}>
                <option value="1-2 Guests (1 Suite)">1-2 Guests (1 Suite)</option>
                <option value="2-4 Guests (1-2 Suites)">2-4 Guests (1-2 Suites)</option>
                <option value="5-10 Guests (2-3 Suites)">5-10 Guests (2-3 Suites)</option>
                <option value="10-20 Guests (Full Estate / 4 Suites)">10-20 Guests (Full Estate / 4 Suites)</option>
                <option value="20-50 Guests (Day Event / Party)">20-50 Guests (Day Event / Party)</option>
                <option value="50-200+ Guests (Wedding / Large Event)">50-200+ Guests (Wedding / Large Event)</option>
              </select>
            </div>

            <div className="cta__form-field">
              <label htmlFor={id + '-type'}>Event / Stay Type</label>
              <select id={id + '-type'} value={f.type} onChange={set('type')}>
                <option value="Private Staycation">Private Staycation</option>
                <option value="Destination Wedding">Destination Wedding</option>
                <option value="Birthday / Anniversary Pool Party">Birthday / Anniversary Pool Party</option>
                <option value="Corporate Offsite / Strategy Retreat">Corporate Offsite / Strategy Retreat</option>
                <option value="Family Reunion">Family Reunion</option>
                <option value="Pre-Wedding Shoot">Pre-Wedding Shoot</option>
              </select>
            </div>

            <div className="cta__form-field cta__form-field--full">
              <label htmlFor={id + '-msg'}>Special Requests or Additional Details</label>
              <textarea id={id + '-msg'} rows="3" placeholder="Tell us if you require bonfire, live barbecue, pool setups, or specific catering..." value={f.msg} onChange={set('msg')} />
            </div>
          </div>

          <div className="cta__submit-wrap">
            <p>Opens WhatsApp to discuss availability.</p>
            <Btn type="submit" variant="solid">
              Enquire on WhatsApp
            </Btn>
          </div>
        </form>
      </div>
    </section>
  );
}
