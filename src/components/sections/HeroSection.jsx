import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { useForm, ValidationError } from '@formspree/react';
import {
  Calendar,
  Users,
  Percent,
  Leaf,
  User,
  Phone,
  Mail,
  MessageSquare,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowUpRight,
  Send
} from 'lucide-react';
import { brand } from '../../data/site';
import { Btn, formatTitle } from '../ui';

const dateValue = (date) =>
  [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');

const nextDay = (value) => {
  const date = new Date(value + 'T12:00:00');
  date.setDate(date.getDate() + 1);
  return dateValue(date);
};

const formatDisplayDate = (val) => {
  if (!val) return '';
  const d = new Date(val + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Custom interactive calendar with real-time D1 red/green availability dots
function DatePickerPopover({ value, onChange, minDate, calendarData, onClose }) {
  const initialDate = value ? new Date(value + 'T12:00:00') : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const prevMonth = (e) => {
    e.preventDefault();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const nextMonth = (e) => {
    e.preventDefault();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  // Build grid for viewYear & viewMonth
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    days.push(d);
  }

  const minStr = minDate || dateValue(new Date());

  return (
    <div className="booking-calendar-popover" ref={popoverRef} role="dialog" aria-label="Select date">
      <div className="cal-header">
        <button type="button" className="cal-nav-btn" onClick={prevMonth} aria-label="Previous month">
          <ChevronLeft size={16} />
        </button>
        <span className="cal-month-title">
          {monthNames[viewMonth]} {viewYear}
        </span>
        <button type="button" className="cal-nav-btn" onClick={nextMonth} aria-label="Next month">
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="cal-weekdays">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(w => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="cal-grid">
        {days.map((dayNum, idx) => {
          if (!dayNum) {
            return <div key={`empty-${idx}`} className="cal-day-cell--empty" />;
          }

          const curStr = [
            viewYear,
            String(viewMonth + 1).padStart(2, '0'),
            String(dayNum).padStart(2, '0')
          ].join('-');

          const isPast = curStr < minStr;
          const isSelected = curStr === value;
          const dayInfo = calendarData?.[curStr];
          const isAvailable = dayInfo ? dayInfo.available : true; // default true if unknown

          return (
            <button
              key={curStr}
              type="button"
              disabled={isPast}
              className={`cal-day-cell ${isSelected ? 'cal-day--selected' : ''}`}
              title={
                dayInfo
                  ? `${dayInfo.available_rooms} of ${dayInfo.total} rooms available`
                  : isPast ? 'Past date' : 'Available'
              }
              onClick={() => {
                onChange(curStr);
                onClose();
              }}
            >
              <span>{dayNum}</span>
              {!isPast && (
                <span
                  className={`cal-day-dot ${isAvailable ? 'cal-day-dot--available' : 'cal-day-dot--booked'}`}
                />
              )}
            </button>
          );
        })}
      </div>

      <div className="cal-legend">
        <div className="cal-legend-item">
          <span className="cal-day-dot cal-day-dot--available" />
          <span>Available</span>
        </div>
        <div className="cal-legend-item">
          <span className="cal-day-dot cal-day-dot--booked" />
          <span>Sold Out</span>
        </div>
      </div>
    </div>
  );
}

// Custom Guests selection popover matching the DatePicker design
function GuestsPopover({ value, onChange, onClose }) {
  const popoverRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const options = [
    { label: 'Deluxe Room (4 Available)', desc: 'Spacious Deluxe room with garden views & king bed (Up to 4 rooms)' },
    { label: 'Premium Room (2 Available)', desc: 'Luxury Premium suite with refined interiors & plush comfort (Up to 2 rooms)' },
    { label: 'Arawali Room (1 Available)', desc: 'Exclusive scenic suite with panoramic Arawali hill views' },
    { label: 'Entire Estate (All 7 Rooms, Up to 25 Guests)', desc: 'Complete private buyout: 4 Deluxe + 2 Premium + 1 Arawali' },
  ];

  return (
    <div className="booking-guests-popover" ref={popoverRef} role="dialog" aria-label="Select rooms and guests">
      {options.map((opt) => {
        const isSelected = opt.label === value;
        return (
          <button
            key={opt.label}
            type="button"
            className={`booking-guest-option ${isSelected ? 'booking-guest-option--active' : ''}`}
            onClick={() => {
              onChange(opt.label);
              onClose();
            }}
          >
            <div>
              <span className="booking-guest-option__title">{opt.label}</span>
              <span className="booking-guest-option__desc">{opt.desc}</span>
            </div>
            {isSelected && <CheckCircle2 size={16} />}
          </button>
        );
      })}
    </div>
  );
}

export default function HeroSection({ eyebrow, title, text, image }) {
  const ref = useRef(null);
  const detailsRef = useRef(null);

  const [booking, setBooking] = useState({
    checkIn: dateValue(new Date()),
    checkOut: nextDay(dateValue(new Date())),
    guests: 'Deluxe Room (4 Available)',
    promo: '',
  });

  const [guest, setGuest] = useState({ name: '', phone: '', email: '', notes: '' });
  const [activePicker, setActivePicker] = useState(null); // 'checkIn' | 'checkOut' | 'guests' | null
  const [calendarData, setCalendarData] = useState({});
  const [availability, setAvailability] = useState({ loading: false, data: null });
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [savedToD1, setSavedToD1] = useState(false);

  // Formspree Integration with form ID "xrpeebzr"
  const [formState, handleFormspreeSubmit] = useForm('xrpeebzr');

  // Load calendar availability data for 90 days
  useEffect(() => {
    let active = true;
    const start = dateValue(new Date());
    const end = new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10);
    fetch(`/api/availability/calendar?start=${start}&end=${end}`)
      .then(r => r.ok ? r.json() : null)
      .then(res => {
        if (active && res?.calendar) {
          setCalendarData(res.calendar);
        }
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  // Fetch stay range availability on date change
  useEffect(() => {
    if (!booking.checkIn || !booking.checkOut) return;
    let active = true;
    setAvailability(prev => ({ ...prev, loading: true }));
    fetch(`/api/availability?check_in=${booking.checkIn}&check_out=${booking.checkOut}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (active) setAvailability({ loading: false, data }); })
      .catch(() => { if (active) setAvailability({ loading: false, data: null }); });
    return () => { active = false; };
  }, [booking.checkIn, booking.checkOut]);

  // Expand panel animation & fade out 'Plan my stay' action button (not hide, soft fade)
  useEffect(() => {
    const el = detailsRef.current;
    const actionBtn = document.querySelector('.booking-action');
    if (!el) return;
    if (detailsOpen) {
      el.style.display = 'block';
      gsap.fromTo(el, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.32, ease: 'power2.out' });
      if (actionBtn) {
        gsap.to(actionBtn, { opacity: 0.3, duration: 0.3, ease: 'power2.out' });
      }
    } else {
      gsap.to(el, { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in', onComplete: () => { el.style.display = 'none'; } });
      if (actionBtn) {
        gsap.to(actionBtn, { opacity: 1, duration: 0.3, ease: 'power2.out' });
      }
    }
  }, [detailsOpen]);

  const handlePlanStay = (e) => {
    e.preventDefault();
    setActivePicker(null);
    setDetailsOpen(prev => !prev);
    setTimeout(() => detailsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 50);
  };

  // On successful Formspree submission: save to D1 & trigger WhatsApp
  useEffect(() => {
    if (formState.succeeded && !savedToD1) {
      setSavedToD1(true);
      const nights = Math.max(1, Math.round((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000));
      const availNote = availability.data?.available
        ? `${availability.data.available_rooms_count} of ${availability.data.total_rooms} suites available`
        : 'availability unconfirmed';

      // 1. Save to D1 inquiries
      fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: guest.name,
          phone: guest.phone,
          email: guest.email,
          check_in: booking.checkIn,
          check_out: booking.checkOut,
          guests: booking.guests,
          promo: booking.promo,
          notes: guest.notes,
          nights,
        }),
      }).catch(() => {});

      // 2. Open WhatsApp pre-filled message
      const msg = [
        `Hello ${brand.name}, I have submitted a stay enquiry.`,
        `Name: ${guest.name}`,
        `Phone: ${guest.phone}`,
        guest.email ? `Email: ${guest.email}` : null,
        `Check-in: ${booking.checkIn}`,
        `Check-out: ${booking.checkOut} (${nights} night${nights !== 1 ? 's' : ''})`,
        `Rooms/Guests: ${booking.guests}`,
        booking.promo ? `Promo: ${booking.promo}` : null,
        guest.notes ? `Notes: ${guest.notes}` : null,
        `Availability: ${availNote}`,
      ].filter(Boolean).join('\n');

      window.open(`https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
    }
  }, [formState.succeeded, savedToD1, booking, guest, availability.data]);

  useGSAP(() => {
    const delay = document.documentElement.dataset.loading ? 1.8 : 0.2;
    gsap.from('[data-in]', { y: 60, opacity: 0, duration: 1.2, stagger: 0.15, delay, ease: 'power3.out' });
  }, { scope: ref });

  return (
    <section className="hero" ref={ref}>
      <img className="hero__img" src={image} alt="" fetchPriority="high" />
      <div className="hero__shade" />
      <div className="wrap hero__body">
        <p className="eyebrow eyebrow--light" data-in>{eyebrow}</p>
        <h1 data-in>{formatTitle(title)}</h1>
        <p className="hero__text" data-in>{text}</p>

        <div className="hero-booking-bar-wrap" data-in>
          {/* Always-visible booking bar header with D1 status */}
          <div className="booking-heading">
            <div className="booking-heading__title">
              <Leaf size={18} aria-hidden="true" />
              <span>Plan to stay</span>
            </div>
            {availability.loading ? (
              <span className="booking-heading__note" style={{ opacity: 0.6 }}>Checking live availability…</span>
            ) : availability.data?.available ? (
              <span className="booking-heading__note" style={{ color: '#15803d', fontWeight: 600 }}>
                ● {availability.data.available_rooms_count} of {availability.data.total_rooms} Suites Available
              </span>
            ) : availability.data && !availability.data.available ? (
              <span className="booking-heading__note" style={{ color: '#dc2626', fontWeight: 600 }}>
                ● Sold out for selected dates
              </span>
            ) : (
              <span className="booking-heading__note">Live availability synced with D1</span>
            )}
          </div>

          {/* Date & room selection row */}
          <form className="hero-booking-bar" onSubmit={handlePlanStay} aria-label="Pick your stay dates">
            {/* Arrival Date Field with Red/Green Datepicker */}
            <div className="booking-field booking-field--date">
              <label htmlFor="hero-check-in-btn">Arrival</label>
              <div className="booking-input-wrap">
                <Calendar size={16} className="booking-icon" aria-hidden="true" />
                <button
                  type="button"
                  id="hero-check-in-btn"
                  className="booking-date-btn"
                  onClick={() => setActivePicker(activePicker === 'checkIn' ? null : 'checkIn')}
                >
                  <span>{formatDisplayDate(booking.checkIn)}</span>
                  <ChevronDown size={14} style={{ color: '#9a7859', opacity: 0.7 }} />
                </button>
              </div>

              {activePicker === 'checkIn' && (
                <DatePickerPopover
                  value={booking.checkIn}
                  minDate={dateValue(new Date())}
                  calendarData={calendarData}
                  onClose={() => setActivePicker(null)}
                  onChange={(date) => {
                    const newOut = date >= booking.checkOut ? nextDay(date) : booking.checkOut;
                    setBooking(b => ({ ...b, checkIn: date, checkOut: newOut }));
                  }}
                />
              )}
            </div>

            {/* Departure Date Field with Red/Green Datepicker */}
            <div className="booking-field booking-field--date">
              <label htmlFor="hero-check-out-btn">Departure</label>
              <div className="booking-input-wrap">
                <Calendar size={16} className="booking-icon" aria-hidden="true" />
                <button
                  type="button"
                  id="hero-check-out-btn"
                  className="booking-date-btn"
                  onClick={() => setActivePicker(activePicker === 'checkOut' ? null : 'checkOut')}
                >
                  <span>{formatDisplayDate(booking.checkOut)}</span>
                  <ChevronDown size={14} style={{ color: '#9a7859', opacity: 0.7 }} />
                </button>
              </div>

              {activePicker === 'checkOut' && (
                <DatePickerPopover
                  value={booking.checkOut}
                  minDate={nextDay(booking.checkIn)}
                  calendarData={calendarData}
                  onClose={() => setActivePicker(null)}
                  onChange={(date) => {
                    setBooking(b => ({ ...b, checkOut: date }));
                  }}
                />
              )}
            </div>

            {/* Guests Selection matching dates design */}
            <div className="booking-field booking-field--date">
              <label htmlFor="hero-guests-btn">Rooms &amp; guests</label>
              <div className="booking-input-wrap">
                <Users size={16} className="booking-icon" aria-hidden="true" />
                <button
                  type="button"
                  id="hero-guests-btn"
                  className="booking-date-btn"
                  onClick={() => setActivePicker(activePicker === 'guests' ? null : 'guests')}
                >
                  <span>{booking.guests}</span>
                  <ChevronDown size={14} style={{ color: '#9a7859', opacity: 0.7 }} />
                </button>
              </div>

              {activePicker === 'guests' && (
                <GuestsPopover
                  value={booking.guests}
                  onClose={() => setActivePicker(null)}
                  onChange={(val) => {
                    setBooking(b => ({ ...b, guests: val }));
                  }}
                />
              )}
            </div>

            {/* Promo Code */}
            <div className="booking-field">
              <label htmlFor="hero-promo">Promo code <span>Optional</span></label>
              <div className="booking-input-wrap">
                <Percent size={15} className="booking-icon" aria-hidden="true" />
                <input
                  type="text"
                  id="hero-promo"
                  placeholder="Enter code"
                  value={booking.promo}
                  onChange={(e) => setBooking({ ...booking, promo: e.target.value })}
                />
              </div>
            </div>

            <div className="booking-action">
              <Btn type="submit" variant="solid" icon={false} fullWidth>
                Plan my stay <ArrowUpRight size={16} style={{ marginLeft: 6 }} />
              </Btn>
            </div>
          </form>

          {/* Expandable guest details panel connected with Formspree */}
          <div ref={detailsRef} className="booking-details-panel" style={{ display: 'none' }}>
            {formState.succeeded ? (
              <div className="booking-details-success">
                <CheckCircle2 size={30} style={{ color: '#22c55e' }} aria-hidden="true" />
                <div>
                  <strong>Enquiry Received!</strong>
                  <p>Your reservation request has been emailed to our reservations team and WhatsApp has been initiated.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleFormspreeSubmit} aria-label="Guest details" className="booking-details-form">
                {/* Clean, readable Formspree Email metadata for hotel inbox */}
                <input type="hidden" name="_subject" value={`🏨 Stay Enquiry: ${guest.name || 'New Guest'} (${booking.checkIn} to ${booking.checkOut})`} />
                <input type="hidden" name="Property" value="Selva Tree Hotels & Resorts (Gurugram)" />
                <input type="hidden" name="Check-In Date" value={booking.checkIn} />
                <input type="hidden" name="Check-Out Date" value={booking.checkOut} />
                <input type="hidden" name="Length of Stay" value={`${Math.max(1, Math.round((new Date(booking.checkOut) - new Date(booking.checkIn)) / 86400000))} Night(s)`} />
                <input type="hidden" name="Rooms & Guests" value={booking.guests} />
                {booking.promo && <input type="hidden" name="Promo Code" value={booking.promo} />}
                <input type="hidden" name="Current Availability" value={availability.data?.available ? `${availability.data.available_rooms_count} of ${availability.data.total_rooms} Suites Available` : 'Unconfirmed'} />

                <p className="booking-details-label">
                  <ChevronDown size={14} aria-hidden="true" /> Guest Details &amp; Enquiry
                </p>

                <div className="booking-details-grid">
                  <div className="booking-field booking-field--flat">
                    <label htmlFor="bd-name">Your Name <span>*</span></label>
                    <div className="booking-input-wrap">
                      <User size={15} className="booking-icon" aria-hidden="true" />
                      <input
                        id="bd-name"
                        type="text"
                        name="Full Name"
                        placeholder="Full name"
                        required
                        value={guest.name}
                        onChange={e => setGuest({ ...guest, name: e.target.value })}
                      />
                    </div>
                    <ValidationError prefix="Name" field="Full Name" errors={formState.errors} />
                  </div>

                  <div className="booking-field booking-field--flat">
                    <label htmlFor="bd-phone">Phone Number <span>*</span></label>
                    <div className="booking-input-wrap">
                      <Phone size={15} className="booking-icon" aria-hidden="true" />
                      <input
                        id="bd-phone"
                        type="tel"
                        name="Phone Number"
                        placeholder="+91 XXXXX XXXXX"
                        required
                        value={guest.phone}
                        onChange={e => setGuest({ ...guest, phone: e.target.value })}
                      />
                    </div>
                    <ValidationError prefix="Phone" field="Phone Number" errors={formState.errors} />
                  </div>

                  <div className="booking-field booking-field--flat">
                    <label htmlFor="bd-email">Email Address <span>*</span></label>
                    <div className="booking-input-wrap">
                      <Mail size={15} className="booking-icon" aria-hidden="true" />
                      <input
                        id="bd-email"
                        type="email"
                        name="Email Address"
                        placeholder="you@email.com"
                        required
                        value={guest.email}
                        onChange={e => setGuest({ ...guest, email: e.target.value })}
                      />
                    </div>
                    <ValidationError prefix="Email" field="Email Address" errors={formState.errors} />
                  </div>

                  <div className="booking-field booking-field--flat">
                    <label htmlFor="bd-notes">Enquiry / Special Requests <span>Optional</span></label>
                    <div className="booking-input-wrap">
                      <MessageSquare size={15} className="booking-icon" aria-hidden="true" />
                      <input
                        id="bd-notes"
                        type="text"
                        name="Special Requests"
                        placeholder="Room preference, event, dietary needs, etc."
                        value={guest.notes}
                        onChange={e => setGuest({ ...guest, notes: e.target.value })}
                      />
                    </div>
                    <ValidationError prefix="Message" field="Special Requests" errors={formState.errors} />
                  </div>
                </div>

                <div className="booking-details-submit">
                  <Btn type="submit" variant="solid" icon={<Send size={15} />} disabled={formState.submitting}>
                    {formState.submitting ? 'Sending…' : 'Send Enquiry'}
                  </Btn>
                  <span className="booking-details-email-note">
                    <Mail size={12} aria-hidden="true" /> Your enquiry will be emailed directly to our reservations team and backed up to WhatsApp.
                  </span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
