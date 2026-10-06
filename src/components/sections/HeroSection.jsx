import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { Calendar, Users, Percent, Leaf } from 'lucide-react';
import { brand } from '../../data/site';
import { Btn, formatTitle } from '../ui';

const dateValue = (date) => [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
const nextDay = (value) => {
  const date = new Date(value + 'T12:00:00');
  date.setDate(date.getDate() + 1);
  return dateValue(date);
};

export default function HeroSection({ eyebrow, title, text, image }) {
  const ref = useRef(null);
  const [booking, setBooking] = useState({
    checkIn: dateValue(new Date()),
    checkOut: nextDay(dateValue(new Date())),
    guests: '1 Room, 2 Guests',
    promo: '',
  });

  const handleBookSubmit = (e) => {
    e.preventDefault();
    const msg = `Hello ${brand.name}, I would like to book a stay. Check-in: ${booking.checkIn}, Check-out: ${booking.checkOut}, ${booking.guests}. Promo Code: ${booking.promo || 'None'}`;
    window.open(`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  useGSAP(() => {
    const delay = document.documentElement.dataset.loading ? 1.8 : 0.2;
    gsap.from('[data-in]', { y: 60, opacity: 0, duration: 1.2, stagger: 0.15, delay, ease: 'power3.out' });
    gsap.from('.hero__img', { scale: 1.25, duration: 2.4, delay, ease: 'power2.out' });
  }, { scope: ref });

  return (
    <section className="hero" ref={ref}>
      <img className="hero__img" src={image} alt="" fetchPriority="high" />
      <div className="hero__shade" />
      <div className="wrap hero__body">
        <p className="eyebrow eyebrow--light" data-in>{eyebrow}</p>
        <h1 data-in>{formatTitle(title)}</h1>
        <p className="hero__text" data-in>{text}</p>

        {/* A quiet, elevated booking card over the hero image. */}
        <div className="hero-booking-bar-wrap" data-in>
          <div className="booking-heading">
            <div className="booking-heading__title"><Leaf size={18} aria-hidden="true" /><span>Your countryside escape</span></div>
            <span className="booking-heading__note">A little closer to nature.</span>
          </div>
          <form className="hero-booking-bar" onSubmit={handleBookSubmit} aria-label="Plan your stay">
            <div className="booking-field">
              <label htmlFor="hero-check-in">Arrival</label>
              <div className="booking-input-wrap">
                <Calendar size={16} className="booking-icon" aria-hidden="true" />
                <input 
                  type="date"
                  id="hero-check-in"
                  min={dateValue(new Date())}
                  value={booking.checkIn} 
                  onChange={(e) => {
                    const checkIn = e.target.value;
                    setBooking({ ...booking, checkIn, checkOut: checkIn && checkIn >= booking.checkOut ? nextDay(checkIn) : booking.checkOut });
                  }} 
                  required 
                />
              </div>
            </div>

            <div className="booking-field">
              <label htmlFor="hero-check-out">Departure</label>
              <div className="booking-input-wrap">
                <Calendar size={16} className="booking-icon" aria-hidden="true" />
                <input 
                  type="date" id="hero-check-out" min={nextDay(booking.checkIn || dateValue(new Date()))} value={booking.checkOut} 
                  onChange={(e) => setBooking({ ...booking, checkOut: e.target.value })} 
                  required 
                />
              </div>
            </div>

            <div className="booking-field">
              <label htmlFor="hero-guests">Rooms &amp; guests</label>
              <div className="booking-input-wrap">
                <Users size={16} className="booking-icon" aria-hidden="true" />
                <select id="hero-guests" 
                  value={booking.guests} 
                  onChange={(e) => setBooking({ ...booking, guests: e.target.value })}
                >
                  <option value="1 Room, 2 Guests">1 Room, 2 Guests</option>
                  <option value="2 Rooms, 4-6 Guests">2 Rooms, 4-6 Guests</option>
                  <option value="3 Rooms, 6-10 Guests">3 Rooms, 6-10 Guests</option>
                  <option value="4 Suites (Full Farm, 15-20 Guests)">4 Suites (Full Estate, 20 Guests)</option>
                </select>
              </div>
            </div>

            <div className="booking-field">
              <label htmlFor="hero-promo">Promo code <span>Optional</span></label>
              <div className="booking-input-wrap">
                <Percent size={15} className="booking-icon" aria-hidden="true" />
                <input 
                  type="text" id="hero-promo" 
                  placeholder="Enter code" 
                  value={booking.promo} 
                  onChange={(e) => setBooking({ ...booking, promo: e.target.value })} 
                />
              </div>
            </div>

            <div className="booking-action">
              <Btn type="submit" variant="solid" fullWidth>
                Plan my stay
              </Btn>
            </div>
          </form>
          <div className="booking-footer"><span>Make room for a slower kind of stay.</span><Link to="/contact" className="booking-manage-link">Manage your booking <span aria-hidden="true"></span></Link></div>
        </div>
      </div>
    </section>
  );
}
