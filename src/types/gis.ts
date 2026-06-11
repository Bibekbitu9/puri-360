export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface PanoramaNode {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  tourUrl?: string; // Optional if we construct it dynamically
}

export interface DistanceResult {
  nearestNode: PanoramaNode | null;
  distanceMeters: number | null;
}
