// The one recommendation state per (location, date). Every visual and written output reads this
// object and nothing else (spec.md "Recommendation state").
import { deriveRecommendation, withVariations } from './recommendation.js';
import { loadVariations, saveVariations } from './storage.js';

/**
 * Build the state for one day at one place, reusing saved variations for that (location, date)
 * and saving any newly chosen ones. Returns null when the day has no usable weather.
 */
export function getRecommendationState(place, day) {
  const recommendation = deriveRecommendation(day);
  if (!recommendation) return null;

  const key = variationKey(place, day.date);
  const { state, variations } = withVariations(recommendation, loadVariations(key));
  saveVariations(key, variations);
  return state;
}

/** A manual pick from the customization picker replaces the saved outfit for that date (R10). */
export function setOutfitVariation(place, date, outfitVariationIndex) {
  const key = variationKey(place, date);
  saveVariations(key, { ...loadVariations(key), outfitVariationIndex });
}

// Coordinates rounded to ~1 km so the same place always gets the same key, including device
// locations (whose label is always "Current location").
function variationKey(place, date) {
  return `${place.latitude.toFixed(2)},${place.longitude.toFixed(2)}|${date}`;
}
