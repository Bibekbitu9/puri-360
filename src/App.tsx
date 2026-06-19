import { useState, useEffect, useMemo, useRef } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { LocationButton } from './components/LocationButton';
import { ErrorState } from './components/ErrorState';
import { useGeolocation } from './hooks/useGeolocation';
import { MetadataService } from './services/MetadataService';
import { sortNodesByDistance, findNearestNode, calculateDistance } from './gis/haversine';
import { formatDistance } from './utils/distanceFormatter';
import { PanoService } from './services/PanoService';
import { LocationDetailsDrawer } from './components/LocationDetailsDrawer';
import { Map, ChevronRight, ExternalLink, Loader2, ChevronUp, ChevronDown, ArrowRight, ArrowLeft, ArrowUp } from 'lucide-react';
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
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(null);
  const [isNavCardExpanded, setIsNavCardExpanded] = useState(false);
  const [serviceMap, setServiceMap] = useState<Record<string, { name: string; latitude: number; longitude: number }[]>>({});
  const [targetServiceSpot, setTargetServiceSpot] = useState<{ name: string; latitude: number; longitude: number; nearestNodeId: string } | null>(null);

  const handleSelectService = (service: ServiceOption) => {
    setSelectedService(service);
    setIsServiceModalOpen(false);
    setIsNavCardExpanded(true);
    if (sortedNodes.length > 0) {
      setActiveNodeId(sortedNodes[0].node.id);
      requestLocation();
    }
  };

  // Load panoramas on mount
  useEffect(() => {
    MetadataService.getPanoramas().then(setPanoramas);
  }, []);

  // Load service locations on mount
  useEffect(() => {
    fetch('/projects/puri_walk_through/lat_long_map.json')
      .then((res) => res.json())
      .then((data) => setServiceMap(data))
      .catch((err) => console.error('Failed to load service coordinates:', err));
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

  // Automatically open service modal once location is obtained but no service is selected
  useEffect(() => {
    if (permissionGranted && sortedNodes.length > 0 && !selectedService) {
      setIsServiceModalOpen(true);
    }
  }, [permissionGranted, sortedNodes, selectedService]);

  // Retrieve service locations for selected category
  const selectedLocations = useMemo(() => {
    if (!selectedService || !serviceMap) return [];
    return serviceMap[selectedService.id] || [];
  }, [selectedService, serviceMap]);


  // Resolve nearest panorama nodes for the selected service locations and sort them by distance from user
  const serviceNodesSorted = useMemo(() => {
    if (!selectedService || !serviceMap || selectedLocations.length === 0 || panoramas.length === 0) {
      return [];
    }

    const resolved = selectedLocations.map((loc) => {
      const { nearestNode, distanceMeters } = findNearestNode(
        { latitude: loc.latitude, longitude: loc.longitude },
        panoramas
      );

      let distFromUser = Infinity;
      if (permissionGranted && location.latitude !== null && location.longitude !== null) {
        distFromUser = calculateDistance(
          { latitude: location.latitude, longitude: location.longitude },
          { latitude: loc.latitude, longitude: loc.longitude }
        );
      }

      return {
        loc,
        node: nearestNode,
        distanceMeters: distFromUser !== Infinity ? Math.round(distFromUser) : (distanceMeters || 0),
      };
    });

    return resolved
      .filter((item) => item.node !== null)
      .sort((a, b) => a.distanceMeters - b.distanceMeters) as { loc: typeof selectedLocations[0]; node: PanoramaNode; distanceMeters: number }[];
  }, [selectedService, selectedLocations, panoramas, location, permissionGranted, serviceMap]);

  // Initialize active node to closest node when sortedNodes are computed
  useEffect(() => {
    if (!activeNodeId && sortedNodes.length > 0) {
      setActiveNodeId(sortedNodes[0].node.id);
    }
  }, [sortedNodes, activeNodeId]);

  // Set targeted service spot when the selected service category changes (without teleporting)
  useEffect(() => {
    if (selectedService && serviceNodesSorted.length > 0) {
      const closest = serviceNodesSorted[0];
      setTargetServiceSpot({
        name: closest.loc.name,
        latitude: closest.loc.latitude,
        longitude: closest.loc.longitude,
        nearestNodeId: closest.node.id
      });
    } else {
      setTargetServiceSpot(null);
    }
  }, [selectedService, serviceNodesSorted]);

  // Sync target service spot with the active node if the user cycles through service locations
  useEffect(() => {
    if (selectedService && serviceNodesSorted.length > 0) {
      const matchingSpot = serviceNodesSorted.find((item) => item.node.id === activeNodeId);
      if (matchingSpot) {
        setTargetServiceSpot({
          name: matchingSpot.loc.name,
          latitude: matchingSpot.loc.latitude,
          longitude: matchingSpot.loc.longitude,
          nearestNodeId: matchingSpot.node.id
        });
      }
    }
  }, [activeNodeId, selectedService, serviceNodesSorted]);


  // Determine if the destination is to the left or right of the current active node
  const pathDirection = useMemo(() => {
    if (!targetServiceSpot || panoramas.length === 0 || !activeNodeId) {
      return null;
    }
    const startIndex = panoramas.findIndex((p) => p.id === activeNodeId);
    const endIndex = panoramas.findIndex((p) => p.id === targetServiceSpot.nearestNodeId);
    if (startIndex === -1 || endIndex === -1) {
      return null;
    }
    if (startIndex < endIndex) {
      return 'right';
    } else if (startIndex > endIndex) {
      return 'left';
    }
    return 'arrived';
  }, [activeNodeId, targetServiceSpot, panoramas]);

  // Determine active node and its index in the full list
  const activeResult = useMemo(() => {
    if (sortedNodes.length === 0) return null;
    const index = sortedNodes.findIndex((item) => item.node.id === activeNodeId);
    if (index !== -1) {
      return { item: sortedNodes[index], index, list: sortedNodes };
    }
    return { item: sortedNodes[0], index: 0, list: sortedNodes };
  }, [sortedNodes, activeNodeId]);

  // Calculate bearing angle from current active node to the target service spot
  const bearing = useMemo(() => {
    if (!activeResult || !targetServiceSpot) return 0;
    const activeNode = activeResult.item.node;
    const lat1 = activeNode.latitude;
    const lon1 = activeNode.longitude;
    const lat2 = targetServiceSpot.latitude;
    const lon2 = targetServiceSpot.longitude;

    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;

    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
      Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

    const brng = Math.atan2(y, x) * 180 / Math.PI;
    return (brng + 360) % 360;
  }, [activeResult, targetServiceSpot]);

  // Calculate current target service spot index
  const currentTargetIndex = useMemo(() => {
    if (!targetServiceSpot || serviceNodesSorted.length === 0) return 0;
    return serviceNodesSorted.findIndex((item) => item.loc.name === targetServiceSpot.name);
  }, [targetServiceSpot, serviceNodesSorted]);

  // Listen for navigation node changes from the iframe tour viewer
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'changenode') {
        const cleanId = event.data.nodeId.replace(/[{}]/g, '');
        setActiveNodeId(cleanId);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Navigate iframe when active node changes, avoiding loop reloads
  useEffect(() => {
    if (activeNodeId && iframeRef.current) {
      const targetUrl = PanoService.getNodeUrl(activeNodeId);
      try {
        const currentUrl = iframeRef.current.contentWindow?.location.href || iframeRef.current.src;
        if (!currentUrl.endsWith(`#${activeNodeId}`)) {
          iframeRef.current.src = targetUrl;
        }
      } catch (e) {
        if (iframeRef.current.src !== targetUrl) {
          iframeRef.current.src = targetUrl;
        }
      }
    }
  }, [activeNodeId, selectedService]);

  const handleNextNearest = () => {
    if (!selectedService || serviceNodesSorted.length <= 1 || !targetServiceSpot) return;
    const currentIndex = serviceNodesSorted.findIndex(
      (item) => item.loc.name === targetServiceSpot.name
    );
    const nextIndex = (currentIndex + 1) % serviceNodesSorted.length;
    const nextSpot = serviceNodesSorted[nextIndex];
    setTargetServiceSpot({
      name: nextSpot.loc.name,
      latitude: nextSpot.loc.latitude,
      longitude: nextSpot.loc.longitude,
      nearestNodeId: nextSpot.node.id
    });
  };



  // Render Onboarding/Location Permission Page
  if (!permissionGranted || error || sortedNodes.length === 0 || !selectedService) {
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
            <LocationButton onClick={requestLocation} loading={loading} />
          )}

          {permissionGranted && !selectedService && !error && !loading && (
            <button
              className="btn"
              onClick={() => setIsServiceModalOpen(true)}
              aria-label="Select Service Category"
            >
              🔍 Select Service
            </button>
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



      {/* Floating Bottom Navigation Card Controls */}
      {!isNavCardExpanded ? (
        <button
          className="viewport-nav-collapsed-btn"
          onClick={() => setIsNavCardExpanded(true)}
          aria-label="Expand navigation panel"
        >
          <span>
            📍 {selectedService && serviceNodesSorted.length > 0
              ? `${selectedService.title} (${targetServiceSpot ? currentTargetIndex + 1 : 1}/${serviceNodesSorted.length})`
              : activeNode.title}
          </span>
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
            {selectedService && serviceNodesSorted.length > 0 ? (
              <>
                <span className="viewport-spot-title" style={{ flex: 1 }}>
                  <strong>{selectedService.title}</strong> ({targetServiceSpot ? currentTargetIndex + 1 : 1} of {serviceNodesSorted.length} available)
                </span>
                <span className="viewport-spot-distance">
                  {targetServiceSpot && `(${formatDistance(
                    calculateDistance(
                      { latitude: activeNode.latitude, longitude: activeNode.longitude },
                      { latitude: targetServiceSpot.latitude, longitude: targetServiceSpot.longitude }
                    )
                  )})`}
                </span>
              </>
            ) : (
              <>
                <span className="viewport-spot-title" style={{ flex: 1 }}>
                  Nearest Spot: <strong>{sortedNodes[0].node.title}</strong>
                </span>
                <span className="viewport-spot-distance">
                  ({formatDistance(sortedNodes[0].distanceMeters)})
                </span>
              </>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start', margin: '-0.25rem 0 0.25rem 0' }}>
            <button
              className="active-service-badge"
              onClick={() => setIsServiceModalOpen(true)}
              title="Click to select service category"
            >
              {selectedService ? (
                <>
                  <span>Category: {selectedService.title}</span>
                  <span style={{ fontSize: '0.65rem', opacity: 0.65, fontWeight: 400 }}>(Change)</span>
                </>
              ) : (
                <>
                  <span>🔍 Select Service</span>
                </>
              )}
            </button>
          </div>

          {/* Direction Indicator */}
          {targetServiceSpot && (
            <div className="direction-indicator-card">
              <div className="direction-indicator-header">
                <span className="direction-indicator-title">
                  🧭 Direction to {targetServiceSpot.name}
                </span>
                <button
                  onClick={() => setTargetServiceSpot(null)}
                  className="direction-indicator-cancel"
                >
                  Cancel
                </button>
              </div>

              <div className="direction-indicator-body">
                {/* Compass/Bearing Rotating Arrow - Glowing Green Circle Overlay */}
                <div className="compass-icon-container">
                  <div
                    style={{
                      transform: `rotate(${bearing}deg)`,
                      transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#86efac'
                    }}
                    title={`Geographic Bearing: ${Math.round(bearing)}°`}
                  >
                    <ArrowUp className="compass-arrow-icon" style={{ strokeWidth: 3 }} />
                  </div>
                </div>

                <div className="direction-instruction-container">
                  <span className="direction-instruction-text">
                    {pathDirection === 'left' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ArrowLeft className="direction-arrow-small" style={{ color: '#fbbf24' }} />
                        Move Left along Grand Road
                      </span>
                    )}
                    {pathDirection === 'right' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                        <ArrowRight className="direction-arrow-small" style={{ color: '#fbbf24' }} />
                        Move Right along Grand Road
                      </span>
                    )}
                    {pathDirection === 'arrived' && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#86efac' }}>
                        🎉 Arrived at spot!
                      </span>
                    )}
                  </span>
                  <span className="direction-bearing-text">
                    GPS Bearing: {Math.round(bearing)}°
                  </span>
                </div>
              </div>
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
              disabled={!selectedService || serviceNodesSorted.length <= 1}
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



      {/* Service Selection Modal */}
      <ServiceSelectorModal
        isOpen={isServiceModalOpen}
        onClose={() => setIsServiceModalOpen(false)}
        onSelectService={handleSelectService}
      />
    </div>
  );
}

export default App;
