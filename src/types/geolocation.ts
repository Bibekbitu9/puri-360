export interface LocationData {
  latitude: number | null;
  longitude: number | null;
  accuracy: number | null;
  timestamp: number | null;
}

export interface GeolocationState {
  location: LocationData;
  loading: boolean;
  error: string | null;
  permissionGranted: boolean;
}
