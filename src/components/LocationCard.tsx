import React, { useState } from 'react';
import type { LocationData } from '../types/geolocation';
import { copyToClipboard } from '../utils/clipboard';
import { Copy, CheckCircle2, Clock, Map } from 'lucide-react';

interface LocationCardProps {
  location: LocationData;
  onRefresh: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location, onRefresh }) => {
  const [copiedLat, setCopiedLat] = useState(false);
  const [copiedLng, setCopiedLng] = useState(false);

  const formatCoordinate = (coord: number | null) => {
    return coord !== null ? coord.toFixed(6) : 'N/A';
  };

  const handleCopy = async (text: string, type: 'lat' | 'lng') => {
    const success = await copyToClipboard(text);
    if (success) {
      if (type === 'lat') {
        setCopiedLat(true);
        setTimeout(() => setCopiedLat(false), 2000);
      } else {
        setCopiedLng(true);
        setTimeout(() => setCopiedLng(false), 2000);
      }
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return 'Unknown time';
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div>
      <div className="success-container">
        <CheckCircle2 size={18} />
        <span>Location retrieved successfully</span>
      </div>

      <div className="data-grid">
        <div className="data-item">
          <span className="data-label">Latitude</span>
          <div className="data-value-row">
            <span className="data-value">{formatCoordinate(location.latitude)}&deg;</span>
            <button 
              className="icon-btn"
              onClick={() => handleCopy(location.latitude?.toString() || '', 'lat')}
              title="Copy Latitude"
            >
              {copiedLat ? <CheckCircle2 size={18} className="text-success" /> : <Copy size={18} />}
            </button>
          </div>
        </div>

        <div className="data-item">
          <span className="data-label">Longitude</span>
          <div className="data-value-row">
            <span className="data-value">{formatCoordinate(location.longitude)}&deg;</span>
            <button 
              className="icon-btn"
              onClick={() => handleCopy(location.longitude?.toString() || '', 'lng')}
              title="Copy Longitude"
            >
              {copiedLng ? <CheckCircle2 size={18} className="text-success" /> : <Copy size={18} />}
            </button>
          </div>
        </div>
      </div>

      <div className="info-item">
        <Map size={16} />
        <span>Accuracy: {location.accuracy ? `${Math.round(location.accuracy)} meters` : 'N/A'}</span>
      </div>
      
      <div className="info-item" style={{ marginTop: '0.5rem', marginBottom: '1.5rem' }}>
        <Clock size={16} />
        <span>Retrieved at {formatDate(location.timestamp)}</span>
      </div>

      <button className="btn btn-secondary" onClick={onRefresh}>
        Refresh Location
      </button>
    </div>
  );
};
