// Recommendation rules (spec.md "Recommendation state and data flow" and "Content variation").
// Pure functions only: no DOM, no storage, no network, so every rule can be tested at its boundaries.

export const OUTFIT_VARIATIONS = 3;   // per category
export const REMINDER_VARIATIONS = 3; // per reminder type
export const REMINDERS = ['umbrella', 'sunscreen', 'hydration', 'windy'];
export const PRECIPITATION_THRESHOLD = 50; // % chance: umbrella reminder, -5°F effective temp, and precipitation sky code

/**
 * Turn one reduced day of weather (see weather.js) into the rule-derived part of the state.
 * Returns null when there is no temperature, so the UI can show its "no data" state (R14).
 * Values are rounded to whole numbers first, matching what the screen displays, so a shown
 * "70°F" is always categorized as 70.
 */
export function deriveRecommendation(day) {
  if (!day || !Number.isFinite(day.temperature)) return null;

  const temperature = Math.round(day.temperature);
  const precipitationProbability = roundOrZero(day.precipitationProbability);
  const windSpeed = roundOrZero(day.windSpeed);
  const uvIndex = roundOrZero(day.uvIndex);

  // Wind or likely rain makes it feel colder, so dress one step down (-5°F) for the outfit only.
  const effectiveTemp = windSpeed >= 15 || precipitationProbability >= PRECIPITATION_THRESHOLD
    ? temperature - 5
    : temperature;

  // Reminders are independent and use actual (not effective) values.
  const reminders = {
    umbrella: precipitationProbability >= PRECIPITATION_THRESHOLD,
    sunscreen: uvIndex >= 3,
    hydration: temperature >= 85,
    windy: windSpeed >= 25,
  };

  return {
    date: day.date,
    weatherCode: day.weatherCode ?? null,
    temperature,
    precipitationProbability,
    windSpeed,
    uvIndex,
    effectiveTemp,
    outfitCategory: outfitCategoryFor(effectiveTemp),
    reminders,
    scene: sceneFor(day.weatherCode, reminders.windy),
  };
}

/** Cold < 40, Cool 40-55 (inclusive), Mild above 55 up to 70 (inclusive), Warm > 70. */
export function outfitCategoryFor(effectiveTemp) {
  if (effectiveTemp < 40) return 'cold';
  if (effectiveTemp <= 55) return 'cool';
  if (effectiveTemp <= 70) return 'mild';
  return 'warm';
}

/**
 * Background scene from the WMO weather code (Open-Meteo). Priority: snow, rain, windy, then
 * cloud cover. A windy day shows the Windy scene unless precipitation takes precedence.
 */
export function sceneFor(weatherCode, windy) {
  if (isIn(weatherCode, 71, 77) || weatherCode === 85 || weatherCode === 86) return 'snowy';
  if (isIn(weatherCode, 51, 67) || isIn(weatherCode, 80, 82) || isIn(weatherCode, 95, 99)) return 'rainy';
  if (windy) return 'windy';
  if (isIn(weatherCode, 2, 3) || weatherCode === 45 || weatherCode === 48) return 'cloudy';
  return 'sunny'; // clear (0, 1) and unknown codes
}

/**
 * Attach variation indices to a derived recommendation. `saved` is what was persisted earlier for
 * this (location, date): { outfitVariationIndex, reminderVariationIndices }. Saved indices are
 * reused; anything missing is picked at random, independently per item. Returns the full state and
 * the variations object to persist.
 */
export function withVariations(recommendation, saved = {}, random = Math.random) {
  const outfitVariationIndex = validIndex(saved.outfitVariationIndex, OUTFIT_VARIATIONS)
    ?? pick(OUTFIT_VARIATIONS, random);

  const reminderVariationIndices = {};
  for (const name of REMINDERS) {
    if (!recommendation.reminders[name]) continue; // only triggered reminders get a wording
    reminderVariationIndices[name] = validIndex(saved.reminderVariationIndices?.[name], REMINDER_VARIATIONS)
      ?? pick(REMINDER_VARIATIONS, random);
  }

  const variations = { outfitVariationIndex, reminderVariationIndices };
  return { state: { ...recommendation, ...variations }, variations };
}

function roundOrZero(value) {
  return Number.isFinite(value) ? Math.round(value) : 0;
}

function isIn(value, low, high) {
  return Number.isInteger(value) && value >= low && value <= high;
}

function pick(count, random) {
  return Math.floor(random() * count);
}

// A saved index is only reusable if it is an integer inside the pool.
function validIndex(value, count) {
  return Number.isInteger(value) && value >= 0 && value < count ? value : null;
}
