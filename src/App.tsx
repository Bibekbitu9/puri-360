import { useState, useEffect } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import { LocationButton } from './components/LocationButton';
import { LocationCard } from './components/LocationCard';
import { ErrorState } from './components/ErrorState';
import { NearestPanoramaCard } from './components/NearestPanoramaCard';
import { PanoViewer } from './components/PanoViewer';
import { useGeolocation } from './hooks/useGeolocation';
import { MetadataService } from './services/MetadataService';
import { findNearestNode } from './gis/haversine';
import type { PanoramaNode, DistanceResult } from './types/gis';

function App() {
  const { location, loading, error, permissionGranted, requestLocation } = useGeolocation();
  const [panoramas, setPanoramas] = useState<PanoramaNode[]>([]);
  const [nearestResult, setNearestResult] = useState<DistanceResult>({ nearestNode: null, distanceMeters: null });
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Load panoramas on mount
  useEffect(() => {
    MetadataService.getPanoramas().then(setPanoramas);
  }, []);

  // Recalculate nearest node when location or panoramas change
  useEffect(() => {
    if (permissionGranted && location.latitude !== null && location.longitude !== null && panoramas.length > 0) {
      const result = findNearestNode(
        { latitude: location.latitude, longitude: location.longitude },
        panoramas
      );
      setNearestResult(result);
    }
  }, [location.latitude, location.longitude, permissionGranted, panoramas]);

  return (
    <div className="app-container">
      <div className="header-container">
        <ThemeToggle />
      </div>

      <main className="card">
        <h1 className="title">GIS Navigator</h1>
        <p className="description">
          Find and navigate to the nearest 360° Virtual Tour based on your current location.
        </p>

        {!permissionGranted && !error && (
          <LocationButton onClick={requestLocation} loading={loading} />
        )}

        {error && (
          <ErrorState message={error} onRetry={requestLocation} />
        )}

        {permissionGranted && !error && (
          <>
            <LocationCard location={location} onRefresh={requestLocation} />
            
            {nearestResult.nearestNode && nearestResult.distanceMeters !== null && (
              <NearestPanoramaCard 
                node={nearestResult.nearestNode} 
                distanceMeters={nearestResult.distanceMeters}
                onOpen={() => setIsViewerOpen(true)}
              />
            )}
          </>
        )}
      </main>

      {isViewerOpen && nearestResult.nearestNode && (
        <PanoViewer 
          nodeId={nearestResult.nearestNode.id} 
          onClose={() => setIsViewerOpen(false)} 
        />
      )}
    </div>
  );
}

export default App;
