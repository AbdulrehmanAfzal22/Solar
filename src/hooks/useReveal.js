import { useEffect, useRef, useState } from 'react';

/**
 * Attach the returned ref to any element and it fades/rises into place
 * once it's ~20% into the viewport. Fires once (won't re-trigger on
 * scroll back up — re-triggering reads as buggy, not premium, same
 * reasoning the blueprint calls out for the Statistics counters).
 *
 * Usage:
 *   const [ref, isIn] = useReveal();
 *   <div ref={ref} className={`reveal ${isIn ? 'is-in' : ''}`}>...</div>
 *
 * @param {number} threshold - fraction of the element visible before firing
 */
export default function useReveal(threshold = 0.2) {
  const ref = useRef(null);
  const [isIn, setIsIn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsIn(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIn(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isIn];
}
