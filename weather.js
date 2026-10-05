// Open-Meteo forecast fetch (R1). No API key; all values come from the live API at request time.

const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const DAYTIME_START_HOUR = 8;  // inclusive, local time at the location
const DAYTIME_END_HOUR = 20;   // exclusive, so hours 8..19 count

/** Fetch 7 days of hourly + daily data for a coordinate. Throws on network or non-2xx errors. */
export async function fetchForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude,
    longitude,
    hourly: 'temperature_2m,precipitation_probability,wind_speed_10m,uv_index',
    daily: 'weather_code',
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
 * temperature = average; precipitation probability, wind, UV = maximum.
 * Days with no usable daytime values are returned with null fields so the UI can show "no data" (R14).
 */
export function reduceToDays(data) {
  const { hourly, daily } = data;
  if (!hourly || !daily || !hourly.time || !daily.time) return [];

  // Group daytime hourly values by local date (hourly.time looks like "2026-10-05T08:00")
  const byDate = new Map(daily.time.map((date) => [date, { temp: [], precip: [], wind: [], uv: [] }]));
  hourly.time.forEach((stamp, i) => {
    const [date, time] = stamp.split('T');
    const hour = Number(time.slice(0, 2));
    const bucket = byDate.get(date);
    if (!bucket || hour < DAYTIME_START_HOUR || hour >= DAYTIME_END_HOUR) return;
    bucket.temp.push(hourly.temperature_2m[i]);
    bucket.precip.push(hourly.precipitation_probability[i]);
    bucket.wind.push(hourly.wind_speed_10m[i]);
    bucket.uv.push(hourly.uv_index[i]);
  });

  return daily.time.map((date, i) => {
    const b = byDate.get(date);
    return {
      date,
      weatherCode: daily.weather_code[i] ?? null,
      temperature: average(b.temp),
      precipitationProbability: maximum(b.precip),
      windSpeed: maximum(b.wind),
      uvIndex: maximum(b.uv),
    };
  });
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
