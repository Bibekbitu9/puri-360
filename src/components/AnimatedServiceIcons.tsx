import React from 'react';
import { motion } from 'framer-motion';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export const AnimatedWaterDroplet: React.FC<IconProps> = ({ size = 24, color = '#3b82f6', className }) => (
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
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      filter: `drop-shadow(0 2px 8px ${color}60)`
    }}
  >
    <path d="M17 2H7l1.5 17h7L17 2z" className="svg-fill-target" />
    <path d="M7.7 9h8.6" opacity="0.7" />
  </motion.svg>
);

export const AnimatedToiletIcon: React.FC<IconProps> = ({ size = 24, color = '#10b981', className }) => (
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
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
    style={{
      filter: `drop-shadow(0 2px 8px ${color}60)`
    }}
  >
    {/* Man (Left) */}
    <circle cx="8" cy="5" r="2" className="svg-fill-target" />
    <path d="M8 8c-1.1 0-2 .9-2 2v5h1v5h2v-5h1v-5c0-1.1-.9-2-2-2z" className="svg-fill-target" />
    
    {/* Woman (Right) */}
    <circle cx="16" cy="5" r="2" className="svg-fill-target" />
    <path d="M16 8c-1.1 0-2 .9-2 2l-1.5 6h7l-1.5-6c0-1.1-.9-2-2-2z" className="svg-fill-target" />
    <path d="M15 16v4h2v-4" className="svg-fill-target" />
  </motion.svg>
);

export const AnimatedMedicalCross: React.FC<IconProps> = ({ size = 24, color = '#facc15', className }) => (
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
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
    style={{
      filter: `drop-shadow(0 2px 8px ${color}60)`
    }}
  >
    <rect x="3" y="6" width="18" height="14" rx="2" className="svg-fill-target" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    <path d="M12 10v6M9 13h6" strokeWidth="2.5" />
  </motion.svg>
);

export const AnimatedShield: React.FC<IconProps> = ({ size = 24, color = '#ef4444', className }) => (
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
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
    style={{
      filter: `drop-shadow(0 2px 8px ${color}60)`
    }}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="svg-fill-target" />
    <polygon points="12 8 13.5 11 16.8 11.2 14.2 13.3 15.1 16.5 12 14.7 8.9 16.5 9.8 13.3 7.2 11.2 10.5 11" fill={color} />
  </motion.svg>
);

export const AnimatedParking: React.FC<IconProps> = ({ size = 24, color = '#f97316', className }) => (
  <motion.svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
    style={{
      filter: `drop-shadow(0 2px 8px ${color}60)`
    }}
  >
    <path d="M9 20V4h5.5a4.5 4.5 0 0 1 0 9H9" className="svg-fill-target" />
  </motion.svg>
);

export const AnimatedBus: React.FC<IconProps> = ({ size = 24, color = '#a78bfa', className }) => (
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
    animate={{ y: [0, -4, 0] }}
    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay: 1.0 }}
    style={{
      filter: `drop-shadow(0 2px 8px ${color}60)`
    }}
  >
    <rect x="4" y="4" width="16" height="15" rx="2" className="svg-fill-target" />
    <path d="M4 11h16M8 4v7M16 4v7" />
    <circle cx="7" cy="15" r="1" fill={color} />
    <circle cx="17" cy="15" r="1" fill={color} />
    <path d="M6 19v2M18 19v2" strokeWidth="2.5" />
  </motion.svg>
);
