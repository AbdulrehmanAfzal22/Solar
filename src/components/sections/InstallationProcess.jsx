import { useEffect, useRef, useState } from 'react';
import useReveal from '../../hooks/useReveal';
import useCountUp from '../../hooks/useCountUp';
import content from '../../data/content';
import { ChatIcon, SearchIcon, BlueprintIcon, ToolsIcon, PlugCheckIcon, MonitorIcon } from '../icons';
import OrbitMedallion from '../OrbitMedallion';
import SparkleField from '../SparkleField';
import AmbientGlow from '../ui/AmbientGlow';
import './InstallationProcess.css';

const steps = [
  { title: 'Consultation', desc: 'A conversation about your needs, budget, and goals — usually free.', Icon: ChatIcon },
  { title: 'Site Assessment', desc: 'We examine sun exposure, shading, roof condition, and your electrical setup.', Icon: SearchIcon },
  { title: 'System Design', desc: 'An engineer sizes the system — panel count, inverter, and battery if you want one.', Icon: BlueprintIcon },
  { title: 'Installation', desc: 'Physical mounting, wiring, and inverter/battery placement — 1–3 days for most homes.', Icon: ToolsIcon },
  { title: 'Activation', desc: 'Utility connection and final inspection — usually the slowest step, worth planning around.', Icon: PlugCheckIcon },
  { title: 'Monitoring', desc: 'Ongoing visibility into performance through an app or dashboard.', Icon: MonitorIcon },
];

const BURST_PARTICLE_COUNT = 5;
// Covers the slowest sub-effect (3rd shockwave ring: 300ms delay + 900ms
// duration = 1200ms) with a small safety margin before cleanup removes it.
const BURST_LIFETIME_MS = 1300;
const FINALE_PARTICLE_COUNT = 14;
const DECOR_MIN_WIDTH = 1101; // matches the CSS breakpoint that hides .installation__decor

