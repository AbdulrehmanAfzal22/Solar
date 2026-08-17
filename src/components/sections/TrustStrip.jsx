import useReveal from '../../hooks/useReveal';
import content from '../../data/content';
import './TrustStrip.css';

// Text-based marks as a stand-in for real client logos — swap for actual
// logo images/SVGs per deployment (see /data or /assets in the README).
const marks = [
  'NABCEP', 'UL Certified', 'Energy Star', 'IEEE 1547', 'Better Business Bureau', 'SEIA Member',
];

export default function TrustStrip() {
  const [ref, isIn] = useReveal(0.1);

  return (
    <section className="section trust-strip">
      <div className="section__inner">
        <div className={`reveal ${isIn ? 'is-in' : ''}`} ref={ref}>
          <p className="eyebrow">{content.trust.eyebrow}</p>
          <h2 className="trust-strip__heading">{content.trust.headline}</h2>
        </div>

        <div className={`trust-strip__marquee-mask ${isIn ? 'is-in' : ''}`}>
          <div className="trust-strip__marquee">
            {[...marks, ...marks].map((mark, i) => (
              <span className="trust-strip__mark" key={i}>{mark}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
