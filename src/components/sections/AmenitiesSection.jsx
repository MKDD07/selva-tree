import { formatTitle } from '../ui';
import amenityIcons from '../../assets/amenities';

function getAmenityImage(iconKey, label = '') {
  if (iconKey && amenityIcons[iconKey.toLowerCase()]) {
    return amenityIcons[iconKey.toLowerCase()];
  }
  const slug = label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  if (amenityIcons[slug]) {
    return amenityIcons[slug];
  }
  for (const key of Object.keys(amenityIcons)) {
    if (slug.includes(key) || key.includes(slug)) {
      return amenityIcons[key];
    }
  }
  return amenityIcons.events || null;
}

export default function AmenitiesSection({ title = 'Amenities', items = [], theme = 'sand' }) {
  return (
    <section className={`sec amenities-sec amenities-sec--${theme}`}>
      <div className="wrap">
        <h2 data-reveal>{formatTitle(title)}</h2>
        <div className="amenities-grid">
          {items.map((item, i) => {
            const imgSrc = getAmenityImage(item.iconKey || item.icon, item.label);
            return (
              <div key={i} className="amenity-item" data-reveal>
                <div className="amenity-item__icon">
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={item.label}
                      className="amenity-item__img"
                      loading="lazy"
                    />
                  ) : null}
                </div>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

