import { MapPin, Navigation } from 'lucide-react';
import { brand } from '../../data/site';
import { Btn } from '../ui';
import '../../styles/map.css';

export default function MapSection() {
  const embedUrl = `https://maps.google.com/maps?q=${encodeURIComponent('Dr Bhagat Farm House, Sohna Rural, Gurugram, Haryana 122103')}&t=&z=14&ie=UTF8&iwloc=&output=embed`;

  return (
    <section className="map-section" id="location-map">
      <div className="wrap">
        <div className="map-section__header">
          <div>
            <p className="eyebrow">Location & Directions</p>
            <h2>Find Us on <em>the Map.</em></h2>
          </div>
          <div className="map-section__actions">
            <Btn href={brand.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation size={16} aria-hidden="true" /> Open in Google Maps
            </Btn>
          </div>
        </div>

        <div className="map-section__card">
          <div className="map-section__frame-container">
            <iframe
              title="Dr Bhagat Farm House Location"
              src={embedUrl}
              className="map-section__iframe"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          
          <div className="map-section__info">
            <div className="map-section__info-item">
              <MapPin size={22} className="map-section__icon" aria-hidden="true" />
              <div>
                <strong>Estate Address</strong>
                <p>{brand.address}</p>
              </div>
            </div>

            <div className="map-section__info-meta">
              <span><strong>Location:</strong> Sohna Rural, Gurugram, Haryana</span>
              <span><strong>Accessibility:</strong> Easy connectivity from Golf Course Ext. & Sohna Elevated Road</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
