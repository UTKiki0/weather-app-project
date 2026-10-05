// Browser Geolocation wrapper (R3, R15).
// The place is labeled "Current location": Open-Meteo has no reverse geocoding, and coordinates
// are not sent to any other service (see the privacy statement in spec.md).

/**
 * Resolve to { label, latitude, longitude }.
 * Rejects with an Error whose `reason` is 'denied' (permission refused or blocked) or 'unavailable'
 * (no support, no fix, or timeout) so the caller can show the right message.
 */
export function getDeviceLocation() {
  return new Promise((resolve, reject) => {
    if (!('geolocation' in navigator)) {
      reject(withReason('unavailable'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({
        label: 'Current location',
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      }),
      (error) => reject(withReason(error.code === error.PERMISSION_DENIED ? 'denied' : 'unavailable')),
      { timeout: 10000, maximumAge: 5 * 60 * 1000 },
    );
  });
}

function withReason(reason) {
  const error = new Error(`Device location ${reason}`);
  error.reason = reason;
  return error;
}
