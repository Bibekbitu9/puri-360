import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Loader2 } from 'lucide-react';

interface LocationButtonProps {
  onClick: () => void;
  loading: boolean;
}

export const LocationButton: React.FC<LocationButtonProps> = ({ onClick, loading }) => {
  return (
    <motion.button
      className="btn"
      onClick={onClick}
      disabled={loading}
      aria-label="Start Virtual Guide"
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.96 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            style={{ display: 'flex' }}
          >
            <Loader2 size={20} />
          </motion.div>
          <span>Retrieving Location...</span>
        </>
      ) : (
        <>
          <motion.span
            className="bell-icon-left"
            animate={{ rotate: [0, -12, 12, -8, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
          >
            <Bell size={18} />
          </motion.span>
          <span>Begin Darshan</span>
          <motion.span
            className="bell-icon-right"
            animate={{ rotate: [0, 12, -12, 8, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, delay: 0.2 }}
          >
            <Bell size={18} />
          </motion.span>
        </>
      )}
    </motion.button>
  );
};
