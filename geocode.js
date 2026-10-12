// Open-Meteo geocoding: free-text US city or zip -> candidate places (R2, R2a).

const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const MAX_RESULTS = 5;

/**
 * Search US places. Returns an array (empty when nothing matches) of
 * { name, label, latitude, longitude }. Throws on network or non-2xx errors.
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
    return { name: r.name, label, latitude: r.latitude, longitude: r.longitude };
  });
}

/**
 * Does this result match what the user typed? A five-digit zip counts as a match (the geocoder
 * resolved it as a postal code). Otherwise the place name must equal the text, ignoring case,
 * spaces, and punctuation. The geocoder also returns fuzzy matches ("Tokyo" -> "Tokyo Hill"),
 * which the app offers as "Did you mean" choices instead of selecting automatically (R2a).
 */
export function isExactMatch(query, place) {
  const text = query.trim();
  if (/^\d{5}$/.test(text)) return true;
  return normalize(text) === normalize(place.name);
}

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

/**
 * What to do with a search's results:
 * - none: nothing matched.
 * - select: exactly one result and it matches the typed text, so use it directly.
 * - choose: show a list; `didYouMean` is true when no result matches the typed text exactly.
 */
export function planSearchOutcome(query, matches) {
  if (matches.length === 0) return { action: 'none' };
  const anyExact = matches.some((place) => isExactMatch(query, place));
  if (matches.length === 1 && anyExact) return { action: 'select', place: matches[0] };
  return { action: 'choose', didYouMean: !anyExact };
}
