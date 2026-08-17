import useReveal from '../../hooks/useReveal';
import useCountUp from '../../hooks/useCountUp';
import content from '../../data/content';
import commercialRoof from '../../assets/commercial-roof.jpg';
import { BoltIcon, DollarIcon, LeafIcon } from '../icons';
import AmbientGlow from '../ui/AmbientGlow';
import './CommercialIndustrial.css';

function CommercialStat({ target, prefix = '', suffix, label, Icon, index }) {
  const [countRef, value] = useCountUp(target);
  const [revealRef, isIn] = useReveal(0.3);

  return (
    <div
      className={`commercial__stat reveal reveal-stagger ${isIn ? 'is-in' : ''}`}
      style={{ '--delay': `${index * 110}ms` }}
      ref={revealRef}
    >
      <span className="commercial__stat-icon-badge" aria-hidden="true">
        <Icon className="commercial__stat-icon" />
      </span>
      <p className="commercial__stat-value" ref={countRef}>
        {prefix}{Math.round(value).toLocaleString()}{suffix}
      </p>
      <div className={`commercial__stat-underline ${isIn ? 'is-in' : ''}`} />
      <p className="commercial__stat-label">{label}</p>
    </div>
  );
}

export default function CommercialIndustrial() {
  const [headRef, headIn] = useReveal(0.2);
  const [imgRef, imgIn] = useReveal(0.2);
  // Also used by the hover-HUD readout, so the photo and the stat row
  // below always agree on the same live numbers.
  const [sizeRef, size] = useCountUp(500);
  const [savingsRef, savings] = useCountUp(68000);
  const [co2Ref, co2] = useCountUp(340);

  return (
    <section className="section commercial">
      <AmbientGlow count={8} color="var(--c-gold-soft)" className="commercial__ambient" seed={71} />
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.commercial.eyebrow}</p>
          <h2 className="section-heading">{content.commercial.headline}</h2>
          <p className="section-subhead">{content.commercial.body}</p>
        </div>

        <div className={`commercial__frame ${imgIn ? 'is-in' : ''}`} ref={imgRef} style={{ backgroundImage: `url(${commercialRoof})` }}>
          <div className="commercial__roof">
            {Array.from({ length: 24 }).map((_, i) => (
              <span className="commercial__panel" style={{ '--panel-delay': `${i * 35}ms` }} key={i} />
            ))}
          </div>

          <span className="commercial__corner commercial__corner--tl" aria-hidden="true" />
          <span className="commercial__corner commercial__corner--tr" aria-hidden="true" />
          <span className="commercial__corner commercial__corner--bl" aria-hidden="true" />
          <span className="commercial__corner commercial__corner--br" aria-hidden="true" />

          <div className="commercial__hud glass-card" aria-hidden="true">
            <p className="commercial__hud-title">System scan</p>
            <p className="commercial__hud-row"><span>Size</span><span ref={sizeRef}>{Math.round(size)} kW</span></p>
            <p className="commercial__hud-row"><span>Savings</span><span ref={savingsRef}>${Math.round(savings).toLocaleString()}/yr</span></p>
            <p className="commercial__hud-row"><span>CO₂ offset</span><span ref={co2Ref}>{Math.round(co2)} t/yr</span></p>
          </div>
        </div>

        <div className="commercial__stats">
          <CommercialStat target={500} suffix=" kW" label="System size" Icon={BoltIcon} index={0} />
          <CommercialStat target={68000} prefix="$" label="Annual savings" Icon={DollarIcon} index={1} />
          <CommercialStat target={340} suffix=" t" label="CO₂ offset / yr" Icon={LeafIcon} index={2} />
        </div>
      </div>
    </section>
  );
}
