// localStorage persistence. Every access is wrapped: storage can throw (private windows, blocked
// site data) or hold unexpected data, and the app must still work without it.

const LOCATION_KEY = 'weatherwear.location';

/** Save the most recent location only, overwriting any previous one (R4). */
export function saveLocation({ label, latitude, longitude }) {
  try {
    localStorage.setItem(LOCATION_KEY, JSON.stringify({ label, latitude, longitude }));
  } catch (error) {
    console.warn('Could not save location:', error);
  }
}

const VARIATIONS_KEY = 'weatherwear.variations';

/** Saved variation indices for one (location, date) key, or {} if none or unusable. */
export function loadVariations(key) {
  return readVariations()[key] ?? {};
}

/** Save variation indices for one key; other keys are kept (they accumulate per spec.md). */
export function saveVariations(key, variations) {
  try {
    localStorage.setItem(VARIATIONS_KEY, JSON.stringify({ ...readVariations(), [key]: variations }));
  } catch (error) {
    console.warn('Could not save variations:', error);
  }
}

function readVariations() {
  try {
    const all = JSON.parse(localStorage.getItem(VARIATIONS_KEY));
    return all && typeof all === 'object' && !Array.isArray(all) ? all : {};
  } catch (error) {
    return {};
  }
}

/** Return the saved { label, latitude, longitude }, or null if none or unusable. */
export function loadLocation() {
  try {
    const saved = JSON.parse(localStorage.getItem(LOCATION_KEY));
    const valid = saved
      && typeof saved.label === 'string'
      && Number.isFinite(saved.latitude)
      && Number.isFinite(saved.longitude);
    return valid ? saved : null;
  } catch (error) {
    return null;
  }
}
