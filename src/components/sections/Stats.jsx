import useReveal from '../../hooks/useReveal';
import useCountUp from '../../hooks/useCountUp';
import content from '../../data/content';
import statsData from '../../data/stats';
import { BoltIcon, LeafIcon, HouseIcon, ClockIcon } from '../icons';
import AmbientGlow from '../ui/AmbientGlow';
import './Stats.css';

// Paired with stats.js by index — one icon per figure.
const statIcons = [BoltIcon, LeafIcon, HouseIcon, ClockIcon];

function StatBlock({ stat, Icon, index }) {
  const [ref, value, done] = useCountUp(stat.value);
  const [revealRef, isIn] = useReveal(0.3);

  return (
    <div
      className={`stat-block reveal reveal-stagger ${isIn ? 'is-in' : ''} ${done ? 'is-landed' : ''}`}
      style={{ '--delay': `${index * 130}ms` }}
      ref={revealRef}
    >
      <span className="stat-block__icon-badge" aria-hidden="true">
        <Icon className="stat-block__icon" />
      </span>
      <p className="stat-block__value" ref={ref}>
        {Math.round(value).toLocaleString()}{stat.suffix}
      </p>
      <div className={`stat-block__underline ${isIn ? 'is-in' : ''}`} />
      <p className="stat-block__label">{stat.label}</p>
    </div>
  );
}

export default function Stats() {
  const [headRef, headIn] = useReveal(0.2);

  return (
    <section className="section stats">
      <AmbientGlow count={8} color="var(--c-gold)" className="stats__ambient" seed={11} />
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.stats.eyebrow}</p>
          <h2 className="section-heading">{content.stats.headline}</h2>
        </div>

        <div className="stats__grid">
          {statsData.map((stat, i) => (
            <StatBlock stat={stat} Icon={statIcons[i % statIcons.length]} index={i} key={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
