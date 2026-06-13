import React from 'react';
import { X, RefreshCw, Compass, MapPin, Activity, Clock } from 'lucide-react';
import type { LocationData } from '../types/geolocation';

interface LocationDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  location: LocationData;
  onRefresh: () => void;
  loading: boolean;
}

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

  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />
      <div className="details-drawer">
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Compass size={20} className={loading ? 'animate-spin' : ''} style={{ color: 'var(--accent-primary)' }} />
            <h2 className="drawer-title">Compass Details</h2>
          </div>
          <button className="drawer-close" onClick={onClose} aria-label="Close Details">
            <X size={20} />
          </button>
        </div>

        <div className="data-grid" style={{ marginBottom: '1.5rem', marginTop: 0 }}>
          <div className="data-item">
            <span className="data-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} /> Latitude
            </span>
            <span className="data-value">{formatCoordinate(location.latitude)}°</span>
          </div>

          <div className="data-item">
            <span className="data-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <MapPin size={14} /> Longitude
            </span>
            <span className="data-value">{formatCoordinate(location.longitude)}°</span>
          </div>

          <div className="data-item">
            <span className="data-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Activity size={14} /> Accuracy
            </span>
            <span className="data-value">
              {location.accuracy ? `${Math.round(location.accuracy)} meters` : 'N/A'}
            </span>
          </div>

          <div className="data-item">
            <span className="data-label" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={14} /> Last Updated
            </span>
            <span className="data-value">{formatTimestamp(location.timestamp)}</span>
          </div>
        </div>

        <button 
          className="btn" 
          onClick={onRefresh} 
          disabled={loading}
          style={{ width: '100%' }}
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>{loading ? 'Refreshing GPS...' : 'Refresh GPS Location'}</span>
        </button>
      </div>
    </>
  );
};
