import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { X } from 'lucide-react';

import { AnimatedWaterDroplet, AnimatedToiletIcon, AnimatedMedicalCross, AnimatedShield, AnimatedBus, AnimatedParking } from './AnimatedServiceIcons';

export interface ServiceOption {
  id: string;
  title: string;
  iconName: 'Droplet' | 'User' | 'Plus' | 'Shield' | 'Bus' | 'Parking';
  className: string;
}

const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'drinking_water',
    title: 'Drinking Water',
    iconName: 'Droplet',
    className: 'water',
  },
  {
    id: 'toilets',
    title: 'Toilets',
    iconName: 'User',
    className: 'toilets',
  },
  {
    id: 'medical_help_centre',
    title: 'Medical Help',
    iconName: 'Plus',
    className: 'aid',
  },
  {
    id: 'police_centre',
    title: 'Police',
    iconName: 'Shield',
    className: 'police',
  },
  {
    id: 'parking',
    title: 'Parking',
    iconName: 'Parking',
    className: 'parking',
  },
  {
    id: 'transport',
    title: 'Transport',
    iconName: 'Bus',
    className: 'transport',
  },
];

interface ServiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: ServiceOption) => void;
}

// Temple Shikhara SVG outline
const TempleShikhara: React.FC = () => (
  <svg viewBox="0 0 100 120" width="48" height="58" fill="var(--tertiary)" style={{ opacity: 0.6 }} aria-hidden="true">
    {/* Flag / Dhvaja */}
    <path d="M 50 15 L 50 3 L 68 8 Z" />
    {/* Amalaka / Kalasha */}
    <circle cx="50" cy="18" r="4.5" />
    <ellipse cx="50" cy="22" rx="7" ry="2.5" />
    {/* Main Shikhara Body */}
    <path d="M 50 24 Q 45 42, 41 58 Q 35 85, 28 112 L 72 112 Q 65 85, 59 58 Q 55 42, 50 24 Z" />
    {/* Base lines / steps */}
    <rect x="23" y="112" width="54" height="4" rx="1" />
    <rect x="18" y="116" width="64" height="4" rx="1" />
  </svg>
);

// Lotus Flower SVG outline
const LotusFlower: React.FC = () => (
  <svg viewBox="0 0 100 80" width="42" height="34" fill="var(--tertiary)" style={{ opacity: 0.6 }} aria-hidden="true">
    {/* Center Petal */}
    <path d="M 50 10 C 40 35, 40 60, 50 75 C 60 60, 60 35, 50 10 Z" />
    {/* Inner Left Petal */}
    <path d="M 50 25 C 30 45, 25 65, 40 75 C 50 70, 50 55, 50 25 Z" />
    {/* Inner Right Petal */}
    <path d="M 50 25 C 50 55, 50 70, 60 75 C 75 65, 70 45, 50 25 Z" />
    {/* Outer Left Petal */}
    <path d="M 50 40 C 20 55, 10 70, 30 78 C 45 75, 48 65, 50 40 Z" />
    {/* Outer Right Petal */}
    <path d="M 50 40 C 50 65, 55 75, 70 78 C 90 70, 80 55, 50 40 Z" />
    {/* Bottom base / stem */}
    <path d="M 35 78 Q 50 82, 65 78 Q 50 74, 35 78 Z" />
  </svg>
);

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.15 + i * 0.06,
      type: 'spring' as const,
      stiffness: 300,
      damping: 24,
    },
  }),
};

export const ServiceSelectorModal: React.FC<ServiceSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const getIcon = (iconName: string, size = 28) => {
    const iconProps = { size, color: '#ffffff' };
    switch (iconName) {
      case 'Droplet':
        return <AnimatedWaterDroplet {...iconProps} />;
      case 'User':
        return <AnimatedToiletIcon {...iconProps} />;
      case 'Plus':
        return <AnimatedMedicalCross {...iconProps} />;
      case 'Shield':
        return <AnimatedShield {...iconProps} />;
      case 'Bus':
        return <AnimatedBus {...iconProps} />;
      case 'Parking':
        return <AnimatedParking {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="service-modal-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div
            className="service-modal-container"
            onClick={(e) => e.stopPropagation()}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close Button */}
            <motion.button
              className="service-modal-close"
              onClick={onClose}
              aria-label="Close Selector"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={16} />
            </motion.button>

            {/* Decorative Top Shikharas */}
            <motion.div
              className="service-modal-decor-top"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              <TempleShikhara />
              <TempleShikhara />
            </motion.div>

            {/* Modal Header */}
            <motion.div
              className="service-modal-title-container"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.35 }}
            >
              <h2 className="service-modal-title">Select Your Service</h2>
              <div className="service-modal-divider">
                <span className="divine-symbol" style={{ fontSize: '1.15rem' }}>☸</span>
              </div>
              <p className="service-modal-subtitle">Choose a category to explore nearest locations</p>
            </motion.div>

            {/* Options Grid */}
            <div className="service-modal-grid">
              {SERVICE_OPTIONS.map((option, index) => (
                <motion.div
                  key={option.id}
                  className="service-card"
                  onClick={() => onSelectService(option)}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={cardVariants}
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <motion.div
                    className={`service-icon-circle ${option.className}`}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  >
                    {getIcon(option.iconName)}
                  </motion.div>
                  <span className="service-card-title">{option.title}</span>
                </motion.div>
              ))}
            </div>

            {/* Decorative Bottom Lotus Flowers */}
            <motion.div
              className="service-modal-decor-bottom"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 0.7, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <LotusFlower />
              <LotusFlower />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
