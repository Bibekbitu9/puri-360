import React from 'react';
import { motion } from 'framer-motion';

export const AnimatedChakra: React.FC<{ size?: number }> = ({ size = 80 }) => {
  return (
    <div className="chakra-container">
      {/* Outer glow ring */}
      <motion.div
        className="chakra-glow"
        animate={{
          boxShadow: [
            '0 0 20px rgba(255, 122, 0, 0.3), 0 0 40px rgba(255, 122, 0, 0.1)',
            '0 0 30px rgba(255, 122, 0, 0.5), 0 0 60px rgba(255, 122, 0, 0.2)',
            '0 0 20px rgba(255, 122, 0, 0.3), 0 0 40px rgba(255, 122, 0, 0.1)',
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      {/* Rotating Chakra SVG */}
      <motion.svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="chakra-svg"
      >
        {/* Outer ring */}
        <circle cx="60" cy="60" r="55" stroke="url(#chakraGrad)" strokeWidth="3" fill="none" />
        <circle cx="60" cy="60" r="48" stroke="url(#chakraGrad)" strokeWidth="1.5" fill="none" opacity="0.5" />

        {/* Spokes — 16 rays */}
        {Array.from({ length: 16 }).map((_, i) => {
          const angle = (i * 360) / 16;
          const rad = (angle * Math.PI) / 180;
          const x1 = 60 + 18 * Math.cos(rad);
          const y1 = 60 + 18 * Math.sin(rad);
          const x2 = 60 + 48 * Math.cos(rad);
          const y2 = 60 + 48 * Math.sin(rad);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="url(#chakraGrad)"
              strokeWidth={i % 2 === 0 ? '2' : '1'}
              opacity={i % 2 === 0 ? 1 : 0.5}
            />
          );
        })}

        {/* Decorative arcs between spokes */}
        {Array.from({ length: 16 }).map((_, i) => {
          const startAngle = (i * 360) / 16 + 5;
          const endAngle = ((i + 1) * 360) / 16 - 5;
          const startRad = (startAngle * Math.PI) / 180;
          const endRad = (endAngle * Math.PI) / 180;
          const r = 38;
          const x1 = 60 + r * Math.cos(startRad);
          const y1 = 60 + r * Math.sin(startRad);
          const x2 = 60 + r * Math.cos(endRad);
          const y2 = 60 + r * Math.sin(endRad);
          return (
            <path
              key={`arc-${i}`}
              d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
              stroke="#fabd00"
              strokeWidth="1"
              fill="none"
              opacity="0.4"
            />
          );
        })}

        {/* Inner hub circle */}
        <circle cx="60" cy="60" r="15" fill="url(#hubGrad)" stroke="#fabd00" strokeWidth="1.5" />

        {/* Center dot */}
        <circle cx="60" cy="60" r="4" fill="#fabd00" />

        {/* Gradient definitions */}
        <defs>
          <linearGradient id="chakraGrad" x1="0" y1="0" x2="120" y2="120">
            <stop offset="0%" stopColor="#ff7a00" />
            <stop offset="50%" stopColor="#fabd00" />
            <stop offset="100%" stopColor="#ff7a00" />
          </linearGradient>
          <radialGradient id="hubGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(250, 189, 0, 0.3)" />
            <stop offset="100%" stopColor="rgba(255, 122, 0, 0.1)" />
          </radialGradient>
        </defs>
      </motion.svg>
    </div>
  );
};
