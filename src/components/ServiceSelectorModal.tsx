import React, { useEffect } from 'react';
import { X, Droplet, User, Plus, Shield, Bus, Accessibility } from 'lucide-react';

export interface ServiceOption {
  id: string;
  title: string;
  iconName: 'Droplet' | 'User' | 'Plus' | 'Shield' | 'Bus' | 'Accessibility';
  className: string;
}

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    id: 'drinking_water',
    title: 'Drinking Water',
    iconName: 'Droplet',
    className: 'water',
  },
  {
    id: 'toilets',
    title: 'Toilets / Rest Zones',
    iconName: 'User',
    className: 'toilets',
  },
  {
    id: 'medical_help_centre',
    title: 'Medical Help Centre',
    iconName: 'Plus',
    className: 'aid',
  },
  {
    id: 'fire_centre',
    title: 'Fire Station Help',
    iconName: 'Shield',
    className: 'police',
  },
  {
    id: 'connectivity',
    title: 'Connectivity',
    iconName: 'Bus',
    className: 'connectivity',
  },
  {
    id: 'elderly',
    title: 'Elderly & Special Assistance',
    iconName: 'Accessibility',
    className: 'elderly',
  },
];

interface ServiceSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (service: ServiceOption) => void;
}

// Temple Shikhara SVG outline
const TempleShikhara: React.FC = () => (
  <svg viewBox="0 0 100 120" width="54" height="65" fill="#fef08a" style={{ opacity: 0.8 }} aria-hidden="true">
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
  <svg viewBox="0 0 100 80" width="48" height="38" fill="#fef08a" style={{ opacity: 0.85 }} aria-hidden="true">
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

  if (!isOpen) return null;

  const getIcon = (iconName: string) => {
    const iconProps = { size: 28, color: '#ffffff' };
    switch (iconName) {
      case 'Droplet':
        return <Droplet {...iconProps} />;
      case 'User':
        return <User {...iconProps} />;
      case 'Plus':
        return <Plus {...iconProps} strokeWidth={3} />;
      case 'Shield':
        return <Shield {...iconProps} />;
      case 'Bus':
        return <Bus {...iconProps} />;
      case 'Accessibility':
        return <Accessibility {...iconProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="service-modal-overlay" onClick={onClose}>
      <div className="service-modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="service-modal-close" onClick={onClose} aria-label="Close Selector">
          <X size={18} />
        </button>

        {/* Decorative Top Shikharas */}
        <div className="service-modal-decor-top">
          <TempleShikhara />
          <TempleShikhara />
        </div>

        {/* Modal Header */}
        <div className="service-modal-title-container">
          <h2 className="service-modal-title">Select Your Service</h2>
          <div className="service-modal-divider">
            <span className="divine-symbol" style={{ fontSize: '1.25rem' }}>☸</span>
          </div>
          <p className="service-modal-subtitle">Choose a category to explore nearest locations</p>
        </div>

        {/* Options Grid */}
        <div className="service-modal-grid">
          {SERVICE_OPTIONS.map((option) => (
            <div
              key={option.id}
              className="service-card"
              onClick={() => onSelectService(option)}
            >
              <div className={`service-icon-circle ${option.className}`}>
                {getIcon(option.iconName)}
              </div>
              <span className="service-card-title">{option.title}</span>
            </div>
          ))}
        </div>

        {/* Decorative Bottom Lotus Flowers */}
        <div className="service-modal-decor-bottom">
          <LotusFlower />
          <LotusFlower />
        </div>
      </div>
    </div>
  );
};
