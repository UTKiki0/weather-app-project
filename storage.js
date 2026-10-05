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
