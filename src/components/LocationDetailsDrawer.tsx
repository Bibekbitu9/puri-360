import React from 'react';
import { motion } from 'framer-motion';
import { X, RefreshCw, Compass, MapPin, Activity, Clock } from 'lucide-react';
import type { LocationData } from '../types/geolocation';

interface LocationDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData;
  onRefresh: () => void;
  loading: boolean;
}

const dataItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.3 },
  }),
};

export const LocationDetailsDrawer: React.FC<LocationDetailsDrawerProps> = ({
  isOpen,
  onClose,
  location,
  onRefresh,
  loading,
}) => {
  if (!isOpen) return null;

  const formatCoordinate = (val: number | null): string => {
    if (val === null) return 'N/A';
    return val.toFixed(6);
  };

  const formatTimestamp = (ts: number | null): string => {
    if (!ts) return 'N/A';
    return new Date(ts).toLocaleTimeString();
  };

  const dataItems = [
    { icon: <MapPin size={14} />, label: 'Latitude', value: `${formatCoordinate(location.latitude)}°` },
    { icon: <MapPin size={14} />, label: 'Longitude', value: `${formatCoordinate(location.longitude)}°` },
    { icon: <Activity size={14} />, label: 'Accuracy', value: location.accuracy ? `${Math.round(location.accuracy)} meters` : 'N/A' },
    { icon: <Clock size={14} />, label: 'Last Updated', value: formatTimestamp(location.timestamp) },
  ];

  return (
    <>
      <motion.div
        className="drawer-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      />
      <motion.div
        className="details-drawer"
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <motion.div
              animate={loading ? { rotate: 360 } : {}}
              transition={loading ? { duration: 1, repeat: Infinity, ease: 'linear' } : {}}
              style={{ display: 'flex', color: 'var(--primary-container)' }}
            >
              <Compass size={20} />
            </motion.div>
            <h2 className="drawer-title">Compass Details</h2>
          </div>
          <motion.button
            className="drawer-close"
            onClick={onClose}
            aria-label="Close Details"
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} />
          </motion.button>
        </div>

        <div className="data-grid" style={{ marginBottom: '1.5rem', marginTop: 0 }}>
          {dataItems.map((item, i) => (
            <motion.div
              key={item.label}
              className="data-item"
              custom={i}
              initial="hidden"
              animate="visible"
              variants={dataItemVariants}
            >
              <span className="data-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                {item.icon} {item.label}
              </span>
              <span className="data-value">{item.value}</span>
            </motion.div>
          ))}
        </div>

        <motion.button
          className="btn"
          onClick={onRefresh}
          disabled={loading}
          style={{ width: '100%' }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Refreshing GPS...' : 'Refresh GPS Location'}</span>
        </motion.button>
      </motion.div>
    </>
  );
};
