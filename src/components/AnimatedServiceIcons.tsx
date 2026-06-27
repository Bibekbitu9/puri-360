import React from 'react';
import { motion } from 'framer-motion';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const AnimatedWaterDroplet: React.FC<IconProps> = ({ size = 24, color = '#ffffff', className }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    animate={{ y: [0, -3, 0], scale: [1, 1.05, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    <motion.path 
      d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"
      fill={color}
      initial={{ opacity: 0.1, scale: 0.8 }}
      animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 0.95, 0.8] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
  </motion.svg>
);

export const AnimatedToiletIcon: React.FC<IconProps> = ({ size = 24, color = '#ffffff', className }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    animate={{ rotate: [-3, 3, -3] }}
    transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
    <motion.circle 
      cx="12" cy="7" r="4" fill={color}
      animate={{ opacity: [0, 0.5, 0] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
  </motion.svg>
);

export const AnimatedMedicalCross: React.FC<IconProps> = ({ size = 24, color = '#ffffff', className }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    animate={{ scale: [1, 1.15, 1] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
  >
    <path d="M12 5v14M5 12h14" strokeWidth="3" />
    <motion.circle 
      cx="12" cy="12" r="10" strokeWidth="2" stroke={color}
      animate={{ opacity: [0, 0.8, 0], scale: [0.8, 1.2, 1.4] }}
      transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
    />
  </motion.svg>
);

export const AnimatedShield: React.FC<IconProps> = ({ size = 24, color = '#ffffff', className }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <motion.path 
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
      animate={{ opacity: [0.8, 1, 0.8], fill: [color + '00', color + '40', color + '00'] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    />
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </motion.svg>
);

export const AnimatedBus: React.FC<IconProps> = ({ size = 24, color = '#ffffff', className }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    animate={{ x: [-2, 2, -2], y: [0, -1, 0] }}
    transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
  >
    <path d="M8 6v6M15 6v6M2 12h19.6M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-1.4-5C20.1 6.8 19.1 6 18 6H4a2 2 0 0 0-2 2v10h3" />
    <circle cx="7" cy="18" r="2" />
    <path d="M9 18h5" />
    <circle cx="16" cy="18" r="2" />
  </motion.svg>
);

export const AnimatedAccessibility: React.FC<IconProps> = ({ size = 24, color = '#ffffff', className }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    animate={{ y: [-2, 2, -2] }}
    transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
  >
    <circle cx="16" cy="4" r="1" />
    <path d="m18 19 1-7-6 1" />
    <path d="m5 8 3-3 5.5 3-2.36 3.5" />
    <path d="M4.24 14.5a5 5 0 0 0 6.88 6" />
    <path d="M13.76 17.5a5 5 0 0 0-6.88-6" />
  </motion.svg>
);

export const AnimatedParking: React.FC<IconProps> = ({ size = 24, color = '#ffffff', className }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    animate={{ scale: [1, 1.08, 1] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
    <path d="M9 17V7h4a3 3 0 0 1 0 6H9" strokeWidth="2" />
  </motion.svg>
);
