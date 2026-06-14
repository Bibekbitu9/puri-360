import { useState, useEffect, useMemo, useRef } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { LocationButton } from './components/LocationButton';
import { ErrorState } from './components/ErrorState';
import { useGeolocation } from './hooks/useGeolocation';
import { MetadataService } from './services/MetadataService';
import { sortNodesByDistance } from './gis/haversine';
import { formatDistanceMiles } from './utils/distanceFormatter';
import { PanoService } from './services/PanoService';
import { LocationDetailsDrawer } from './components/LocationDetailsDrawer';
import { Compass, Share2, Map, ChevronRight, ExternalLink, Loader2, Copy, ChevronUp, ChevronDown } from 'lucide-react';
import type { PanoramaNode } from './types/gis';
import { ServiceSelectorModal } from './components/ServiceSelectorModal';
import type { ServiceOption } from './components/ServiceSelectorModal';

function App() {
  const { location, loading, error, permissionGranted, requestLocation } = useGeolocation();
  const [panoramas, setPanoramas] = useState<PanoramaNode[]>([]);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('node');
  });
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [isNavCardExpanded, setIsNavCardExpanded] = useState(false);

  const handleSelectService = (service: ServiceOption) => {
    setSelectedService(service);
    setIsServiceModalOpen(false);
    requestLocation();
  };

  // Load panoramas on mount
  useEffect(() => {
    MetadataService.getPanoramas().then(setPanoramas);
  }, []);

  // Sort panoramas by distance based on user location
  const sortedNodes = useMemo(() => {
    if (permissionGranted && location.latitude !== null && location.longitude !== null && panoramas.length > 0) {
      return sortNodesByDistance(
        { latitude: location.latitude, longitude: location.longitude },
        panoramas
      );
    }
    return [];
  }, [location.latitude, location.longitude, permissionGranted, panoramas]);

  // Determine active node and its sorted index
  const activeResult = useMemo(() => {
    if (sortedNodes.length === 0) return null;

    const index = sortedNodes.findIndex((item) => item.node.id === activeNodeId);
    if (index !== -1) {
      return { item: sortedNodes[index], index };
    }

    return { item: sortedNodes[0], index: 0 };
  }, [sortedNodes, activeNodeId]);

  // Navigate iframe when active node changes
  useEffect(() => {
    if (activeResult && iframeRef.current) {
      iframeRef.current.src = PanoService.getNodeUrl(activeResult.item.node.id);
    }
  }, [activeResult]);

  const handleNextNearest = () => {
    if (sortedNodes.length <= 1 || !activeResult) return;
    const nextIndex = (activeResult.index + 1) % sortedNodes.length;
    setActiveNodeId(sortedNodes[nextIndex].node.id);
  };

  const handleShare = () => {
    if (!activeResult) return;
    const shareUrl = `${window.location.origin}${window.location.pathname}?node=${activeResult.item.node.id}`;

    if (navigator.share) {
      navigator.share({
        title: `Puri 360° - ${activeResult.item.node.title}`,
        text: `Explore this 360° panorama: ${activeResult.item.node.title}`,
        url: shareUrl,
      }).catch((err) => console.log('Share failed:', err));
    } else {
      navigator.clipboard.writeText(shareUrl)
        .then(() => {
          setShowToast(true);
          setTimeout(() => setShowToast(false), 2500);
        })
        .catch((err) => console.error('Failed to copy link:', err));
    }
  };

  // Render Onboarding/Location Permission Page
  if (!permissionGranted || error || sortedNodes.length === 0) {
    return (
      <div className="app-container">
        <div className="header-container">
          <ThemeToggle />
        </div>

        <main className="card">
          <div className="subtitle">Smart Virtual Guide</div>
          <h1 className="title">Puri Rath Yatra</h1>
          <div className="divine-divider">
            <span className="divine-symbol">☸</span>
          </div>
          <div className="tagline">
            <span>SCAN</span>
            <span className="divider-dot">•</span>
            <span>NAVIGATE</span>
            <span className="divider-dot">•</span>
            <span>REACH</span>
          </div>
          {loading && !error && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Retrieving your coordinates...</p>
            </div>
          )}

          {!permissionGranted && !error && !loading && (
            <LocationButton onClick={() => setIsServiceModalOpen(true)} loading={loading} />
          )}

          {error && (
            <ErrorState message={error} onRetry={requestLocation} />
          )}
        </main>

        <ServiceSelectorModal
          isOpen={isServiceModalOpen}
          onClose={() => setIsServiceModalOpen(false)}
          onSelectService={handleSelectService}
        />
      </div>
    );
  }

  if (!activeResult) {
    return null;
  }

  // Render Full-Screen Viewport Interface
  const activeNode = activeResult.item.node;
  const activeDistance = activeResult.item.distanceMeters;

  return (
    <div className="viewport-container">
      {/* 360° Panorama Viewport */}
      <iframe
        ref={iframeRef}
        title="360 Viewport"
        className="pano-iframe"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

      {/* Floating Header */}
      <header className="viewport-header">
        <button
          className="viewport-header-btn"
          onClick={() => setIsDetailsOpen(true)}
          aria-label="Compass details"
        >
          <Compass size={18} />
          <span>Compass</span>
        </button>

        <button
          className="viewport-header-btn"
          onClick={handleShare}
          aria-label="Share current spot"
        >
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </header>

      {/* Floating Bottom Navigation Card Controls */}
      {!isNavCardExpanded ? (
        <button
          className="viewport-nav-collapsed-btn"
          onClick={() => setIsNavCardExpanded(true)}
          aria-label="Expand navigation panel"
        >
          <span>📍 {activeNode.title}</span>
          <ChevronUp size={16} />
        </button>
      ) : (
        <div className="viewport-nav-card">
          <div className="viewport-spot-info">
            <button
              onClick={() => setIsNavCardExpanded(false)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '0.2rem',
                marginRight: '0.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8
              }}
              title="Collapse navigation panel"
            >
              <ChevronDown size={18} />
            </button>
            <span className="viewport-spot-title" style={{ flex: 1 }}>
              Nearest Spot: <strong>{activeNode.title}</strong>
            </span>
            <span className="viewport-spot-distance">
              ({formatDistanceMiles(activeDistance)})
            </span>
          </div>

          {selectedService && (
            <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '-0.25rem 0 0.25rem 0' }}>
              <button
                className="active-service-badge"
                onClick={() => setIsServiceModalOpen(true)}
                title="Click to change service category"
              >
                <span>Category: {selectedService.title}</span>
                <span style={{ fontSize: '0.65rem', opacity: 0.65, fontWeight: 400 }}>(Change)</span>
              </button>
            </div>
          )}

          <div className="viewport-actions-row">
            <button className="viewport-action-btn" onClick={() => setIsDetailsOpen(true)}>
              <span>View Details</span>
            </button>

            <a
              className="viewport-action-btn"
              href={`https://www.google.com/maps/search/?api=1&query=${activeNode.latitude},${activeNode.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: 'none' }}
            >
              <Map size={14} />
              <span>See on Map</span>
              <ExternalLink size={10} style={{ opacity: 0.7 }} />
            </a>

            <button
              className="viewport-action-btn primary"
              onClick={handleNextNearest}
              disabled={sortedNodes.length <= 1}
            >
              <span>Next Nearest</span>
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Location Details Slide-out Drawer */}
      <LocationDetailsDrawer
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        location={location}
        onRefresh={requestLocation}
        loading={loading}
      />

      {/* Share Toast Notification */}
      {showToast && (
        <div className="toast-msg">
          <Copy size={16} />
          <span>Link copied to clipboard!</span>
        </div>
      )}

      {/* Service Selection Modal */}
      <ServiceSelectorModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSelectService={(service) => {
          setSelectedService(service);
          setIsServiceModalOpen(false);
        }}
      />
    </div>
  );
}

export default App;
