import { Eyebrow, formatTitle } from '../ui';

export default function MosaicSection({ eyebrow, title, items = [], theme = 'sand' }) {
  const [tall, horizontal, topCard, bottomCard] = items;

  return (
    <section className={`sec mosaic-sec mosaic-sec--${theme}`}>
      <div className="wrap">
        {(eyebrow || title) && (
          <div className="mosaic-header">
            {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
            {title && <h2 data-reveal>{formatTitle(title)}</h2>}
          </div>
        )}
        <div className="mosaic-grid">
          {tall && (
            <div className="mosaic-card mosaic-card--tall" data-reveal>
              <div className="mosaic-card__img">
                <img src={tall.image} alt={tall.title} loading="lazy" />
              </div>
              <div className="mosaic-card__content">
                <h3>{tall.title}</h3>
                <p>{tall.text}</p>
              </div>
            </div>
          )}

          <div className="mosaic-grid__col">
            {horizontal && (
              <div className="mosaic-card mosaic-card--horizontal" data-reveal>
                <div className="mosaic-card__img">
                  <img src={horizontal.image} alt={horizontal.title} loading="lazy" />
                </div>
                <div className="mosaic-card__content">
                  <h3>{horizontal.title}</h3>
                  <p>{horizontal.text}</p>
                </div>
              </div>
            )}

            <div className="mosaic-grid__subgrid">
              {topCard && (
                <div className="mosaic-card mosaic-card--top-content" data-reveal>
                  <div className="mosaic-card__content">
                    <h3>{topCard.title}</h3>
                    <p>{topCard.text}</p>
                  </div>
                  <div className="mosaic-card__img">
                    <img src={topCard.image} alt={topCard.title} loading="lazy" />
                  </div>
                </div>
              )}

              {bottomCard && (
                <div className="mosaic-card mosaic-card--bottom-content" data-reveal>
                  <div className="mosaic-card__img">
                    <img src={bottomCard.image} alt={bottomCard.title} loading="lazy" />
                  </div>
                  <div className="mosaic-card__content">
                    <h3>{bottomCard.title}</h3>
                    <p>{bottomCard.text}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