export default function InstallationProcess() {
  const [headRef, headIn] = useReveal(0.2);
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const medallionRef = useRef(null);
  const markerRefs = useRef([]);
  const [fillPercent, setFillPercent] = useState(0);

  // Ignition burst (shockwave rings + icon spin + particles), the energy
  // arc linking a marker to the orbit graphic, and the last-step finale —
  // all one-shot per step activation, all skipped entirely under reduced
  // motion so nothing extra ever gets computed or rendered.
  const [burst, setBurst] = useState(null); // { id, stepIndex, particles }
  const [arc, setArc] = useState(null); // { id, d }
  const [finale, setFinale] = useState(null); // { id, particles }
  const burstIdRef = useRef(0);
  const reduceMotionRef = useRef(
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useEffect(() => {
    if (reduceMotionRef.current) {
      setFillPercent(100);
      return undefined;
    }

    function onScroll() {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight * 0.5;
      const scrolled = window.innerHeight * 0.7 - rect.top;
      const pct = total > 0 ? Math.min(100, Math.max(0, (scrolled / total) * 100)) : 0;
      setFillPercent(pct);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Same threshold math the step trail renders from, computed once so the
  // medallion tracks the identical "current step" instead of a separate
  // notion of active-ness.
  const activeFlags = steps.map((_, i) => fillPercent >= (i / (steps.length - 1)) * 100);
  const currentIndex = Math.max(0, activeFlags.lastIndexOf(true));
  const currentStep = steps[currentIndex];

  // Smoothly-interpolating "X% complete" readout, driven by the same
  // fillPercent as the timeline — rounded before it reaches useCountUp so
  // the animation only restarts on genuine 1%-step changes, not scroll noise.
  const [percentRef, percentVal] = useCountUp(Math.round(fillPercent));

  const prevIndexRef = useRef(currentIndex);

  // Fires once per genuine step-index change (not on mount, not on every
  // scroll frame) — the single source for the marker's ignition burst, the
  // energy arc connecting it to the orbit graphic, and (on the final step
  // only) the finale burst at the orbit graphic itself.
  useEffect(() => {
    if (currentIndex === prevIndexRef.current) return undefined;
    prevIndexRef.current = currentIndex;
    if (reduceMotionRef.current) return undefined;

    const particles = Array.from({ length: BURST_PARTICLE_COUNT }, (_, i) => {
      const angle = (i / BURST_PARTICLE_COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const dist = 16 + Math.random() * 14;
      return { id: i, dx: Math.round(Math.cos(angle) * dist), dy: Math.round(Math.sin(angle) * dist) };
    });

    burstIdRef.current += 1;
    const id = burstIdRef.current;
    setBurst({ id, stepIndex: currentIndex, particles });

    const marker = markerRefs.current[currentIndex];
    const medallion = medallionRef.current;
    if (window.innerWidth > DECOR_MIN_WIDTH && sectionRef.current && marker && medallion) {
      const sectionRect = sectionRef.current.getBoundingClientRect();
      const markerRect = marker.getBoundingClientRect();
      const medallionRect = medallion.getBoundingClientRect();
      const startX = markerRect.left + markerRect.width / 2 - sectionRect.left;
      const startY = markerRect.top + markerRect.height / 2 - sectionRect.top;
      const endX = medallionRect.left + medallionRect.width / 2 - sectionRect.left;
      const endY = medallionRect.top + medallionRect.height / 2 - sectionRect.top;
      const midX = (startX + endX) / 2;
      const midY = Math.min(startY, endY) - 50;
      setArc({ id, d: `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}` });
    } else {
      setArc(null);
    }

    if (currentIndex === steps.length - 1) {
      const finaleParticles = Array.from({ length: FINALE_PARTICLE_COUNT }, (_, i) => {
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 55;
        return {
          id: i,
          dx: Math.round(Math.cos(angle) * dist),
          dy: Math.round(Math.sin(angle) * dist),
          delay: Math.round(Math.random() * 150),
        };
      });
      setFinale({ id, particles: finaleParticles });
    } else {
      setFinale(null);
    }

    const clear = setTimeout(() => {
      setBurst((b) => (b && b.id === id ? null : b));
      setArc((a) => (a && a.id === id ? null : a));
      setFinale((f) => (f && f.id === id ? null : f));
    }, BURST_LIFETIME_MS);

    return () => clearTimeout(clear);
  }, [currentIndex]);

  return (
    <section className="section installation" ref={sectionRef}>
      <div className="installation__aura" aria-hidden="true" />
      {finale && <div className="installation__aura-flare" key={`flare-${finale.id}`} aria-hidden="true" />}

      <SparkleField count={14} seed={23} className="installation__sparkles" />
      <div className="installation__decor">
        <AmbientGlow count={8} color="var(--c-gold-soft)" className="installation__ambient" seed={83} />

        <div className="installation__decor-medallion" ref={medallionRef}>
          <OrbitMedallion Icon={currentStep.Icon} />
          {finale && (
            <div className="installation__finale" key={finale.id} aria-hidden="true">
              {finale.particles.map((p) => (
                <span
                  key={p.id}
                  className="installation__finale-particle"
                  style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px`, '--delay': `${p.delay}ms` }}
                />
              ))}
            </div>
          )}
        </div>
        <p className="installation__decor-label">
          <span className="installation__decor-step">Step {currentIndex + 1} of {steps.length}</span>
          <span className="installation__decor-title">{currentStep.title}</span>
        </p>
        <p className="installation__decor-percent" ref={percentRef}>
          {Math.round(percentVal)}% complete
        </p>

        <div className="installation__decor-card glass-card">
          <p className="installation__decor-card-title">Typical timeline</p>
          <p className="installation__decor-card-value">4–6 weeks</p>
          <p className="installation__decor-card-text">Start to finish — from first consultation to a fully monitored, producing system.</p>
        </div>
      </div>
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.installation.eyebrow}</p>
          <h2 className="section-heading">{content.installation.headline}</h2>
        </div>

        <div className="installation__track" ref={trackRef}>
          <div className="installation__line">
            <div className="installation__line-fill" style={{ height: `${fillPercent}%` }}>
              <span className="installation__conduit-dot installation__conduit-dot--lead" aria-hidden="true" />
              <span className="installation__conduit-dot installation__conduit-dot--trail1" aria-hidden="true" />
              <span className="installation__conduit-dot installation__conduit-dot--trail2" aria-hidden="true" />
            </div>
          </div>

          {steps.map((step, i) => {
            const isActive = activeFlags[i];
            const isBursting = burst != null && burst.stepIndex === i;
            const { Icon } = step;
            return (
              <div className={`installation__step ${isActive ? 'is-active' : ''}`} key={step.title}>
                <div
                  className="installation__step-marker"
                  ref={(el) => { markerRefs.current[i] = el; }}
                >
                  {isBursting && (
                    <>
                      <span className="installation__ignite-flash" key={`flash-${burst.id}`} aria-hidden="true" />
                      <span className="installation__shockwave installation__shockwave--1" key={`shock1-${burst.id}`} aria-hidden="true" />
                      <span className="installation__shockwave installation__shockwave--2" key={`shock2-${burst.id}`} aria-hidden="true" />
                      <span className="installation__shockwave installation__shockwave--3" key={`shock3-${burst.id}`} aria-hidden="true" />
                    </>
                  )}
                  <Icon
                    className={`installation__step-icon ${isBursting ? 'installation__step-icon--ignite' : ''}`}
                    key={isBursting ? `icon-${burst.id}` : `icon-${i}`}
                  />
                  {isBursting && burst.particles.map((p) => (
                    <span
                      key={`particle-${burst.id}-${p.id}`}
                      className="installation__particle"
                      style={{ '--dx': `${p.dx}px`, '--dy': `${p.dy}px` }}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                <div className="installation__step-body">
                  <h3 className="installation__step-title">{step.title}</h3>
                  <p className="installation__step-desc">{step.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <svg className="installation__arc-layer" aria-hidden="true">
        {arc && (
          <g key={arc.id}>
            <path className="installation__arc-path" d={arc.d} />
            <circle r="3" className="installation__arc-dot">
              <animateMotion dur="550ms" fill="freeze" path={arc.d} />
            </circle>
          </g>
        )}
      </svg>
    </section>
  );
}
