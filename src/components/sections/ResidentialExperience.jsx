import { useState } from 'react';
import useReveal from '../../hooks/useReveal';
import useCountUp from '../../hooks/useCountUp';
import content from '../../data/content';
import residentialHome from '../../assets/residential-home.jpg';
import './ResidentialExperience.css';

const hotspots = [
  { key: 'panels', label: 'Panels', x: 58, y: 30, fact: 'Estimated output: 380W per panel.' },
  { key: 'inverter', label: 'Inverter', x: 78, y: 62, fact: 'Tucked near the garage — quiet, weatherproof.' },
  { key: 'meter', label: 'Smart Meter', x: 22, y: 70, fact: 'Tracks production and usage in real time.' },
];

export default function ResidentialExperience() {
  const [headRef, headIn] = useReveal(0.2);
  const [imgRef, imgIn] = useReveal(0.2);
  const [savingsRef, savings] = useCountUp(1180);

  return (
    <section className="section residential">
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.residential.eyebrow}</p>
          <h2 className="section-heading">{content.residential.headline}</h2>
          <p className="section-subhead">{content.residential.body}</p>
        </div>

        <div className="residential__reveal-wrap" ref={imgRef}>
          <div className={`residential__frame ${imgIn ? 'is-in' : ''}`}>
            <div className="residential__image" style={{ backgroundImage: `url(${residentialHome})` }}>
              {hotspots.map((h) => (
                <HotspotMarker hotspot={h} key={h.key} />
              ))}
            </div>

            <div className="residential__stat-card glass-card" ref={savingsRef}>
              <p className="residential__stat-label">Typical system, this area</p>
              <p className="residential__stat-value">${Math.round(savings).toLocaleString()}<span>/yr saved</span></p>
              <p className="residential__stat-sub">7.2kW system · 13.5kWh battery</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HotspotMarker({ hotspot }) {
  const [open, setOpen] = useState(false);
  return (
    <button
      className="residential__hotspot"
      style={{ left: `${hotspot.x}%`, top: `${hotspot.y}%` }}
      onClick={() => setOpen((v) => !v)}
      aria-label={hotspot.label}
    >
      <span className="residential__hotspot-dot" />
      {open && (
        <div className="residential__hotspot-card glass-card">
          <strong>{hotspot.label}</strong>
          <p>{hotspot.fact}</p>
        </div>
      )}
    </button>
  );
}
