import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import { Btn, formatTitle } from '../ui';

export default function NewsletterSection({ 
  eyebrow = 'STAY CONNECTED', 
  title = 'Join Our Newsletter', 
  text = 'Receive private invitations, seasonal retreat packages, and exclusive offers straight to your inbox.' 
}) {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <section className="sec newsletter-sec">
      <div className="wrap">
        <div className="newsletter-card" data-reveal>
          <div className="newsletter-card__glow" />
          <div className="newsletter-card__content">
            <span className="eyebrow eyebrow--light">{eyebrow}</span>
            <h2>{formatTitle(title)}</h2>
            <p>{text}</p>
            {subscribed ? (
              <div className="newsletter-success">
                <CheckCircle2 size={20} color="#60c07d" />
                <span>Thank you for subscribing! We look forward to welcoming you.</span>
              </div>
            ) : (
              <form className="newsletter-form" onSubmit={handleSubmit}>
                <div className="newsletter-input-group">
                  <Mail size={18} className="newsletter-icon" />
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter your email address..." 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                  <Btn type="submit" variant="inverted" className="newsletter-btn" icon={false}>
                    Subscribe
                  </Btn>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
