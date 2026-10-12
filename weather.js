// Open-Meteo forecast fetch (R1). No API key; all values come from the live API at request time.
import { PRECIPITATION_THRESHOLD } from './recommendation.js';

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const DAYTIME_START_HOUR = 8;  // inclusive, local time at the location
const DAYTIME_END_HOUR = 20;   // exclusive, so hours 8..19 count

/** Fetch 7 days of hourly + daily data for a coordinate. Throws on network or non-2xx errors. */
export async function fetchForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    hourly: 'temperature_2m,precipitation_probability,wind_speed_10m,uv_index,weather_code',
    daily: 'weather_code', // fallback only, when no hourly codes are usable
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    timezone: 'auto',
    forecast_days: 7,
  });
  const response = await fetch(`${FORECAST_URL}?${params}`);
  if (!response.ok) throw new Error(`Open-Meteo returned HTTP ${response.status}`);
  return reduceToDays(await response.json());
}

/**
 * Reduce hourly data to one object per day over daytime hours (see spec.md "Daytime reduction"):
 * temperature = average; precipitation probability, wind, UV = maximum; weather code per pickWeatherCode.
 * Days with no usable daytime values are returned with null fields so the UI can show "no data" (R14).
 */
export function reduceToDays(data) {
  const { hourly, daily } = data;
  if (!hourly || !daily || !hourly.time || !daily.time) return [];

  // Group daytime hourly values by local date (hourly.time looks like "2026-10-05T08:00")
  const byDate = new Map(daily.time.map((date) => [date, { temp: [], precip: [], wind: [], uv: [], code: [] }]));
  hourly.time.forEach((stamp, i) => {
    const [date, time] = stamp.split('T');
    const hour = Number(time.slice(0, 2));
    const bucket = byDate.get(date);
    if (!bucket || hour < DAYTIME_START_HOUR || hour >= DAYTIME_END_HOUR) return;
    bucket.temp.push(hourly.temperature_2m?.[i]);
    bucket.precip.push(hourly.precipitation_probability?.[i]);
    bucket.wind.push(hourly.wind_speed_10m?.[i]);
    bucket.uv.push(hourly.uv_index?.[i]);
    bucket.code.push(hourly.weather_code?.[i]);
  });

  return daily.time.map((date, i) => {
    const b = byDate.get(date);
    const precipitationProbability = maximum(b.precip);
    return {
      date,
      weatherCode: pickWeatherCode(b.code, precipitationProbability) ?? daily.weather_code?.[i] ?? null,
      temperature: average(b.temp),
      precipitationProbability,
      windSpeed: maximum(b.wind),
      uvIndex: maximum(b.uv),
    };
  });
}

// WMO codes that mean precipitation is falling, ranked by severity (higher = more severe).
const PRECIPITATION_SEVERITY = new Map([
  [51, 1], [53, 2], [55, 3], [56, 4], [57, 5],            // drizzle, freezing drizzle
  [61, 6], [63, 7], [65, 8], [66, 9], [67, 10],           // rain, freezing rain
  [71, 11], [73, 12], [75, 13], [77, 11],                 // snow
  [80, 6], [81, 7], [82, 8], [85, 12], [86, 13],          // showers
  [95, 14], [96, 15], [99, 15],                           // thunderstorms
]);

/**
 * Sky code for the day's daytime hours, chosen so the description agrees with the umbrella rule:
 * - if the rain chance reaches the umbrella threshold, the most severe precipitation code in the window;
 * - otherwise the most common code in the window (ties go to the more severe code).
 * Returns null when there are no usable hourly codes.
 */
export function pickWeatherCode(codes, precipitationProbability) {
  const usableCodes = usable(codes);
  if (usableCodes.length === 0) return null;

  if (Math.round(precipitationProbability ?? 0) >= PRECIPITATION_THRESHOLD) {
    const wet = usableCodes.filter((code) => PRECIPITATION_SEVERITY.has(code));
    if (wet.length > 0) return wet.reduce((worst, code) => (severity(code) > severity(worst) ? code : worst));
  }

  const counts = new Map();
  usableCodes.forEach((code) => counts.set(code, (counts.get(code) ?? 0) + 1));
  return [...counts.entries()].reduce((best, entry) => {
    const [bestCode, bestCount] = best;
    const [code, count] = entry;
    return count > bestCount || (count === bestCount && severity(code) > severity(bestCode)) ? entry : best;
  })[0];
}

// Precipitation codes use the table above; clear/cloud/fog codes rank below all of them by code number.
function severity(code) {
  return PRECIPITATION_SEVERITY.get(code) ?? code / 100;
}

// Ignore null entries (the API can return nulls); return null if nothing is left.
function usable(values) {
  return values.filter((v) => typeof v === 'number');
}
function average(values) {
  const v = usable(values);
  return v.length ? v.reduce((sum, x) => sum + x, 0) / v.length : null;
}
function maximum(values) {
  const v = usable(values);
  return v.length ? Math.max(...v) : null;
}
