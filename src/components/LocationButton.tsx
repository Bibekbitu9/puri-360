import React from 'react';
import { Bell, Loader2 } from 'lucide-react';

interface LocationButtonProps {
  onClick: () => void;
  loading: boolean;
}

export const LocationButton: React.FC<LocationButtonProps> = ({ onClick, loading }) => {
  return (
    <button
      className="btn"
      onClick={onClick}
      disabled={loading}
      aria-label="Start Virtual Guide"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Retrieving Location...</span>
        </>
      ) : (
        <>
          <Bell className="bell-icon-left" size={20} />
          <span>Start</span>
          <Bell className="bell-icon-right" size={20} />
        </>
      )}
    </button>
  );
};
