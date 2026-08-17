// Ambient floating particles — pure CSS animation, no JS loop. Drop into
// any `position: relative` container for a slow drifting-ember feel.
// Positions/timings are seeded per-instance so multiple fields on the
// page don't animate in visible lockstep.
import './SparkleField.css';

function seededRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export default function SparkleField({ count = 18, seed = 1, className = '' }) {
  const rand = seededRandom(seed);
  const particles = Array.from({ length: count }, (_, i) => {
    const left = (rand() * 100).toFixed(1);
    const size = (2 + rand() * 3).toFixed(1);
    const duration = (7 + rand() * 9).toFixed(1);
    const delay = (rand() * 10).toFixed(1);
    const drift = (rand() * 40 - 20).toFixed(0);
    return { key: i, left, size, duration, delay, drift };
  });

  return (
    <div className={`sparkle-field ${className}`} aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.key}
          className="sparkle-field__particle"
          style={{
            left: `${p.left}%`,
            width: `${p.size}px`,
            height: `${p.size}px`,
            '--dur': `${p.duration}s`,
            '--delay': `${p.delay}s`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
