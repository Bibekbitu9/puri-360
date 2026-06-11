import React from 'react';
import { Compass, Map } from 'lucide-react';
import type { PanoramaNode } from '../types/gis';
import { formatDistance } from '../utils/distanceFormatter';

interface NearestPanoramaCardProps {
  node: PanoramaNode;
  distanceMeters: number;
  onOpen: () => void;
}

export const NearestPanoramaCard: React.FC<NearestPanoramaCardProps> = ({ node, distanceMeters, onOpen }) => {
  return (
    <div className="card panorama-card" style={{ marginTop: '1.5rem', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
        <Compass size={24} style={{ marginRight: '0.75rem', color: 'var(--accent-color)' }} />
        <h2 style={{ margin: 0, fontSize: '1.25rem' }}>Nearest Virtual Tour</h2>
      </div>
      
      <div style={{ padding: '1rem', background: 'rgba(0, 0, 0, 0.2)', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{node.title}</h3>
        <p style={{ margin: 0, color: 'var(--text-secondary)' }}>
          Distance: <strong style={{ color: 'var(--text-primary)' }}>{formatDistance(distanceMeters)}</strong>
        </p>
      </div>

      <button className="btn" onClick={onOpen} style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Map size={20} style={{ marginRight: '0.5rem' }} />
        <span>Open Panorama Viewer</span>
      </button>
    </div>
  );
};
