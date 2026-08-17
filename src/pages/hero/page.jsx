// If you're on Next.js App Router, add this as the very first line: 'use client'

import { useEffect, useRef } from 'react';
import './style.css';

// ↓↓↓ THE ONLY TWO LINES YOU NEED TO EDIT ↓↓↓
// Point these at your own photos — same folder as this file, or adjust the path.
import houseDay from '../../assets/house-day.jpeg';
import houseNight from '../../assets/house-night.jpeg';
// ↑↑↑ THE ONLY TWO LINES YOU NEED TO EDIT ↑↑↑

// Bill figures — swap these for your own numbers.
const BILL_WITHOUT_SOLAR = 180;
const BILL_WITH_SOLAR = 42;

export default function Hero() {
  const heroRef = useRef(null);
  const energyRef = useRef(null);
  const valueRef = useRef(null);
  const savedRef = useRef(null);
  const barRef = useRef(null);
  const badgeRef = useRef(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;

    // Maps v from the [a,b] range onto [0,1], clamped at both ends.
    function remap(v, a, b) {
      return Math.min(1, Math.max(0, (v - a) / (b - a)));
    }

    // This writes straight to the DOM via refs rather than useState —
    // scroll fires far too often to run through React's render cycle on
    // every tick. --p is the single source of truth the CSS reads from.
    function update() {
      ticking = false;

      const rect = hero.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      let p = scrollable > 0 ? -rect.top / scrollable : 0;
      p = Math.min(1, Math.max(0, p));

      // Text does a clean swap, not a crossfade: day fades fully OUT before
      // night starts fading IN. Any symmetric crossfade — even a narrow one —
      // still has a moment where both are ~50% visible at once, which is the
      // ghosting/merging look. Offsetting the two windows so they never
      // overlap removes that moment entirely.
      const textOut = remap(p, 0.40, 0.50); // day: 1 → 0
      const textIn = remap(p, 0.50, 0.60);  // night: 0 → 1

      // --p drives the image/scene/card; --text-out/--text-in drive copy.
      // Also set on <html> (not just .hero) so the navbar — which sits
      // outside .hero in the DOM — can read the same progress and shift
      // its own background in sync instead of jumping once and freezing.
      hero.style.setProperty('--p', p.toFixed(4));
      hero.style.setProperty('--text-out', textOut.toFixed(4));
      hero.style.setProperty('--text-in', textIn.toFixed(4));
      document.documentElement.style.setProperty('--p', p.toFixed(4));

      if (energyRef.current) energyRef.current.classList.toggle('is-active', p > 0.55);

      const bill = Math.round(BILL_WITHOUT_SOLAR - (BILL_WITHOUT_SOLAR - BILL_WITH_SOLAR) * p);
      const savedAmount = BILL_WITHOUT_SOLAR - bill;
      const percent = Math.round((savedAmount / BILL_WITHOUT_SOLAR) * 100);

      if (valueRef.current) valueRef.current.textContent = bill;
      if (savedRef.current) savedRef.current.textContent = `$${savedAmount}`;
      if (barRef.current) barRef.current.style.width = `${percent}%`;
      if (badgeRef.current) badgeRef.current.textContent = `${percent}% lower`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    if (!reduceMotion) {
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      update();
    } else {
      // Matching CSS media query already skips the pin and shows the
      // night state directly — just land the numbers on their end point.
      const savedAmount = BILL_WITHOUT_SOLAR - BILL_WITH_SOLAR;
      const percent = Math.round((savedAmount / BILL_WITHOUT_SOLAR) * 100);
      if (valueRef.current) valueRef.current.textContent = BILL_WITH_SOLAR;
      if (savedRef.current) savedRef.current.textContent = `$${savedAmount}`;
      if (barRef.current) barRef.current.style.width = `${percent}%`;
      if (badgeRef.current) badgeRef.current.textContent = `${percent}% lower`;
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section className="hero" id="hero" ref={heroRef}>
      <div className="hero__stage">

        <div className="hero__scene">
          {/* Illustrated placeholder scene. Sits behind your real photos, so it
              only shows until you add them below — no need to remove it. */}
          <svg
            className="hero__illustration"
            viewBox="0 0 1600 900"
            preserveAspectRatio="xMidYMax slice"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="skyDay" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FFE9C7" />
                <stop offset="55%" stopColor="#BFE3F5" />
                <stop offset="100%" stopColor="#7EC8E3" />
              </linearGradient>
              <linearGradient id="skyNight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#1B2A4A" />
                <stop offset="70%" stopColor="#0B1220" />
                <stop offset="100%" stopColor="#060911" />
              </linearGradient>
              <filter id="heroGlow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="10" />
              </filter>
            </defs>

            <rect width="1600" height="900" fill="url(#skyDay)" />
            <rect width="1600" height="900" fill="url(#skyNight)" style={{ opacity: 'var(--p)' }} />

            <g style={{ opacity: 'var(--p)' }} fill="#F7F5F0">
              <circle cx="220" cy="140" r="3" />
              <circle cx="360" cy="90" r="2.4" />
              <circle cx="480" cy="180" r="2" />
              <circle cx="1080" cy="110" r="2.6" />
              <circle cx="1220" cy="70" r="2" />
              <circle cx="1420" cy="150" r="3" />
            </g>

            <circle cx="300" cy="200" r="72" fill="#FFD37A" filter="url(#heroGlow)" style={{ opacity: 'calc(1 - var(--p))' }} />
            <circle cx="300" cy="200" r="50" fill="#FFE9B0" style={{ opacity: 'calc(1 - var(--p))' }} />

            <g style={{ opacity: 'var(--p)' }}>
              <circle cx="1310" cy="170" r="46" fill="#F3EFE4" />
              <circle cx="1328" cy="158" r="40" fill="url(#skyNight)" />
            </g>

            <path d="M0,700 C 350,660 750,730 1050,690 C 1300,660 1480,700 1600,680 L1600,900 L0,900 Z" fill="#1B283A" />
            <path
              d="M0,660 C 300,610 700,700 1000,650 C 1250,610 1450,660 1600,630 L1600,900 L0,900 Z"
              fill="#26364C"
              style={{ opacity: 'calc(0.55 + var(--p) * 0.25)' }}
            />

            {/* house */}
            <polygon points="860,540 1010,450 1160,540" fill="#1E2A3D" />
            <rect x="880" y="540" width="260" height="150" fill="#3C4A5E" />
            <rect x="985" y="620" width="50" height="70" fill="#16202E" />

            {/* ambient glow behind the lit house at night */}
            <rect x="880" y="545" width="280" height="160" fill="#FFD37A" filter="url(#heroGlow)" style={{ opacity: 'calc(var(--p) * 0.22)' }} />

            {/* windows: dim pane always visible, warm pane fades in with --p */}
            <rect x="905" y="565" width="46" height="46" fill="#243247" />
            <rect x="1070" y="565" width="46" height="46" fill="#243247" />
            <rect x="905" y="565" width="46" height="46" fill="#FFE9B0" style={{ opacity: 'var(--p)' }} />
            <rect x="1070" y="565" width="46" height="46" fill="#FFE9B0" style={{ opacity: 'var(--p)' }} />

            {/* solar panels on the roof slope, with a faint "producing" glow at night */}
            <g transform="translate(1010,450) rotate(23)">
              <rect x="-10" y="-6" width="170" height="70" rx="4" fill="#12324A" />
              <rect x="-10" y="-6" width="170" height="70" rx="4" fill="none" stroke="#3E6E8E" strokeWidth="2" />
              <line x1="46" y1="-6" x2="46" y2="64" stroke="#3E6E8E" strokeWidth="1.5" />
              <line x1="102" y1="-6" x2="102" y2="64" stroke="#3E6E8E" strokeWidth="1.5" />
              <line x1="-10" y1="15" x2="160" y2="15" stroke="#3E6E8E" strokeWidth="1.5" />
              <line x1="-10" y1="41" x2="160" y2="41" stroke="#3E6E8E" strokeWidth="1.5" />
              <rect x="-10" y="-6" width="170" height="70" rx="4" fill="#FFD37A" filter="url(#heroGlow)" style={{ opacity: 'calc(var(--p) * 0.2)' }} />
            </g>
          </svg>

          {/* These pull directly from the two imports at the top of this file. */}
          <div
            className="hero__image hero__image--day"
            style={{ backgroundImage: `url(${houseDay})` }}
          />
          <div
            className="hero__image hero__image--night"
            style={{ backgroundImage: `url(${houseNight})` }}
          />

          <div className="hero__scrim" aria-hidden="true" />

          {/* Painted above the scrim so the glow isn't muted. Roughly aligned to
              the illustration's roof panels → window — reposition once your real
              photo is in. */}
          <div className="hero__energy" ref={energyRef} aria-hidden="true">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>

        <div className="hero__content">
          <p className="hero__eyebrow">
            <span className="hero__crossfade hero__crossfade--day">
              NABCEP-certified installers · 6–8 week install
            </span>
            <span className="hero__crossfade hero__crossfade--night">
              Backed by a 25-year panel warranty
            </span>
          </p>

          <h1 className="hero__headline">
            <span className="hero__crossfade hero__crossfade--day">
              Your roof can pay your power bill.
            </span>
            <span className="hero__crossfade hero__crossfade--night">
              And keep paying it after dark.
            </span>
          </h1>

          <p className="hero__subhead">
            <span className="hero__crossfade hero__crossfade--day">
              A system sized to your actual usage, not a generic package — most homeowners
              cover 80–100% of their electricity from the roof alone.
            </span>
            <span className="hero__crossfade hero__crossfade--night">
              Battery storage banks the extra you made at noon and spends it on dinner,
              laundry, and everything else after sunset.
            </span>
          </p>

          <div className="hero__buttons">
            <a href="#quote" className="btn btn--primary">Get a free quote</a>
            <a href="#how-it-works" className="btn btn--ghost">See how it works</a>
          </div>

          <ul className="hero__trust">
            <li>4.9★ from 1,200+ installs</li>
            <li>25-year panel warranty</li>
            <li>0-cost, no-obligation quote</li>
          </ul>
        </div>

        <div className="savings-card">
          <p className="savings-card__label">Your electric bill</p>
          <p className="savings-card__value">
            <span ref={valueRef}>180</span>
            <span className="savings-card__unit">/mo</span>
          </p>
          <p className="savings-card__saved">
            Saving <strong ref={savedRef}>$0</strong>/mo with Solara
          </p>
          <div className="savings-card__bar-row">
            <span className="savings-card__icon savings-card__icon--sun" aria-hidden="true"></span>
            <div className="savings-card__bar">
              <div className="savings-card__bar-fill" ref={barRef} />
            </div>
            <span className="savings-card__icon savings-card__icon--moon" aria-hidden="true"></span>
          </div>
          <p className="savings-card__badge" ref={badgeRef}>0% lower</p>
          <p className="savings-card__footnote">Based on a 6kW system, avg. sun-hours for your area</p>
        </div>

        <div className="hero__scroll-cue" aria-hidden="true">
          <span>Scroll</span>
          <span className="hero__scroll-cue-line"></span>
        </div>

      </div>
    </section>
  );
}