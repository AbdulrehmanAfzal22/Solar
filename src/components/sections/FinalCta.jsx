import { useEffect, useRef } from 'react';
import useReveal from '../../hooks/useReveal';
import content from '../../data/content';
import SparkleField from '../SparkleField';
import './FinalCta.css';

const windows = Array.from({ length: 9 });
const roofPanels = Array.from({ length: 5 });
const sunRayAngles = [0, 45, 90, 135, 180, 225, 270, 315];

export default function FinalCta() {
  const [ref, isIn] = useReveal(0.3);
  const sectionRef = useRef(null);

  // Subtle cursor-parallax on the sun — reads as alive without being a
  // gimmick. Throttled to one update per animation frame, skipped
  // entirely under reduced-motion.
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const el = sectionRef.current;
    if (!el) return;

    let raf = null;
    function onMove(e) {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        el.style.setProperty('--parallax-x', `${x * 26}px`);
        el.style.setProperty('--parallax-y', `${y * 16}px`);
        raf = null;
      });
    }
    el.addEventListener('mousemove', onMove);
    return () => {
      el.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section className="section final-cta" ref={sectionRef}>
      <span className="final-cta__aurora" aria-hidden="true" />
      <SparkleField count={24} seed={41} className="final-cta__sparkles" />

      <div className={`final-cta__scene ${isIn ? 'is-in' : ''}`} ref={ref} aria-hidden="true">
        <div className="final-cta__sun-wrap">
          <span className="final-cta__sun-halo" />
          <span className="final-cta__sun" />
          <span className="final-cta__ray-group">
            {sunRayAngles.map((deg) => (
              <span className="final-cta__ray" style={{ '--deg': `${deg}deg` }} key={deg} />
            ))}
          </span>
        </div>

        <div className="final-cta__structure">
          <div className="final-cta__roof">
            {roofPanels.map((_, i) => (
              <span className="final-cta__roof-panel" style={{ '--panel-delay': `${200 + i * 90}ms` }} key={i} />
            ))}
          </div>
          <div className="final-cta__building">
            {windows.map((_, i) => (
              <span className="final-cta__window" style={{ '--win-delay': `${500 + i * 90}ms` }} key={i} />
            ))}
          </div>
          <div className="final-cta__ground" />
        </div>
      </div>

      <div className="section__inner final-cta__content">
        <h2 className={`final-cta__headline reveal ${isIn ? 'is-in' : ''}`}>
          {content.finalCta.headline}
        </h2>
        <p className={`final-cta__body reveal reveal-stagger ${isIn ? 'is-in' : ''}`} style={{ '--delay': '150ms' }}>
          {content.finalCta.body}
        </p>
        <div className={`final-cta__buttons reveal reveal-stagger ${isIn ? 'is-in' : ''}`} style={{ '--delay': '280ms' }}>
          <a href="#quote" className="btn btn--primary">Design My Solar System</a>
          <a href="#contact" className="btn btn--ghost">Talk to an Expert</a>
        </div>
      </div>
    </section>
  );
}
