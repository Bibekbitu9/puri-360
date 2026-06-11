import React from 'react';
import { MapPin, Loader2 } from 'lucide-react';

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
      aria-label="Share My Location"
    >
      {loading ? (
        <>
          <Loader2 className="animate-spin" size={20} />
          <span>Retrieving Location...</span>
        </>
      ) : (
        <>
          <MapPin size={20} />
          <span>Share My Location</span>
        </>
      )}
    </button>
  );
};
