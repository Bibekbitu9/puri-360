import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CornerUpLeft, CornerUpRight } from 'lucide-react';

interface TopDirectionHUDProps {
  targetServiceSpot: { name: string; latitude: number; longitude: number; nearestNodeId: string } | null;
  bearing: number;
  pathDirection: 'left' | 'right' | 'arrived' | null;
  onCancel?: () => void;
  distance: string;
  serviceIconName?: string;
  roadName: string;
}

// Utility to check if geocoded name is a clean street name rather than a raw camera file name or node id
const isCleanRoadName = (name: string): boolean => {
  if (!name) return false;
  const lower = name.toLowerCase();
  return !(
    lower.includes('dcim') ||
    lower.includes('camera') ||
    lower.includes('img_') ||
    lower.includes('.ins') ||
    lower.includes('.jpg') ||
    lower.includes('.png') ||
    lower.includes('node')
  );
};

export const TopDirectionHUD: React.FC<TopDirectionHUDProps> = ({
  targetServiceSpot,
  pathDirection,
  distance,
  roadName,
}) => {
  const targetName = targetServiceSpot
    ? targetServiceSpot.name.replace(/\s*\(Spot\s+\d+\)/i, '').trim()
    : 'destination';

  const hasCleanRoad = isCleanRoadName(roadName);

  const getInstructionText = () => {
    if (pathDirection === 'arrived') {
      return 'Arrived at destination!';
    }

    const direction = pathDirection === 'left' ? 'left' : 'right';

    if (hasCleanRoad) {
      return `Move ${direction} on ${roadName} for ${distance}`;
    } else {
      return `Move ${direction} on the road for ${distance} to reach nearest ${targetName}`;
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
          style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 30,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            pointerEvents: 'none'
          }}
        >
          {/* HUD Capsule Box containing all information inside it */}
          <motion.div
            className="direction-indicator-card top-floating"
            style={{
              padding: '8px 12px',
              position: 'relative',
              width: '100%',
              borderRadius: '24px',
              pointerEvents: 'auto',
              boxShadow: '0 8px 20px rgba(0, 0, 0, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>


              {/* Middle: Turn arrow + dark instruction text */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                flex: 1,
                minWidth: 0,
                justifyContent: 'center'
              }}>
                {pathDirection === 'left' && (
                  <motion.div animate={{ x: [2, -4, 2] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} style={{ display: 'inline-flex', flexShrink: 0 }}>
                    <CornerUpLeft size={20} color="#0b1326" style={{ strokeWidth: 3.5 }} />
                  </motion.div>
                )}
                {pathDirection === 'right' && (
                  <motion.div animate={{ x: [-2, 4, -2] }} transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }} style={{ display: 'inline-flex', flexShrink: 0 }}>
                    <CornerUpRight size={20} color="#0b1326" style={{ strokeWidth: 3.5 }} />
                  </motion.div>
                )}
                <span style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#0b1326',
                  lineHeight: 1.2,
                  whiteSpace: 'normal',
                  textAlign: 'center',
                  overflow: 'hidden'
                }}>
                  {getInstructionText()}
                </span>
              </div>

              {/* Vertical divider line */}
              <div style={{ width: '1px', height: '18px', background: 'rgba(11, 19, 38, 0.2)', flexShrink: 0 }} />

              {/* Right: Distance badge */}
              <div style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: '3px',
                flexShrink: 0
              }}>
                <span style={{
                  fontSize: '16px',
                  fontWeight: 800,
                  color: '#0b1326',
                  lineHeight: 1,
                  whiteSpace: 'nowrap'
                }}>
                  {distance.replace(/[^0-9.]/g, '')}
                </span>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  color: '#4c1a00',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
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
