import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div>
      <div className="error-container">
        <AlertCircle size={20} />
        <span>{message}</span>
      </div>
      <button className="btn btn-secondary" onClick={onRetry}>
        <RefreshCw size={18} />
        <span>Try Again</span>
      </button>
    </div>
  );
};
