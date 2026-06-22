import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp, ArrowLeft, ArrowRight, Navigation } from 'lucide-react';
import { AnimatedWaterDroplet, AnimatedToiletIcon, AnimatedMedicalCross, AnimatedShield, AnimatedBus, AnimatedAccessibility } from './AnimatedServiceIcons';

interface TopDirectionHUDProps {
  targetServiceSpot: { name: string; latitude: number; longitude: number; nearestNodeId: string } | null;
  bearing: number;
  pathDirection: 'left' | 'right' | 'arrived' | null;
  onCancel: () => void;
  distance: string;
  serviceIconName?: string;
}

export const TopDirectionHUD: React.FC<TopDirectionHUDProps> = ({
  targetServiceSpot,
  bearing,
  pathDirection,
  onCancel,
  distance,
  serviceIconName,
}) => {
  const getServiceIcon = () => {
    if (!serviceIconName) return <Navigation size={14} color="var(--tertiary)" />;
    const iconProps = { size: 14, color: 'var(--tertiary)' };
    switch (serviceIconName) {
      case 'Droplet': return <AnimatedWaterDroplet {...iconProps} />;
      case 'User': return <AnimatedToiletIcon {...iconProps} />;
      case 'Plus': return <AnimatedMedicalCross {...iconProps} />;
      case 'Shield': return <AnimatedShield {...iconProps} />;
      case 'Bus': return <AnimatedBus {...iconProps} />;
      case 'Accessibility': return <AnimatedAccessibility {...iconProps} />;
      default: return <Navigation size={14} color="var(--tertiary)" />;
    }
  };

  return (
    <AnimatePresence>
      {targetServiceSpot && (
        <motion.div
          className="top-direction-hud-container"
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <motion.div
            className="direction-indicator-card top-floating"
            style={{ padding: '16px', position: 'relative' }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {/* Left: Compass / Arrow */}
              <div 
                className="compass-icon-container" 
                style={{ 
                  width: '52px', 
                  height: '52px', 
                  flexShrink: 0,
                  background: 'rgba(16, 185, 129, 0.15)',
                  borderColor: 'rgba(16, 185, 129, 0.5)',
                  boxShadow: '0 0 20px rgba(16, 185, 129, 0.2)'
                }}
              >
                <motion.div
                  animate={{ rotate: bearing }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6ee7b7' }}
                  title={`Geographic Bearing: ${Math.round(bearing)}°`}
                >
                  <ArrowUp style={{ width: '28px', height: '28px', strokeWidth: 3 }} />
                </motion.div>
              </div>

              {/* Middle: Instructions & Target */}
              <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '4px' }}>
                <span style={{ 
                  fontSize: '16px', 
                  fontWeight: 700, 
                  color: '#ffffff',
                  lineHeight: 1.2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  {pathDirection === 'left' && <ArrowLeft size={16} color="var(--tertiary)" />}
                  {pathDirection === 'right' && <ArrowRight size={16} color="var(--tertiary)" />}
                  {pathDirection === 'left' ? 'Move Left' : pathDirection === 'right' ? 'Move Right' : 'Arrived!'}
                </span>
                
                <span style={{ 
                  fontSize: '12px', 
                  color: 'var(--on-surface-variant)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  overflow: 'hidden'
                }}>
                  Towards <strong style={{ color: 'var(--on-surface)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    {getServiceIcon()} {targetServiceSpot.name}
                  </strong>
                </span>
                
                <span style={{ fontSize: '10px', color: 'rgba(218, 226, 253, 0.4)' }}>
                  GPS: {Math.round(bearing)}° on Grand Road
                </span>
              </div>

              {/* Right: Distance Badge (Wrapped securely) */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(255, 122, 0, 0.15), rgba(229, 57, 53, 0.1))',
                border: '1px solid rgba(255, 122, 0, 0.3)',
                borderRadius: 'var(--radius-md)',
                padding: '8px 12px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '64px',
                boxShadow: '0 4px 12px rgba(255, 122, 0, 0.1)',
                flexShrink: 0
              }}>
                <span style={{ 
                  fontSize: '20px', 
                  fontWeight: 800, 
                  color: 'var(--primary)',
                  lineHeight: 1,
                  whiteSpace: 'nowrap'
                }}>
                  {distance.replace(/[^0-9.]/g, '')}
                </span>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: 700, 
                  color: 'var(--tertiary)', 
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  marginTop: '2px'
                }}>
                  {distance.replace(/[0-9.\s]/g, '') || 'M'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
