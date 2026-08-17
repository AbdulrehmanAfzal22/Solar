import { useState } from 'react';
import useReveal from '../../hooks/useReveal';
import content from '../../data/content';
import faqData from '../../data/faq';
import { DollarIcon, CloudIcon, PlugIcon, ShieldIcon, BatteryIcon, WalletIcon, WrenchIcon } from '../icons';
import OrbitMedallion from '../OrbitMedallion';
import SparkleField from '../SparkleField';
import './Faq.css';

import { useRef } from 'react';

// Paired with faqData by index — one icon per topic.
const faqIcons = [DollarIcon, CloudIcon, PlugIcon, ShieldIcon, BatteryIcon, WalletIcon, WrenchIcon];

function FaqRow({ item, Icon, isOpen, onToggle }) {
  const answerRef = useRef(null);

  return (
    <div className="faq-row">
      <button className="faq-row__question" onClick={onToggle} aria-expanded={isOpen}>
        <span className="faq-row__icon-badge"><Icon className="faq-row__icon" /></span>
        <span className="faq-row__question-text">{item.q}</span>
        <span className={`faq-row__chevron ${isOpen ? 'is-open' : ''}`} aria-hidden="true" />
      </button>
      <div
        className="faq-row__answer"
        style={{ maxHeight: isOpen ? `${answerRef.current?.scrollHeight ?? 400}px` : '0px' }}
      >
        <p ref={answerRef}>{item.a}</p>
      </div>
    </div>
  );
}

export default function Faq() {
  const [headRef, headIn] = useReveal(0.2);
  const [openIndex, setOpenIndex] = useState(0);

  const openItem = openIndex != null ? faqData[openIndex] : null;
  const activeIcon = openIndex != null ? faqIcons[openIndex % faqIcons.length] : ShieldIcon;

  return (
    <section className="section faq" id="faq">
      <SparkleField count={14} seed={7} className="faq__sparkles" />
      <div className="faq__decor">
        <div className="faq__decor-medallion">
          <OrbitMedallion Icon={activeIcon} />
        </div>
        <p className="faq__decor-label">{openItem ? openItem.q : 'Tap a question to learn more'}</p>

        <div className="faq__decor-card glass-card">
          <p className="faq__decor-card-title">Still have questions?</p>
          <p className="faq__decor-card-text">
            Talk to a real person about pricing, timelines, or anything else — no scripts, no pressure.
          </p>
          <a href="#quote" className="btn btn--primary">Get a free quote</a>
        </div>
      </div>
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.faq.eyebrow}</p>
          <h2 className="section-heading">{content.faq.headline}</h2>
        </div>

        <div className="faq__list">
          {faqData.map((item, i) => (
            <FaqRow
              item={item}
              Icon={faqIcons[i % faqIcons.length]}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              key={item.q}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
