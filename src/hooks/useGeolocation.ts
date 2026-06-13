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
        error: 'Geolocation is not supported by your browser (requires secure HTTPS connection)',
        loading: false,
      }));
      return;
    }

    // Update loading state first, before invoking geolocation API.
    // This prevents race conditions/state overwrites if the API returns immediately.
    setState((prev) => ({ ...prev, loading: true, error: null }));

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
        let errorMessage = 'An unknown error occurred';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permission to access location was denied. Please check your browser/system settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'The request to get user location timed out.';
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
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 10000, // Allow using cached location if it is fresh (<10s) to speed up lock on mobile devices
      }
    );
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
