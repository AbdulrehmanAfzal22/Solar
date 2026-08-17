import { useEffect, useState } from 'react';
import useReveal from '../../hooks/useReveal';
import content from '../../data/content';
import AmbientGlow from '../ui/AmbientGlow';
import './InteractiveSystem.css';

// Positions are percentages of .interactive-system__scene, recalculated to
// match the illustration's new scale — see the `<g transform>` wrapping the
// SVG's shapes below. Both use the same (55, 52) center / 1.25 factor, so
// the hotspots stay pinned to the same physical points on the house.
const nodes = [
  { key: 'panels', label: 'Panels', fact: '18 panels, 400W each — 7.2kW total capacity.', x: 63.75, y: 22 },
  { key: 'inverter', label: 'Inverter', fact: 'Converts DC from the panels into usable AC power.', x: 83.75, y: 55.75 },
  { key: 'battery', label: 'Battery', fact: '13.5kWh of storage — enough for a typical evening.', x: 36.25, y: 69.5 },
  { key: 'house', label: 'Home', fact: 'Power reaches your outlets before anything else does.', x: 23.75, y: 84.5 },
];

export default function InteractiveSystem() {
  const [headRef, headIn] = useReveal(0.2);
  const [sceneRef, sceneIn] = useReveal(0.25);
  const [activeNode, setActiveNode] = useState(null);
  const [readout, setReadout] = useState({ kw: 4.2, battery: 68 });

  // Idle fluctuation — small live-feeling jitter, not a static number.
  useEffect(() => {
    if (!sceneIn) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const interval = setInterval(() => {
      setReadout((r) => ({
        kw: Math.max(3.6, Math.min(4.8, r.kw + (Math.random() - 0.5) * 0.3)),
        battery: Math.max(60, Math.min(76, r.battery + (Math.random() - 0.5) * 2)),
      }));
    }, 1800);

    return () => clearInterval(interval);
  }, [sceneIn]);

  return (
    <section className="section interactive-system">
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.interactiveSystem.eyebrow}</p>
          <h2 className="section-heading">{content.interactiveSystem.headline}</h2>
        </div>

        <div className={`interactive-system__layout ${sceneIn ? 'is-in' : ''}`} ref={sceneRef}>
          <div className="interactive-system__scene">
            <AmbientGlow count={10} color="var(--c-gold)" className="interactive-system__ambient" seed={41} />

            <svg viewBox="0 0 100 100" className="interactive-system__svg" aria-hidden="true">
              <defs>
                <radialGradient id="panelGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#FFD37A" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="#FFD37A" stopOpacity="0" />
                </radialGradient>
              </defs>

              {/* Everything below is drawn in the original 0–100 coordinate
                  space and scaled up together here, so the house fills more
                  of the box without hand-recalculating every shape. */}
              <g transform="translate(55 52) scale(1.25) translate(-55 -52)">
                {/* roof + panels */}
                <polygon points="20,50 55,20 90,50" fill="#1E2A3D" />
                <ellipse
                  cx="52" cy="33" rx="22" ry="13"
                  fill="url(#panelGlow)"
                  transform="rotate(-16 52 33)"
                  className="interactive-system__panel-glow"
                />
                <rect x="35" y="26" width="34" height="14" rx="1" fill="#12324A" transform="rotate(-16 52 33)" />
                {/* house body */}
                <rect x="22" y="50" width="56" height="34" fill="#3C4A5E" />
                <rect x="44" y="68" width="12" height="16" fill="#16202E" />
                {/* battery + inverter boxes */}
                <rect x="70" y="58" width="10" height="14" rx="2" fill="#151E30" stroke="#3E6E8E" />
                <rect x="30" y="62" width="10" height="8" rx="2" fill="#151E30" stroke="#3E6E8E" />

                {/* flow lines */}
                <path id="path-panel-inverter" d="M62,32 Q75,40 76,58" fill="none" stroke="#3E6E8E" strokeWidth="0.6" />
                <path id="path-inverter-battery" d="M74,66 Q55,72 40,66" fill="none" stroke="#3E6E8E" strokeWidth="0.6" />
                <path id="path-inverter-house" d="M72,64 Q60,66 56,68" fill="none" stroke="#3E6E8E" strokeWidth="0.6" />

                {sceneIn && (
                  <>
                    <circle r="1.1" fill="#FFD37A">
                      <animateMotion dur="2.4s" repeatCount="indefinite" path="M62,32 Q75,40 76,58" />
                    </circle>
                    <circle r="1.1" fill="#FFD37A">
                      <animateMotion dur="2.6s" repeatCount="indefinite" begin="0.4s" path="M74,66 Q55,72 40,66" />
                    </circle>
                    <circle r="1.1" fill="#FFD37A">
                      <animateMotion dur="2s" repeatCount="indefinite" begin="0.8s" path="M72,64 Q60,66 56,68" />
                    </circle>
                  </>
                )}
              </g>
            </svg>

            {nodes.map((node) => (
              <button
                key={node.key}
                className="interactive-system__hotspot"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
                onClick={() => setActiveNode(activeNode === node.key ? null : node.key)}
                aria-label={node.label}
              >
                <span className="interactive-system__hotspot-dot" />
                {activeNode === node.key && (
                  <div className="interactive-system__tooltip glass-card">
                    <strong>{node.label}</strong>
                    <p>{node.fact}</p>
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="interactive-system__readout glass-card">
            <p className="interactive-system__readout-row">
              <span>Generating</span>
              <strong>{readout.kw.toFixed(1)} kW</strong>
            </p>
            <p className="interactive-system__readout-row">
              <span>Battery</span>
              <strong>{Math.round(readout.battery)}%</strong>
            </p>
            <div className="interactive-system__readout-bar">
              <div className="interactive-system__readout-bar-fill" style={{ width: `${readout.battery}%` }} />
            </div>
            <p className="interactive-system__readout-footnote">Home powered by: 100% solar</p>
          </div>
        </div>
      </div>
    </section>
  );
}
