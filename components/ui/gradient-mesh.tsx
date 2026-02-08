"use client";

import { motion } from "framer-motion";

export function GradientMesh({ className = '' }: { className?: string }) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Blue orb */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.07]"
        style={{ background: 'radial-gradient(circle, #3b82f6, transparent 70%)' }}
      />
      {/* Green orb */}
      <motion.div
        animate={{
          x: [0, -80, 60, 0],
          y: [0, 60, -100, 0],
          scale: [1, 0.9, 1.1, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(circle, #10b981, transparent 70%)' }}
      />
      {/* Cyan accent */}
      <motion.div
        animate={{
          x: [0, 50, -30, 0],
          y: [0, -40, 80, 0],
          scale: [1, 1.1, 0.95, 1],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.04]"
        style={{ background: 'radial-gradient(ellipse, #06b6d4, transparent 70%)' }}
      />
    </div>
  );
}
