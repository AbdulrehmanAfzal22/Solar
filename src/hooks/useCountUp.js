import { useEffect, useRef, useState } from 'react';

// Ease-out cubic — fast at first, settles near the end, matches the
// blueprint's "not linear, not slot-machine" spec for premium numbers.
function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Counts a number up from 0 to `target` once the returned ref scrolls
 * into view. Re-target (e.g. a calculator result changing) re-runs the
 * animation from the current displayed value, not from 0, so live
 * updates feel like a smooth interpolation rather than a reset.
 *
 * Returns `[ref, value, done]` — `done` flips to `true` for the render
 * where the animation lands on its target (useful for a one-shot "arrived"
 * effect like Stats' landing pulse) and back to `false` as soon as a new
 * target starts the count moving again. Existing callers destructuring
 * only `[ref, value]` are unaffected.
 *
 * @param {number} target - the value to land on
 * @param {number} duration - ms, defaults to 1600 per the blueprint's 1.4–1.8s spec
 */
export default function useCountUp(target, duration = 1600) {
  const ref = useRef(null);
  const [value, setValue] = useState(0);
  const [done, setDone] = useState(false);
  const hasStarted = useRef(false);
  const currentRef = useRef(0); // tracks the live value without triggering re-renders
  const rafRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      currentRef.current = target;
      setDone(true);
      return;
    }

    function run(from, to) {
      cancelAnimationFrame(rafRef.current);
      setDone(false);
      const start = performance.now();
      function tick(now) {
        const t = Math.min(1, (now - start) / duration);
        const next = from + (to - from) * easeOutCubic(t);
        currentRef.current = next;
        setValue(next);
        if (t < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          setDone(true);
        }
      }
      rafRef.current = requestAnimationFrame(tick);
    }

    if (!hasStarted.current) {
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasStarted.current) {
            hasStarted.current = true;
            run(0, target);
            observer.disconnect();
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    } else {
      // Already visible once — a changed target (calculator input) animates
      // smoothly from the currently-displayed value instead of resetting.
      run(currentRef.current, target);
    }

    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return [ref, value, done];
}
