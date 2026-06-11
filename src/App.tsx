
import { ThemeToggle } from './components/ThemeToggle';
import { LocationButton } from './components/LocationButton';
import { LocationCard } from './components/LocationCard';
import { ErrorState } from './components/ErrorState';
import { useGeolocation } from './hooks/useGeolocation';

function App() {
  const { location, loading, error, permissionGranted, requestLocation } = useGeolocation();

  return (
    <div className="app-container">
      <div className="header-container">
        <ThemeToggle />
      </div>

      <main className="card">
        <h1 className="title">Current Location Tracker</h1>
        <p className="description">
          We need access to your device's location to display your current latitude and longitude coordinates.
        </p>

        {!permissionGranted && !error && (
          <LocationButton onClick={requestLocation} loading={loading} />
        )}

        {error && (
          <ErrorState message={error} onRetry={requestLocation} />
        )}

        {permissionGranted && !error && (
          <LocationCard location={location} onRefresh={requestLocation} />
        )}
      </main>
    </div>
  );
}

export default App;
