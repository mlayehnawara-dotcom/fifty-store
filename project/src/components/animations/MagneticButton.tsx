import { useRef } from 'react';
import type { MouseEvent, PropsWithChildren } from 'react';

interface MagneticButtonProps extends PropsWithChildren {
  className?: string;
}

export default function MagneticButton({ className = '', children }: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  const onMove = (event: MouseEvent<HTMLDivElement>) => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;

    node.style.transform = `translate(${x * 0.12}px, ${y * 0.16}px)`;
  };

  const onLeave = () => {
    const node = ref.current;
    if (!node) return;
    node.style.transform = 'translate(0px, 0px)';
  };

  return (
    <div
      ref={ref}
      className={`magnetic-wrapper transition-transform duration-300 ease-out ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}
