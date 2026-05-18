import { motion, type MotionProps } from 'framer-motion';
import type { PropsWithChildren } from 'react';

interface RevealProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  once?: boolean;
  y?: number;
  motionProps?: MotionProps;
}

export default function Reveal({
  children,
  className,
  delay = 0,
  once = true,
  y = 22,
  motionProps,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.2 }}
      transition={{ duration: 0.72, delay, ease: [0.16, 0.82, 0.3, 1] }}
      className={className}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
}
