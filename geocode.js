// Open-Meteo geocoding: free-text US city or zip -> candidate places (R2, R2a).

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const MAX_RESULTS = 5;

/**
 * Search US places. Returns an array (empty when nothing matches) of
 * { label, latitude, longitude }. Throws on network or non-2xx errors.
 */
export async function searchLocations(query) {
  const name = query.trim();
  if (name.length < 2) return []; // the API returns nothing useful for 0-1 characters

  const params = new URLSearchParams({
    name,
    count: 10,
    language: 'en',
    format: 'json',
    countryCode: 'US', // US-only per brief
  });
  const response = await fetch(`${GEOCODE_URL}?${params}`);
  if (!response.ok) throw new Error(`Geocoding returned HTTP ${response.status}`);

  const { results = [] } = await response.json();
  return labelResults(results.slice(0, MAX_RESULTS));
}

// "City, State"; when two results share that label (same-named towns in one state), add the county.
function labelResults(results) {
  const base = results.map((r) => (r.admin1 ? `${r.name}, ${r.admin1}` : r.name));
  return results.map((r, i) => {
    const duplicated = base.filter((label) => label === base[i]).length > 1;
    const label = duplicated && r.admin2 ? `${base[i]} (${r.admin2})` : base[i];
    return { label, latitude: r.latitude, longitude: r.longitude };
  });
}
