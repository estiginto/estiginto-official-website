const EARTH_RADIUS_METERS = 6371008.8;

const toRadians = (degrees) => degrees * Math.PI / 180;
const toDegrees = (radians) => radians * 180 / Math.PI;

function finiteCoordinate(coordinate) {
  return Array.isArray(coordinate)
    && coordinate.length >= 2
    && coordinate.slice(0, 2).every(Number.isFinite);
}

export function haversineDistance(from, to) {
  if (!finiteCoordinate(from) || !finiteCoordinate(to)) return 0;
  const [longitudeA, latitudeA] = from.map(toRadians);
  const [longitudeB, latitudeB] = to.map(toRadians);
  const deltaLatitude = latitudeB - latitudeA;
  const deltaLongitude = longitudeB - longitudeA;
  const chord = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(latitudeA) * Math.cos(latitudeB) * Math.sin(deltaLongitude / 2) ** 2;
  return EARTH_RADIUS_METERS * 2 * Math.atan2(Math.sqrt(chord), Math.sqrt(1 - chord));
}

export function destinationPoint(center, bearing, distanceMeters) {
  if (!finiteCoordinate(center) || !Number.isFinite(distanceMeters)) return center;
  const [longitude, latitude] = center.map(toRadians);
  const angle = distanceMeters / EARTH_RADIUS_METERS;
  const direction = toRadians(bearing);
  const destinationLatitude = Math.asin(
    Math.sin(latitude) * Math.cos(angle)
      + Math.cos(latitude) * Math.sin(angle) * Math.cos(direction),
  );
  const destinationLongitude = longitude + Math.atan2(
    Math.sin(direction) * Math.sin(angle) * Math.cos(latitude),
    Math.cos(angle) - Math.sin(latitude) * Math.sin(destinationLatitude),
  );
  return [toDegrees(destinationLongitude), toDegrees(destinationLatitude)];
}

export function circleFeature(center, radius, steps = 96) {
  const pointCount = Math.max(12, Math.round(steps));
  const ring = Array.from(
    { length: pointCount },
    (_, index) => destinationPoint(center, index * 360 / pointCount, radius),
  );
  ring.push([...ring[0]]);
  return {
    type: "Feature",
    properties: { measurementKind: "circle", radius },
    geometry: { type: "Polygon", coordinates: [ring] },
  };
}

function lineFeature(coordinates, measurementKind) {
  return {
    type: "Feature",
    properties: { measurementKind },
    geometry: { type: "LineString", coordinates },
  };
}

export function measurementFeatureCollection({ circle, points = [], travelGeometry } = {}) {
  const features = [];
  if (circle?.center && Number.isFinite(circle.radius) && circle.radius > 0) {
    features.push(circleFeature(circle.center, circle.radius));
  }
  if (points.length === 2 && points.every(finiteCoordinate)) {
    features.push(lineFeature(points.map((point) => [...point]), "straight"));
  }
  if (travelGeometry?.type === "LineString" && Array.isArray(travelGeometry.coordinates)) {
    features.push(lineFeature(travelGeometry.coordinates, "travel"));
  }
  return { type: "FeatureCollection", features };
}

function decimal(value) {
  return new Intl.NumberFormat("zh-TW", { maximumFractionDigits: 2 }).format(value);
}

export function formatDistance(meters) {
  if (!Number.isFinite(meters)) return "—";
  return meters < 1000 ? `${Math.round(meters)} 公尺` : `${decimal(meters / 1000)} 公里`;
}

export function formatArea(squareMeters) {
  if (!Number.isFinite(squareMeters)) return "—";
  return squareMeters < 1000000
    ? `${Math.round(squareMeters).toLocaleString("en-US")} 平方公尺`
    : `${decimal(squareMeters / 1000000)} 平方公里`;
}
