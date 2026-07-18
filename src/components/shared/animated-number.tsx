"use client";

import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

interface AnimatedNumberProps {
  value: string;
  className?: string;
  duration?: number;
}

export function AnimatedNumber({
  value,
  className,
  duration = 1.4,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  const match = value.match(/(\d+(?:\.\d+)?)/);
  const numericTarget = match ? parseFloat(match[1]) : null;
  const suffix = match ? value.slice(match.index! + match[0].length) : "";
  const prefix = match ? value.slice(0, match.index!) : value;

  useEffect(() => {
    if (!ref.current || numericTarget === null) return;
    if (!inView) {
      if (ref.current) ref.current.textContent = value;
      return;
    }
    if (reduce) {
      if (ref.current) ref.current.textContent = value;
      return;
    }

    const controls = animate(0, numericTarget, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        if (!ref.current) return;
        const isFloat = !Number.isInteger(numericTarget);
        const formatted = isFloat ? v.toFixed(1) : Math.round(v).toString();
        ref.current.textContent = `${prefix}${formatted}${suffix}`;
      },
    });
    return () => controls.stop();
  }, [inView, reduce, numericTarget, prefix, suffix, value, duration]);

  return (
    <span ref={ref} className={className}>
      {reduce ? value : `0${suffix}`}
    </span>
  );
}