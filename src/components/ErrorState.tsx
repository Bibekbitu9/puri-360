import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: [0, -4, 4, -3, 3, 0] }}
      transition={{ duration: 0.5 }}
    >
      <div className="error-container">
        <AlertCircle size={20} />
        <span>{message}</span>
      </div>
      <motion.button
        className="btn btn-secondary"
        onClick={onRetry}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
      >
        <RefreshCw size={18} />
        <span>Try Again</span>
      </motion.button>
    </motion.div>
  );
};
