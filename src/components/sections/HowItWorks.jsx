import { useState } from 'react';
import useReveal from '../../hooks/useReveal';
import content from '../../data/content';
import { SunIcon, PanelIcon, InverterIcon, HouseIcon, BatteryIcon } from '../icons';
import AmbientGlow from '../ui/AmbientGlow';
import './HowItWorks.css';

const steps = [
  { key: 'sun', label: 'Sun', fact: 'Sunlight hits your roof as free, untaxed energy.', Icon: SunIcon },
  { key: 'panels', label: 'Panels', fact: 'Panels convert sunlight into DC electricity.', Icon: PanelIcon },
  { key: 'inverter', label: 'Inverter', fact: 'The inverter converts DC into the AC power your building uses.', Icon: InverterIcon },
  { key: 'building', label: 'Building', fact: 'Power reaches your building first, before anything else.', Icon: HouseIcon },
  { key: 'battery', label: 'Battery / Grid', fact: 'Extra power charges a battery, or exports back to the grid.', Icon: BatteryIcon },
];

export default function HowItWorks() {
  const [headRef, headIn] = useReveal(0.2);
  const [diagramRef, diagramIn] = useReveal(0.25);
  const [activeStep, setActiveStep] = useState(null);

  return (
    <section className="section how-it-works" id="how-it-works">
      <AmbientGlow count={6} color="var(--c-gold-soft)" className="how-it-works__ambient" seed={23} />
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.howItWorks.eyebrow}</p>
          <h2 className="section-heading">{content.howItWorks.headline}</h2>
          <p className="section-subhead">{content.howItWorks.body}</p>
        </div>

        <div className={`how-it-works__diagram ${diagramIn ? 'is-in' : ''}`} ref={diagramRef}>
          <div className="how-it-works__line" aria-hidden="true">
            <span className="how-it-works__travel-dot-trail" />
            <span className="how-it-works__travel-dot" />
          </div>

          {steps.map((step, i) => (
            <div
              key={step.key}
              className={`how-it-works__node ${activeStep !== null && activeStep !== i ? 'is-dimmed' : ''}`}
              style={{ '--node-delay': `${i * 140}ms` }}
              onMouseEnter={() => setActiveStep(i)}
              onMouseLeave={() => setActiveStep(null)}
              tabIndex={0}
            >
              <span className="how-it-works__node-dot">
                <step.Icon className="how-it-works__node-icon" />
              </span>
              <p className="how-it-works__node-label">{step.label}</p>

              {activeStep === i && (
                <div className="how-it-works__tooltip glass-card">{step.fact}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
