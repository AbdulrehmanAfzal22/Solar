import useReveal from '../../hooks/useReveal';
import content from '../../data/content';
import services from '../../data/services';
import { HouseIcon, BuildingIcon, BatteryIcon, MonitorIcon, WrenchIcon, WalletIcon } from '../icons';
import './Solutions.css';

// Paired with services.js by index.
const serviceIcons = [HouseIcon, BuildingIcon, BatteryIcon, MonitorIcon, WrenchIcon, WalletIcon];

// Decorative background texture per card, paired with services.js by
// index — the first three get a texture that matches their subject,
// everything else falls back to a plain corner glow.
const cardTextures = ['rays', 'grid', 'curve', 'corner', 'corner', 'corner'];

function ServiceCard({ service, Icon, texture, index }) {
  const [ref, isIn] = useReveal(0.15);
  return (
    <div
      className={`solution-card solution-card--texture-${texture} glass-card reveal reveal-stagger ${isIn ? 'is-in' : ''}`}
      style={{ '--delay': `${(index % 3) * 90 + Math.floor(index / 3) * 90}ms` }}
      ref={ref}
    >
      <div className={`solution-card__bar ${isIn ? 'is-in' : ''}`} aria-hidden="true" />
      <span className="solution-card__mark" aria-hidden="true">
        <Icon className="solution-card__icon" />
      </span>
      <h3 className="solution-card__name">{service.name}</h3>
      <p className="solution-card__desc">{service.description}</p>
      <a href="#" className="solution-card__link">Learn more →</a>
    </div>
  );
}

export default function Solutions() {
  const [headRef, headIn] = useReveal(0.2);

  return (
    <section className="section solutions">
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.solutions.eyebrow}</p>
          <h2 className="section-heading">{content.solutions.headline}</h2>
        </div>

        <div className="solutions__grid">
          {services.map((service, i) => (
            <ServiceCard
              service={service}
              Icon={serviceIcons[i % serviceIcons.length]}
              texture={cardTextures[i % cardTextures.length]}
              index={i}
              key={service.name}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
