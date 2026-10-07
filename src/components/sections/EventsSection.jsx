import { useState } from 'react';
import { Btn } from '../ui';
import '../../styles/events.css';

import { img } from '../../data/images';
const occasions = [
  ['Weddings & traditions', 'dbf-wed', 'From a colourful mehendi to an evening reception. Bring the family together with room for every moment.', 'Haldi / Mehendi / Roka / Reception'],
  ['Private celebrations', 'dbf-party', 'A milestone birthday, an anniversary dinner or a reunion by the pool. Make the occasion your own.', 'Birthdays / Anniversaries / Reunions'],
  ['Corporate gatherings', 'dbf-corp', 'Step away from the everyday for team conversations, outdoor activities and shared meals.', 'Offsites / Workshops / Team days'],
];
const spaces = [
  ['The lawns', 'dbf-l1', 'Open skies. Room to celebrate.', 'Explore an outdoor setting for ceremonies, garden gatherings and evening receptions. Discuss seating, lighting and a weather backup plan with our team.'],
  ['Poolside', 'dbf-p1', 'A little sunshine, a lot of joy.', 'A relaxed backdrop for daytime celebrations and smaller gatherings. Confirm pool access, supervision and setup arrangements as part of your plan.'],
  ['Indoor spaces', 'dbf-c2', 'Bring everyone a little closer.', 'Ask about the banquet hall and indoor gathering options. Our team can help you explore layouts and capacity for your guest list.'],
];
export default function EventsSection() {
  const [selected, setSelected] = useState(0);
  const space = spaces[selected];
  return <div className="events-page">
    <section className="events-hero"><img src={img('dbf-events-head')} alt="Selva Tree Hotels & Resorts luxury farmhouse weddings and events in Sohna Gurugram" fetchPriority="high" /><div className="wrap events-hero__copy"><p className="eyebrow">Gather somewhere extraordinary</p><h1>For the moments<br />that become <em>memories.</em></h1><p>Farmhouse weddings, private pool parties, celebrations and team escapes. Make space for your favourite people in Sohna, Gurugram.</p><div className="events-hero__actions"><Btn href="#event-enquiry" variant="inverted">Plan your event</Btn><a href="#event-spaces">Explore the spaces &nearr;</a></div><small>SOHNA / GURUGRAM</small></div></section>
    <div className="events-strip"><div className="wrap"><span>Open-air lawns</span><span>Poolside gatherings</span><span>Indoor event options</span><span>On-site suites</span></div></div>
    <section className="events-occasions wrap"><div className="events-heading"><div><p className="eyebrow">Your occasion, your way</p><h2>Every gathering has<br />its own <em>story.</em></h2></div><p>Start with the occasion. Explore a setting and arrangements that suit the way you want to celebrate.</p></div><div className="events-occasions__grid">{occasions.map(([title, seed, text, details], i) => <article key={title}><div className="events-occasions__image"><img src={img(seed)} alt={title} loading="lazy" /><span>0{i + 1}</span></div><h3>{title}</h3><p>{text}</p><small>{details}</small></article>)}</div></section>
    <section className="events-spaces" id="event-spaces"><div className="wrap"><div className="events-heading"><div><p className="eyebrow">Find your setting</p><h2>One estate.<br /><em>Different possibilities.</em></h2></div><p>Match your guest list to the right space. Final layouts, capacity and availability are confirmed with the team.</p></div><div className="events-spaces__options" role="group" aria-label="Explore event spaces">{spaces.map(([name], i) => <button type="button" key={name} aria-pressed={selected === i} aria-controls="event-space-details" onClick={() => setSelected(i)}>{name}</button>)}</div><div className="events-spaces__feature" id="event-space-details"><img src={img(space[1])} alt={space[0]} loading="lazy" /><div><p className="eyebrow">{space[0]}</p><h3>{space[2]}</h3><p>{space[3]}</p><Btn href="#event-enquiry" variant="bordered">Discuss this space</Btn></div></div></div></section>
    <section className="events-planning wrap"><div><p className="eyebrow">The details make the day</p><h2>Let's think of<br /><em>everything.</em></h2><p>Share what matters to your group. Discuss what can be arranged and what needs to be booked separately.</p><Btn to="/gallery" variant="bordered">Take a look around</Btn></div><div className="events-planning__list">{[
      ['Food & refreshments', 'Discuss menus, meal timings, dietary preferences and catering arrangements.'],
      ['Decor & entertainment', 'Share your theme and music ideas. Confirm vendor access, setup requirements and event timings.'],
      ['Staying overnight', 'Ask about available suites, guest allocation and check-in and check-out times.'],
      ['Guest comfort & logistics', 'Plan parking, directions, accessibility needs and an alternative for changing weather.'],
    ].map(([title, text]) => <div key={title}><h3>{title}</h3><p>{text}</p></div>)}</div></section>
    <section className="events-steps"><div className="wrap"><p className="eyebrow">From first hello to the big day</p><h2>A simple way to <em>start.</em></h2><div>{[
      ['Share your plans', 'Tell us your occasion, preferred dates and approximate guest count.'],
      ['Explore the details', 'Discuss spaces, arrangements and a site visit with the team.'],
      ['Confirm your celebration', 'Review availability, your quote and booking terms before confirming.'],
    ].map(([title, text], i) => <article key={title}><span>0{i + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div></div></section><div id="event-enquiry" className="events-enquiry-anchor" />
  </div>;
}
