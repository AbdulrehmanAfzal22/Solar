import { useMemo } from 'react';
import './AmbientGlow.css';

// Deterministic per-instance RNG (same technique as SparkleField) — keeps
// each dot's drift stable across re-renders instead of reshuffling every
// time a parent with fast-changing state (e.g. RoiCalculator's sliders)
// re-renders, while still looking different from one section to the next.
function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// The site's one shared "atmosphere" effect — a handful of soft, slow-
// drifting glowing dots, same visual language as .hero__energy .dot in
// App.css (radial glow + box-shadow, ~6px). Built once here; sections
// place it with their own density/color/position via `count`, `color`,
// and `className` rather than rebuilding this per section.
export default function AmbientGlow({ count = 8, color = 'var(--c-gold)', className = '', seed = 1 }) {
  const dots = useMemo(() => {
    const rand = seededRandom(seed * 97 + count * 13 + 1);
    return Array.from({ length: count }, (_, i) => {
      const left = (rand() * 100).toFixed(1);
      const top = (rand() * 100).toFixed(1);
      const size = (4 + rand() * 3).toFixed(1); // ~4–7px
      const duration = (9 + rand() * 9).toFixed(1); // 9–18s, slow
      const delay = (-rand() * 14).toFixed(1); // negative so dots start mid-loop, not in lockstep
      const dx = (rand() * 70 - 35).toFixed(0);
      const dy = (rand() * 70 - 35).toFixed(0);
      return { key: i, left, top, size, duration, delay, dx, dy };
    });
  }, [count, seed]);

  return (
    <div className={`ambient-glow ${className}`} aria-hidden="true" style={{ '--glow-color': color }}>
      {dots.map((d) => (
        <span
          key={d.key}
          className="ambient-glow__dot"
          style={{
            left: `${d.left}%`,
            top: `${d.top}%`,
            width: `${d.size}px`,
            height: `${d.size}px`,
            '--dur': `${d.duration}s`,
            '--delay': `${d.delay}s`,
            '--dx': `${d.dx}px`,
            '--dy': `${d.dy}px`,
          }}
        />
      ))}
    </div>
  );
}
