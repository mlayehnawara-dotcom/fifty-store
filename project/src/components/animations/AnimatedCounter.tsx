import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface AnimatedCounterProps {
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export default function AnimatedCounter({ to, duration = 1.6, suffix = '', className = '' }: AnimatedCounterProps) {
  const elementRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const value = { current: 0 };

    const tween = gsap.to(value, {
      current: to,
      duration,
      ease: 'power2.out',
      onUpdate: () => {
        if (!elementRef.current) return;
        elementRef.current.textContent = `${Math.round(value.current)}${suffix}`;
      },
    });

    return () => {
      tween.kill();
    };
  }, [to, duration, suffix]);

  return <span ref={elementRef} className={className}>{`0${suffix}`}</span>;
}
