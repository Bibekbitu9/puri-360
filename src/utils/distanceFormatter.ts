export function formatDistance(meters: number | null): string {
  if (meters === null || isNaN(meters)) return 'Unknown distance';
  
  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }
  
  const km = (meters / 1000).toFixed(1);
  return `${km} km`;
}

export function formatDistanceMiles(meters: number | null): string {
  if (meters === null || isNaN(meters)) return 'Unknown distance';
  
  const miles = meters * 0.000621371;
  if (miles < 0.1) {
    const feet = Math.round(meters * 3.28084);
    return `${feet} ft`;
  }
  
  return `${miles.toFixed(1)} mi`;
}
