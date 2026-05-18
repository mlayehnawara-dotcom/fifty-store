import { useEffect, useMemo, useState } from 'react';

interface FloatingParticlesProps {
  count?: number;
  className?: string;
}

export default function FloatingParticles({ count = 22, className = '' }: FloatingParticlesProps) {
  const [effectiveCount, setEffectiveCount] = useState(count);

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarsePointer = window.matchMedia('(pointer: coarse)').matches;

    if (reduceMotion) {
      setEffectiveCount(0);
      return;
    }

    // Mobile gets fewer particles to keep frame pacing stable.
    setEffectiveCount(coarsePointer ? Math.max(6, Math.round(count / 2)) : count);
  }, [count]);

  const particles = useMemo(
    () =>
      Array.from({ length: effectiveCount }).map((_, index) => ({
        id: `particle-${index}`,
        size: 2 + ((index * 13) % 8),
        left: (index * 17) % 100,
        delay: ((index * 3) % 12) / 2,
        duration: 6 + ((index * 11) % 10),
        opacity: 0.18 + ((index * 7) % 22) / 100,
      })),
    [effectiveCount],
  );

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="floating-particle"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            opacity: particle.opacity,
          }}
        />
      ))}
    </div>
  );
}
