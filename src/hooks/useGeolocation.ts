import { useState, useCallback } from 'react';
import type { GeolocationState } from '../types/geolocation';

const initialState: GeolocationState = {
  location: {
    latitude: null,
    longitude: null,
    accuracy: null,
    timestamp: null,
  },
  loading: false,
  error: null,
  permissionGranted: false,
};

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>(initialState);

  const requestLocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setState((prev) => ({
        ...prev,
        error: 'Geolocation is not supported by your browser',
        loading: false,
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    const startGeolocation = (highAccuracy: boolean) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState({
            location: {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              accuracy: position.coords.accuracy,
              timestamp: position.timestamp,
            },
            loading: false,
            error: null,
            permissionGranted: true,
          });
        },
        (error) => {
          // If high accuracy failed (due to timeout or unavailability), retry with low accuracy
          if (highAccuracy && (error.code === error.TIMEOUT || error.code === error.POSITION_UNAVAILABLE)) {
            console.warn('High accuracy geolocation failed. Retrying with lower accuracy...');
            startGeolocation(false);
            return;
          }

          let errorMessage = 'An unknown error occurred';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Permission to access location was denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'The request to get user location timed out';
              break;
          }
          setState((prev) => ({
            ...prev,
            loading: false,
            error: errorMessage,
            permissionGranted: false,
          }));
        },
        {
          enableHighAccuracy: highAccuracy,
          timeout: highAccuracy ? 10000 : 15000,
          maximumAge: 0,
        }
      );
    };

    startGeolocation(true);
  }, []);

  const resetLocation = useCallback(() => {
    setState(initialState);
  }, []);

  return {
    ...state,
    requestLocation,
    resetLocation,
  };
};
