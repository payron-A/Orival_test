// Lightweight equirectangular-style projection: maps a set of {lat,lng} points
// into 0-100 percentage coordinates within a bounding box, with padding.
export function projectPoints<T extends { lat: number; lng: number }>(
  points: T[],
  padding = 12
): (T & { x: number; y: number })[] {
  if (points.length === 0) return [];
  const lats = points.map((p) => p.lat);
  const lngs = points.map((p) => p.lng);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const latRange = maxLat - minLat || 0.01;
  const lngRange = maxLng - minLng || 0.01;

  return points.map((p) => {
    const nx = (p.lng - minLng) / lngRange;
    const ny = 1 - (p.lat - minLat) / latRange; // invert so north is up
    const x = padding + nx * (100 - padding * 2);
    const y = padding + ny * (100 - padding * 2);
    return { ...p, x, y };
  });
}