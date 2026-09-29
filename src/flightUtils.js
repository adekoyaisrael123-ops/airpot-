const AGGREGATE_AIRPORT_NAMES = {
  lagos: ['lagos', 'murtala muhammed', 'murtala', 'los', 'los airport'],
};

function normalize(value = '') {
  return String(value).trim().toLowerCase();
}

function matchesAirportName(value, aliases) {
  const normalized = normalize(value);
  return aliases.some(alias => normalized === alias || normalized.includes(alias));
}

export function detectFlightDirection(plane = {}) {
  if (!plane) return 'unknown';

  const from = normalize(plane.from);
  const to = normalize(plane.to);

  if (matchesAirportName(to, AGGREGATE_AIRPORT_NAMES.lagos)) {
    return 'coming';
  }

  if (matchesAirportName(from, AGGREGATE_AIRPORT_NAMES.lagos)) {
    return 'going';
  }

  return 'unknown';
}

export function getFlightDirectionLabel(plane = {}) {
  const direction = detectFlightDirection(plane);

  if (direction === 'coming') return 'Coming';
  if (direction === 'going') return 'Going';
  return 'En route';
}
