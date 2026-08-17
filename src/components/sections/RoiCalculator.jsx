import { useEffect, useMemo, useRef, useState } from 'react';
import useReveal from '../../hooks/useReveal';
import useCountUp from '../../hooks/useCountUp';
import content from '../../data/content';
import AmbientGlow from '../ui/AmbientGlow';
import './RoiCalculator.css';

const PAYBACK_RING_RADIUS = 16;
const PAYBACK_RING_CIRCUMFERENCE = 2 * Math.PI * PAYBACK_RING_RADIUS;

// Rough regional peak-sun-hours assumptions — replace with real per-region
// data before shipping to a client; see the blueprint's note that this
// section needs light regional review, not just a currency-symbol swap.
const REGIONS = [
  { key: 'southwest', label: 'Southwest', sunHours: 6.4 },
  { key: 'southeast', label: 'Southeast', sunHours: 5.2 },
  { key: 'northeast', label: 'Northeast', sunHours: 4.3 },
  { key: 'northwest', label: 'Northwest', sunHours: 3.8 },
];

const RATE_PER_KWH = 0.16;

function estimate({ propertyType, monthlyBill, region }) {
  const sunHours = REGIONS.find((r) => r.key === region).sunHours;
  const annualUsageKwh = (monthlyBill / RATE_PER_KWH) * 12;
  const systemKw = annualUsageKwh / (sunHours * 365 * 0.78);
  const annualProductionKwh = systemKw * sunHours * 365 * 0.78;
  const annualSavings = Math.min(annualProductionKwh, annualUsageKwh) * RATE_PER_KWH * 0.92;
  const costPerWatt = propertyType === 'commercial' ? 2.2 : 2.9;
  const systemCost = systemKw * 1000 * costPerWatt * 0.7; // post 30% credit, illustrative
  const paybackYears = systemCost / annualSavings;
  const co2Tons = annualProductionKwh * 0.0004;

  return { systemKw, annualSavings, annualProductionKwh, paybackYears, co2Tons };
}

export default function RoiCalculator() {
  const [headRef, headIn] = useReveal(0.2);
  const [propertyType, setPropertyType] = useState('residential');
  const [monthlyBill, setMonthlyBill] = useState(180);
  const [region, setRegion] = useState('southwest');

  const result = useMemo(
    () => estimate({ propertyType, monthlyBill, region }),
    [propertyType, monthlyBill, region]
  );

  const [sizeRef, sizeVal] = useCountUp(result.systemKw);
  const [savingsRef, savingsVal] = useCountUp(result.annualSavings);
  const [prodRef, prodVal] = useCountUp(result.annualProductionKwh);
  const [paybackRef, paybackVal] = useCountUp(result.paybackYears);
  const [co2Ref, co2Val] = useCountUp(result.co2Tons);

  const paybackPercent = Math.min(100, (10 / Math.max(result.paybackYears, 1)) * 100);
  const paybackRingOffset = PAYBACK_RING_CIRCUMFERENCE * (1 - paybackPercent / 100);

  // A one-shot glow around the results row every time an input changes —
  // skips the initial mount (isFirstChange) so it only fires on genuine
  // edits, and remounts a small overlay via `key` each time so the CSS
  // animation reliably restarts instead of a no-op class re-application.
  const [pulseTick, setPulseTick] = useState(0);
  const isFirstChange = useRef(true);

  useEffect(() => {
    if (isFirstChange.current) {
      isFirstChange.current = false;
      return;
    }
    setPulseTick((t) => t + 1);
  }, [propertyType, monthlyBill, region]);

  return (
    <section className="section roi" id="savings">
      <AmbientGlow count={6} color="var(--c-gold-soft)" className="roi__ambient" seed={57} />
      <div className="section__inner">
        <div className={`reveal ${headIn ? 'is-in' : ''}`} ref={headRef}>
          <p className="eyebrow">{content.roi.eyebrow}</p>
          <h2 className="section-heading">{content.roi.headline}</h2>
        </div>

        <div className="roi__card glass-card">
          <div className="roi__inputs">
            <div className="roi__field">
              <label className="roi__label">Property type</label>
              <div className="roi__segmented">
                {['residential', 'commercial'].map((type) => (
                  <button
                    key={type}
                    className={`roi__segment ${propertyType === type ? 'is-active' : ''}`}
                    onClick={() => setPropertyType(type)}
                  >
                    {type === 'residential' ? 'Residential' : 'Commercial'}
                  </button>
                ))}
              </div>
            </div>

            <div className="roi__field">
              <label className="roi__label">
                Monthly electricity bill — <strong>${monthlyBill}</strong>
              </label>
              <input
                type="range"
                min="50"
                max="800"
                step="10"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="roi__slider"
              />
            </div>

            <div className="roi__field">
              <label className="roi__label">Region</label>
              <div className="roi__segmented roi__segmented--wrap">
                {REGIONS.map((r) => (
                  <button
                    key={r.key}
                    className={`roi__segment ${region === r.key ? 'is-active' : ''}`}
                    onClick={() => setRegion(r.key)}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="roi__results">
            {pulseTick > 0 && <div className="roi__results-pulse" key={pulseTick} aria-hidden="true" />}

            <div className="roi__result" ref={sizeRef}>
              <p className="roi__result-value">{sizeVal.toFixed(1)} kW</p>
              <p className="roi__result-label">System size</p>
            </div>
            <div className="roi__result" ref={savingsRef}>
              <p className="roi__result-value">${Math.round(savingsVal).toLocaleString()}</p>
              <p className="roi__result-label">Annual savings</p>
            </div>
            <div className="roi__result" ref={prodRef}>
              <p className="roi__result-value">{Math.round(prodVal).toLocaleString()} kWh</p>
              <p className="roi__result-label">Annual production</p>
            </div>
            <div className="roi__result" ref={paybackRef}>
              <div className="roi__payback-row">
                <svg viewBox="0 0 40 40" className="roi__payback-ring" aria-hidden="true">
                  <circle cx="20" cy="20" r={PAYBACK_RING_RADIUS} className="roi__payback-ring-track" />
                  <circle
                    cx="20" cy="20" r={PAYBACK_RING_RADIUS}
                    className="roi__payback-ring-fill"
                    style={{
                      strokeDasharray: PAYBACK_RING_CIRCUMFERENCE,
                      strokeDashoffset: paybackRingOffset,
                    }}
                  />
                </svg>
                <div>
                  <p className="roi__result-value">{paybackVal.toFixed(1)} yrs</p>
                  <p className="roi__result-label">Payback period</p>
                </div>
              </div>
              <div className="roi__result-bar">
                <div className="roi__result-bar-fill" style={{ width: `${paybackPercent}%` }} />
              </div>
            </div>
            <div className="roi__result" ref={co2Ref}>
              <p className="roi__result-value">{co2Val.toFixed(1)} t</p>
              <p className="roi__result-label">CO₂ avoided / yr</p>
            </div>
          </div>

          <p className="roi__disclaimer">{content.roi.disclaimer}</p>
        </div>
      </div>
    </section>
  );
}
