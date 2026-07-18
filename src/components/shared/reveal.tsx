"use client";

import { motion } from "framer-motion";

interface RevealItemProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  amount?: number;
  y?: number;
}

export function RevealItem({
  children,
  delay = 0,
  className,
  amount = 0.2,
  y = 20,
}: RevealItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}