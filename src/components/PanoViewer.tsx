import React, { useRef, useEffect } from 'react';
import { X } from 'lucide-react';
import { PanoService } from '../services/PanoService';

interface PanoViewerProps {
  nodeId: string;
  onClose: () => void;
}

export const PanoViewer: React.FC<PanoViewerProps> = ({ nodeId, onClose }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    PanoService.navigateIframe(iframeRef.current, nodeId);
  }, [nodeId]);

  return (
    <div className="pano-viewer-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: '#000',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div className="pano-viewer-header" style={{
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)'
      }}>
        <h2 style={{ margin: 0, color: 'white', fontSize: '1.2rem' }}>360° Virtual Tour</h2>
        <button 
          onClick={onClose}
          style={{
            background: 'transparent', border: 'none', color: 'white', cursor: 'pointer',
            padding: '0.5rem', display: 'flex', alignItems: 'center'
          }}
          aria-label="Close Viewer"
        >
          <X size={24} />
        </button>
      </div>
      <iframe
        ref={iframeRef}
        title="Pano2VR Viewer"
        style={{ flex: 1, border: 'none', width: '100%', height: '100%' }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};
