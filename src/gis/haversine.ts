import type { Coordinate, PanoramaNode, DistanceResult } from '../types/gis';

// Radius of the Earth in meters
const R = 6371e3; 

/**
 * Calculates the Haversine distance between two coordinates in meters.
 */
export function calculateDistance(coord1: Coordinate, coord2: Coordinate): number {
  const lat1 = coord1.latitude;
  const lon1 = coord1.longitude;
  const lat2 = coord2.latitude;
  const lon2 = coord2.longitude;

  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const deltaPhi = ((lat2 - lat1) * Math.PI) / 180;
  const deltaLambda = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Validates if coordinates are within standard ranges.
 */
export function validateCoordinates(lat: number | null | undefined, lon: number | null | undefined): boolean {
  if (lat == null || lon == null) return false;
  if (isNaN(lat) || isNaN(lon)) return false;
  if (lat < -90 || lat > 90) return false;
  if (lon < -180 || lon > 180) return false;
  return true;
}

/**
 * Finds the nearest panorama node to the given coordinates.
 */
export function findNearestNode(userCoords: Coordinate, nodes: PanoramaNode[]): DistanceResult {
  if (!nodes || nodes.length === 0) {
    return { nearestNode: null, distanceMeters: null };
  }

  let nearestNode: PanoramaNode | null = null;
  let minDistance = Infinity;

  for (const node of nodes) {
    if (!validateCoordinates(node.latitude, node.longitude)) continue;

    const dist = calculateDistance(userCoords, { latitude: node.latitude, longitude: node.longitude });
    if (dist < minDistance) {
      minDistance = dist;
      nearestNode = node;
    }
  }

  if (!nearestNode) {
    return { nearestNode: null, distanceMeters: null };
  }

  return { nearestNode, distanceMeters: Math.round(minDistance) };
}

export interface SortedNodeResult {
  node: PanoramaNode;
  distanceMeters: number;
}

/**
 * Sorts all panorama nodes by distance to the user's coordinates.
 */
export function sortNodesByDistance(userCoords: Coordinate, nodes: PanoramaNode[]): SortedNodeResult[] {
  if (!nodes || nodes.length === 0) {
    return [];
  }

  const results: SortedNodeResult[] = [];

  for (const node of nodes) {
    if (!validateCoordinates(node.latitude, node.longitude)) continue;
    const dist = calculateDistance(userCoords, { latitude: node.latitude, longitude: node.longitude });
    results.push({ node, distanceMeters: Math.round(dist) });
  }

  return results.sort((a, b) => a.distanceMeters - b.distanceMeters);
}
