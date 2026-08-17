import useReveal from '../../hooks/useReveal';
import content from '../../data/content';
import { PanelIcon, InverterIcon, MonitorIcon, RoutingIcon } from '../icons';
import './Technology.css';

const parts = [
  { name: 'High-Efficiency Panels', spec: '22.8% efficiency', detail: 'More usable power from the same roof space.', Icon: PanelIcon },
  { name: 'Smart Inverters', spec: '97.5% efficiency', detail: 'Built-in monitoring and safety shutoff.', Icon: InverterIcon },
  { name: 'Monitoring', spec: 'Real-time + historical', detail: 'Production and usage, from your phone.', Icon: MonitorIcon },
  { name: 'Energy Management', spec: 'Automatic routing', detail: 'Prioritizes battery, grid, or appliances on its own.', Icon: RoutingIcon },
];

function TechCard({ part, index }) {
  const [ref, isIn] = useReveal(0.2);
  const { Icon } = part;
  return (
    <div
      className={`tech-card glass-card reveal reveal-stagger ${isIn ? 'is-in' : ''}`}
      style={{ '--delay': `${index * 110}ms` }}
      ref={ref}
    >
      <div className="tech-card__icon-badge">
        <Icon className="tech-card__icon" />
      </div>
      <h3 className="tech-card__name">{part.name}</h3>
      <p className="tech-card__spec">{part.spec}</p>
      <p className="tech-card__detail">{part.detail}</p>
    </div>
  );
}

export default function Technology() {
  const [headRef, headIn] = useReveal(0.2);

  return (
    <section className="section technology">
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.technology.eyebrow}</p>
          <h2 className="section-heading">{content.technology.headline}</h2>
        </div>

        <div className="technology__grid">
          {parts.map((part, i) => (
            <TechCard part={part} index={i} key={part.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
