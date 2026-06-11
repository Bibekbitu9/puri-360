export function formatDistance(meters: number | null): string {
  if (meters === null || isNaN(meters)) return 'Unknown distance';
  
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}
