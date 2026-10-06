import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { formatTitle } from '../ui';

export default function FaqSection({ title, subtitle, items = [] }) {
  const [open, setOpen] = useState(null);
  const id = useId();

  return (
    <section className="sec faq-section" aria-labelledby={id + '-title'}>
      <div className="wrap faq-section__layout">
        <div className="faq-section__heading">
          <p className="eyebrow">Common questions</p>
          <h2 id={id + '-title'}>{formatTitle(title || 'Frequently Asked Questions')}</h2>
          {subtitle && <p className="faq-section__subtitle">{subtitle}</p>}
        </div>
        <div className="faq-accordion">
          {items.map((item, index) => {
            const expanded = open === index;
            const questionId = id + '-question-' + index;
            const answerId = id + '-answer-' + index;
            return (
              <div key={questionId} className={'faq-accordion__item' + (expanded ? ' is-open' : '')}>
                <h3>
                  <button type="button" id={questionId} aria-expanded={expanded}
                    aria-controls={answerId} onClick={() => setOpen(expanded ? null : index)}>
                    <span>{item.q}</span>
                    <Plus size={20} aria-hidden="true" />
                  </button>
                </h3>
                <div id={answerId} className="faq-accordion__answer" role="region"
                  aria-labelledby={questionId} hidden={!expanded}>
                  <p>{item.a}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
