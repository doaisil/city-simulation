import { useState, useEffect, useRef } from 'react';

export function useAnimatedCounter(
  target: number,
  duration: number = 1500,
  enabled: boolean = true,
): number {
  const [value, setValue] = useState(target);
  const prevTarget = useRef(target);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!enabled) {
      setValue(target);
      prevTarget.current = target;
      return;
    }

    const from = prevTarget.current;
    const to = target;
    prevTarget.current = target;

    if (from === to) return;

    const start = performance.now();

    const animate = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = from + (to - from) * eased;
      setValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration, enabled]);

  return value;
}
