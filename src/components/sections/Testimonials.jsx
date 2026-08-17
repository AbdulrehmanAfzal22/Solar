import { useRef, useState } from 'react';
import useReveal from '../../hooks/useReveal';
import content from '../../data/content';
import testimonialsData from '../../data/testimonials';
import './Testimonials.css';

export default function Testimonials() {
  const [headRef, headIn] = useReveal(0.2);
  const trackRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const cardWidth = el.scrollWidth / testimonialsData.length;
    const index = Math.round(el.scrollLeft / cardWidth);
    setActiveIndex(Math.min(testimonialsData.length - 1, Math.max(0, index)));
  }

  function goTo(i) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: (el.scrollWidth / testimonialsData.length) * i, behavior: 'smooth' });
  }

  return (
    <section className="section testimonials" id="reviews">
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.testimonials.eyebrow}</p>
          <h2 className="section-heading">{content.testimonials.headline}</h2>
        </div>
      </div>

      <div className="testimonials__track" ref={trackRef} onScroll={onScroll}>
        {testimonialsData.map((t, i) => (
          <div className="testimonials__card" key={t.name}>
            <p
              className={`testimonials__quote ${i === activeIndex ? 'is-active' : ''}`}
              data-text={`\u201C${t.quote}\u201D`}
            >
              “{t.quote}”
            </p>
            <div className="testimonials__meta">
              <span className="testimonials__avatar" aria-hidden="true" />
              <div>
                <p className="testimonials__name">{t.name}</p>
                <p className="testimonials__location">{t.location} · {t.type}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="testimonials__dots">
        {testimonialsData.map((_, i) => (
          <button
            key={i}
            className={`testimonials__dot ${i === activeIndex ? 'is-active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Testimonial ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
