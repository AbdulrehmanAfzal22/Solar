import { useEffect, useRef, useState } from 'react';
import './OrbitMedallion.css';

// A floating, softly-animated centerpiece — glow pulse, two counter-
// rotating rings, three dots orbiting on tilted elliptical paths, and a
// topic icon at the core. Built to fill the dead space beside narrow text
// columns on wide viewports without competing with the copy (it's tucked
// behind it, low-key gold, always moving).
//
// The core icon transitions whenever the `Icon` prop changes — callers
// that pass a fixed icon see no difference; callers that pass a changing
// icon (Faq's open row, InstallationProcess's active step) get a scale +
// rotate swap with a synced glow flash instead of a hard cut.
export default function OrbitMedallion({ Icon, className = '' }) {
  const [displayIcon, setDisplayIcon] = useState(() => Icon);
  const [visible, setVisible] = useState(true);
  const [flashId, setFlashId] = useState(0);
  const prevIconRef = useRef(Icon);

  // Icon changed — start the fade/scale-out. Deferred a frame (rather than
  // called synchronously in the effect body) purely so this isn't a
  // synchronous setState-in-effect; the visible timing is unaffected.
  // Comparing against a ref that stores the actual last-seen value (rather
  // than a one-shot "is this the first run" flag) keeps this idempotent
  // under StrictMode's double-invoked mount effects.
  useEffect(() => {
    if (prevIconRef.current === Icon) return undefined;
    prevIconRef.current = Icon;
    const frame = requestAnimationFrame(() => setVisible(false));
    return () => cancelAnimationFrame(frame);
  }, [Icon]);

  // Once faded out, swap to the new icon, fade/scale back in, and fire a
  // glow flash timed to the exact moment of the swap.
  useEffect(() => {
    if (visible) return undefined;
    const swap = setTimeout(() => {
      setDisplayIcon(() => Icon);
      setVisible(true);
      setFlashId((id) => id + 1);
    }, 100);
    return () => clearTimeout(swap);
  }, [Icon, visible]);

  const CurrentIcon = displayIcon;

  return (
    <div className={`orbit-medallion ${className}`} aria-hidden="true">
      <span className="orbit-medallion__glow" />
      <span className="orbit-medallion__ring orbit-medallion__ring--outer" />
      <span className="orbit-medallion__ring orbit-medallion__ring--inner" />

      <span className="orbit-medallion__orbit orbit-medallion__orbit--1">
        <span className="orbit-medallion__satellite orbit-medallion__satellite--1">
          <span className="orbit-medallion__dot" />
        </span>
      </span>
      <span className="orbit-medallion__orbit orbit-medallion__orbit--2">
        <span className="orbit-medallion__satellite orbit-medallion__satellite--2">
          <span className="orbit-medallion__dot" />
        </span>
      </span>
      <span className="orbit-medallion__orbit orbit-medallion__orbit--3">
        <span className="orbit-medallion__satellite orbit-medallion__satellite--3">
          <span className="orbit-medallion__dot" />
        </span>
      </span>

      <span className="orbit-medallion__core">
        {flashId > 0 && <span className="orbit-medallion__flash" key={flashId} />}
        <CurrentIcon className={`orbit-medallion__icon ${visible ? 'is-visible' : ''}`} />
      </span>
    </div>
  );
}
