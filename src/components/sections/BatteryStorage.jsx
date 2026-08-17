import { useState } from 'react';
import useReveal from '../../hooks/useReveal';
import content from '../../data/content';
import './BatteryStorage.css';

export default function BatteryStorage() {
  const [headRef, headIn] = useReveal(0.2);
  const [mode, setMode] = useState('day');
  const isNight = mode === 'night';

  return (
    <section className="section battery">
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.battery.eyebrow}</p>
          <h2 className="section-heading">{content.battery.headline}</h2>
        </div>

        <div className={`battery__panel glass-card ${isNight ? 'is-night' : ''}`}>
          <div className="battery__toggle" role="group" aria-label="Time of day">
            <button
              className={`battery__toggle-btn ${!isNight ? 'is-active' : ''}`}
              onClick={() => setMode('day')}
            >
              ☀ Day
            </button>
            <button
              className={`battery__toggle-btn ${isNight ? 'is-active' : ''}`}
              onClick={() => setMode('night')}
            >
              ☾ Night
            </button>
          </div>

          <div className="battery__scene">
            <div className="battery__sky" aria-hidden="true" />

            <div className="battery__flow" aria-hidden="true">
              <div className="battery__node battery__node--source">{isNight ? 'Battery' : 'Panels'}</div>
              <div className="battery__line">
                <span className={`battery__dot ${isNight ? 'battery__dot--reverse' : ''}`} />
              </div>
              <div className="battery__node battery__node--target">{isNight ? 'Home' : 'Battery'}</div>
            </div>
          </div>

          <div className="battery__readout">
            <div>
              <p className="battery__readout-value">{isNight ? '5.8 kWh' : '8.2 kWh'}</p>
              <p className="battery__readout-label">Stored</p>
            </div>
            <div className="battery__readout-bar">
              <div className="battery__readout-bar-fill" style={{ width: isNight ? '43%' : '82%' }} />
            </div>
            <div>
              <p className="battery__readout-value">{isNight ? '~4 hrs' : '~6 hrs'}</p>
              <p className="battery__readout-label">Powers your home for</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
