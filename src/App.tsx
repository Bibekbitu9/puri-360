import { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Variants } from 'framer-motion';
import { LocationButton } from './components/LocationButton';
import { ErrorState } from './components/ErrorState';
import { AnimatedChakra } from './components/AnimatedChakra';
import { ParticleBackground } from './components/ParticleBackground';
import { useGeolocation } from './hooks/useGeolocation';
import { MetadataService } from './services/MetadataService';
import { sortNodesByDistance, findNearestNode, calculateDistance } from './gis/haversine';
import { formatDistance } from './utils/distanceFormatter';
import { PanoService } from './services/PanoService';
import { LocationDetailsDrawer } from './components/LocationDetailsDrawer';
import { Map, ChevronRight, Loader2, ChevronUp, ChevronDown } from 'lucide-react';
import type { PanoramaNode } from './types/gis';
import { ServiceSelectorModal } from './components/ServiceSelectorModal';
import type { ServiceOption } from './components/ServiceSelectorModal';
import { TopDirectionHUD } from './components/TopDirectionHUD';

// Stagger animation variants for tagline words
const taglineWordVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: 0.6 + i * 0.15, duration: 0.4, ease: 'easeOut' as const },
  }),
};

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
  const [targetServiceSpotOverrideName, setTargetServiceSpotOverrideName] = useState<string | null>(null);
  const [walkingDistance, setWalkingDistance] = useState<number | null>(null);

  const handleSelectService = (service: ServiceOption) => {
    setSelectedService(service);
    setTargetServiceSpotOverrideName(null);
    setIsServiceModalOpen(false);
    setIsNavCardExpanded(false);
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
    fetch('/projects/puritest_01/lat_long_map.json')
      .then((res) => res.json())
      .then((data) => setServiceMap(data))
      .catch((err) => console.error('Failed to load service coordinates:', err));
  }, []);

  // Sort panoramas by distance based on user location
  // eslint-disable-next-line react-hooks/preserve-manual-memoization
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
      const timer = setTimeout(() => {
        setIsServiceModalOpen(true);
      }, 0);
      return () => clearTimeout(timer);
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

  // Derive target service spot from active node / selection
  const targetServiceSpot = useMemo(() => {
    if (!selectedService || serviceNodesSorted.length === 0) return null;
    if (targetServiceSpotOverrideName) {
      const match = serviceNodesSorted.find((item) => item.loc.name === targetServiceSpotOverrideName);
      if (match) {
        return {
          name: match.loc.name,
          latitude: match.loc.latitude,
          longitude: match.loc.longitude,
          nearestNodeId: match.node.id,
        };
      }
    }
    // Fallback: If activeNodeId matches any spot, target that spot
    const matchingSpot = serviceNodesSorted.find((item) => item.node.id === activeNodeId);
    if (matchingSpot) {
      return {
        name: matchingSpot.loc.name,
        latitude: matchingSpot.loc.latitude,
        longitude: matchingSpot.loc.longitude,
        nearestNodeId: matchingSpot.node.id,
      };
    }
    // Otherwise, default to the closest spot
    const closest = serviceNodesSorted[0];
    return {
      name: closest.loc.name,
      latitude: closest.loc.latitude,
      longitude: closest.loc.longitude,
      nearestNodeId: closest.node.id,
    };
  }, [selectedService, serviceNodesSorted, targetServiceSpotOverrideName, activeNodeId]);

  // Initialize active node to closest node when sortedNodes are computed
  useEffect(() => {
    if (!activeNodeId && sortedNodes.length > 0) {
      const timer = setTimeout(() => {
        setActiveNodeId(sortedNodes[0].node.id);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [sortedNodes, activeNodeId]);

  // Fetch realistic walking distance from OSRM foot routing API
  useEffect(() => {
    let isSubscribed = true;
    const activeNode = panoramas.find((p) => p.id === activeNodeId);
    if (activeNode && targetServiceSpot) {
      const startLat = activeNode.latitude;
      const startLon = activeNode.longitude;
      const endLat = targetServiceSpot.latitude;
      const endLon = targetServiceSpot.longitude;
      const url = `https://router.project-osrm.org/route/v1/foot/${startLon},${startLat};${endLon},${endLat}?overview=false`;

      fetch(url)
        .then((res) => res.json())
        .then((data) => {
          if (isSubscribed) {
            if (data.code === 'Ok' && data.routes && data.routes[0]) {
              setWalkingDistance(data.routes[0].distance);
            } else {
              setWalkingDistance(null);
            }
          }
        })
        .catch((err) => {
          console.error('OSRM API fetch failed, falling back to Haversine:', err);
          if (isSubscribed) {
            setWalkingDistance(null);
          }
        });
    } else {
      const timer = setTimeout(() => {
        setWalkingDistance(null);
      }, 0);
      return () => clearTimeout(timer);
    }

    return () => {
      isSubscribed = false;
    };
  }, [activeNodeId, targetServiceSpot, panoramas]);


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
      } catch {
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
    setTargetServiceSpotOverrideName(nextSpot.loc.name);
  };

  // Render Onboarding/Location Permission Page
  if (!permissionGranted || error || sortedNodes.length === 0 || !selectedService) {
    return (
      <div className="app-container">
        {/* Floating golden particles */}
        <ParticleBackground />

        <div className="header-container">
        </div>

        <motion.main
          className="card"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated Sudarshan Chakra Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5, type: 'spring' }}
          >
            <AnimatedChakra size={72} />
          </motion.div>

          <motion.div
            className="subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Smart Virtual Guide
          </motion.div>

          <motion.h1
            className="title"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            Puri Rath Yatra
          </motion.h1>

          <motion.div
            className="divine-divider"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <span className="divine-symbol">☸</span>
          </motion.div>

          <div className="tagline">
            {['SCAN', '•', 'NAVIGATE', '•', 'REACH'].map((word, i) => (
              <motion.span
                key={i}
                className={word === '•' ? 'divider-dot' : undefined}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={taglineWordVariants}
              >
                {word}
              </motion.span>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {loading && !error && (
              <motion.div
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                >
                  <Loader2 size={28} style={{ color: 'var(--primary)' }} />
                </motion.div>
                <p style={{ fontSize: '0.875rem', color: 'var(--on-surface-variant)' }}>Retrieving your coordinates...</p>
              </motion.div>
            )}

            {!permissionGranted && !error && !loading && (
              <motion.div
                key="location-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.8 }}
              >
                <LocationButton onClick={requestLocation} loading={loading} />
              </motion.div>
            )}

            {permissionGranted && !selectedService && !error && !loading && (
              <motion.div
                key="service-btn"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <motion.button
                  className="btn"
                  onClick={() => setIsServiceModalOpen(true)}
                  aria-label="Select Service Category"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  🔍 Select Service
                </motion.button>
              </motion.div>
            )}

            {error && (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <ErrorState message={error} onRetry={requestLocation} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

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

      {/* Top Floating Direction HUD */}
      <TopDirectionHUD
        targetServiceSpot={targetServiceSpot}
        bearing={bearing}
        pathDirection={pathDirection}
        onCancel={() => setSelectedService(null)}
        distance={
          targetServiceSpot
            ? walkingDistance !== null
              ? formatDistance(walkingDistance)
              : `~${formatDistance(
                  calculateDistance(
                    { latitude: activeNode.latitude, longitude: activeNode.longitude },
                    { latitude: targetServiceSpot.latitude, longitude: targetServiceSpot.longitude }
                  )
                )}`
            : ''
        }
        serviceIconName={selectedService?.iconName}
      />

      {/* Floating Bottom Navigation Card Controls */}
      <AnimatePresence mode="wait">
        {!isNavCardExpanded ? (
          <motion.div
            key="collapsed"
            className="viewport-nav-wrapper collapsed"
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <motion.button
              onClick={() => setIsNavCardExpanded(true)}
              aria-label="Expand navigation panel"
              className="viewport-nav-collapsed-btn"
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span>
                📍 {selectedService && serviceNodesSorted.length > 0
                  ? `${targetServiceSpot ? targetServiceSpot.name : selectedService.title} (${targetServiceSpot ? currentTargetIndex + 1 : 1}/${serviceNodesSorted.length})`
                  : activeNode.title}
              </span>
              <ChevronUp size={16} />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            className="viewport-nav-wrapper"
            initial={{ opacity: 0, y: 60, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 60, x: "-50%" }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          >
            <motion.div 
              className="viewport-nav-card"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
            <div className="viewport-spot-info" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <motion.button
                  onClick={() => setIsNavCardExpanded(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--on-surface)',
                    cursor: 'pointer',
                  }}
                  title="Collapse navigation panel"
                  whileHover={{ scale: 1.1, background: 'rgba(255, 255, 255, 0.2)' }}
                  whileTap={{ scale: 0.9 }}
                >
                  <ChevronDown size={18} />
                </motion.button>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <motion.button
                    className="active-service-badge"
                    onClick={() => setIsServiceModalOpen(true)}
                    title="Click to select service category"
                    style={{ background: 'transparent', border: 'none', padding: 0, textAlign: 'left', cursor: 'pointer' }}
                    whileHover={{ opacity: 0.8 }}
                  >
                    <span style={{ fontSize: '10px', color: 'rgba(218, 226, 253, 0.6)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {selectedService ? 'CATEGORY (CHANGE)' : 'SEARCH CATEGORY'}
                    </span>
                  </motion.button>
                  
                  {selectedService && serviceNodesSorted.length > 0 ? (
                    <span className="viewport-spot-title" style={{ fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {selectedService.iconName === 'Droplet' && <span style={{fontSize: '18px'}}>💧</span>}
                      {selectedService.iconName === 'User' && <span style={{fontSize: '18px'}}>🚻</span>}
                      {selectedService.iconName === 'Plus' && <span style={{fontSize: '18px'}}>🏥</span>}
                      {selectedService.iconName === 'Shield' && <span style={{fontSize: '18px'}}>🛡️</span>}
                      {selectedService.iconName === 'Bus' && <span style={{fontSize: '18px'}}>🚌</span>}
                      {selectedService.iconName === 'Parking' && <span style={{fontSize: '18px'}}>🅿️</span>}
                      <strong>{targetServiceSpot ? targetServiceSpot.name : selectedService.title}</strong>
                      <span style={{ fontSize: '12px', color: 'var(--tertiary)', fontWeight: 600 }}>({targetServiceSpot ? currentTargetIndex + 1 : 1}/{serviceNodesSorted.length})</span>
                    </span>
                  ) : (
                    <span className="viewport-spot-title" style={{ fontSize: '16px', fontWeight: 700 }}>
                      <strong>{sortedNodes[0].node.title}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Distance Badge matching Top HUD - Hidden if Top HUD is active to prevent duplication */}
              {!targetServiceSpot && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(255, 122, 0, 0.15), rgba(229, 57, 53, 0.1))',
                  border: '1px solid rgba(255, 122, 0, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  padding: '8px 12px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minWidth: '64px',
                  boxShadow: '0 4px 12px rgba(255, 122, 0, 0.1)',
                  flexShrink: 0
                }}>
                  <span style={{ 
                    fontSize: '18px', 
                    fontWeight: 800, 
                    color: 'var(--primary)',
                    lineHeight: 1,
                    whiteSpace: 'nowrap'
                  }}>
                    {formatDistance(sortedNodes[0].distanceMeters).replace(/[^0-9.]/g, '')}
                  </span>
                  <span style={{ 
                    fontSize: '9px', 
                    fontWeight: 700, 
                    color: 'var(--tertiary)', 
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    marginTop: '2px'
                  }}>
                    {formatDistance(sortedNodes[0].distanceMeters).replace(/[0-9.\s]/g, '') || 'M'}
                  </span>
                </div>
              )}
            </div>
            <div className="viewport-actions-row" style={{ paddingTop: '8px' }}>
              <motion.button
                className="viewport-action-btn"
                onClick={() => setIsDetailsOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>Details</span>
              </motion.button>

              <motion.a
                className="viewport-action-btn"
                href={`https://www.google.com/maps/search/?api=1&query=${activeNode.latitude},${activeNode.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                <Map size={14} />
                <span>Map</span>
              </motion.a>

              <motion.button
                className="viewport-action-btn primary"
                onClick={handleNextNearest}
                disabled={!selectedService || serviceNodesSorted.length <= 1}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
              >
                <span>Next Location</span>
                <ChevronRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
        )}
      </AnimatePresence>

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
