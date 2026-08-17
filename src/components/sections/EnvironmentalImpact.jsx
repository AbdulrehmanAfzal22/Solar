import useReveal from '../../hooks/useReveal';
import useCountUp from '../../hooks/useCountUp';
import content from '../../data/content';
import environmentalLandscape from '../../assets/environmental-landscape.jpg';
import './EnvironmentalImpact.css';

export default function EnvironmentalImpact() {
  const [headRef, headIn] = useReveal(0.15);
  const [treesRef, trees] = useCountUp(1840);
  const [carsRef, cars] = useCountUp(212);

  return (
    <section className="section environmental">
      <div className="environmental__bg" style={{ backgroundImage: `url(${environmentalLandscape})` }} aria-hidden="true" />
      <div className="section__inner">
        <div className={`environmental__reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.environmental.eyebrow}</p>
          <h2 className="section-heading">{content.environmental.headline}</h2>
          <p className="section-subhead">{content.environmental.body}</p>
        </div>

        <div className="environmental__grid">
          <div className={`environmental__stat ${trees > 0 ? 'is-in' : ''}`} ref={treesRef}>
            <svg viewBox="0 0 40 40" className="environmental__icon" aria-hidden="true">
              <path
                d="M20 34V22M20 22C13 22 9 17 9 12C9 12 14 14 20 8C26 14 31 12 31 12C31 17 27 22 20 22Z"
                fill="none"
                stroke="var(--c-gold)"
                strokeWidth="1.6"
                className="environmental__tree-path"
              />
            </svg>
            <p className="environmental__stat-value">{Math.round(trees).toLocaleString()}</p>
            <p className="environmental__stat-label">Equivalent trees planted</p>
          </div>

          <div className={`environmental__stat ${cars > 0 ? 'is-in' : ''}`} ref={carsRef}>
            <svg viewBox="0 0 40 40" className="environmental__icon" aria-hidden="true">
              <path
                d="M6 26h28l-3-9a3 3 0 0 0-2.8-2H11.8a3 3 0 0 0-2.8 2Z"
                fill="none"
                stroke="var(--c-gold)"
                strokeWidth="1.6"
                className="environmental__car-path"
              />
              <circle cx="13" cy="27" r="2" fill="var(--c-gold)" />
              <circle cx="27" cy="27" r="2" fill="var(--c-gold)" />
            </svg>
            <p className="environmental__stat-value">{Math.round(cars)}</p>
            <p className="environmental__stat-label">Cars off the road, equivalent</p>
          </div>
        </div>
      </div>
    </section>
  );
}
