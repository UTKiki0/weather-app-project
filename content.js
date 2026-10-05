// Text and placeholder content. Edit wording here; the rules live in recommendation.js.

// Three wording variations per reminder (brief requirement); one is picked per (location, date).
export const REMINDER_TEXT = {
  umbrella: [
    "Rain's likely. Grab an umbrella.",
    "Don't get caught out. Pack an umbrella.",
    'Showers on the way. Bring your umbrella.',
  ],
  sunscreen: [
    'UV is high. Put on sunscreen.',
    "Strong sun today. Don't skip the sunscreen.",
    'Sunscreen weather. Cover up before you head out.',
  ],
  hydration: [
    "It's hot. Bring extra water.",
    'Stay hydrated. Carry a water bottle.',
    'Heat alert for your day. Drink up.',
  ],
  windy: [
    'Windy out there. Hold onto your hat.',
    'Gusty day. Secure your layers.',
    'Strong winds expected. Dress to stay put.',
  ],
};

export const REMINDER_LABEL = {
  umbrella: 'Umbrella reminder',
  sunscreen: 'Sunscreen reminder',
  hydration: 'Extra hydration reminder',
  windy: 'Wind reminder',
};

// Placeholder emoji, used until the AI-generated art exists in assets/ (see assets/README.md).
export const REMINDER_EMOJI = { umbrella: '☂️', sunscreen: '🧴', hydration: '🥤', windy: '🌬️' };
export const SCENE_EMOJI = { sunny: '☀️', cloudy: '☁️', rainy: '🌧️', snowy: '❄️', windy: '💨' };
export const SCENE_LABEL = { sunny: 'Sunny', cloudy: 'Cloudy', rainy: 'Rainy', snowy: 'Snowy', windy: 'Windy' };
export const CATEGORY_LABEL = { cold: 'Cold', cool: 'Cool', mild: 'Mild', warm: 'Warm' };
export const CATEGORY_EMOJI = { cold: '🧥', cool: '🧶', mild: '👕', warm: '🩳' };

// Short sky description from the WMO weather code (Open-Meteo).
const SKY_BY_CODE = new Map([
  [0, 'Clear and sunny'], [1, 'Mostly sunny'], [2, 'Partly cloudy'], [3, 'Overcast'],
  [45, 'Foggy'], [48, 'Foggy'],
  [51, 'Light drizzle'], [53, 'Drizzle'], [55, 'Heavy drizzle'], [56, 'Freezing drizzle'], [57, 'Freezing drizzle'],
  [61, 'Light rain'], [63, 'Rain'], [65, 'Heavy rain'], [66, 'Freezing rain'], [67, 'Freezing rain'],
  [71, 'Light snow'], [73, 'Snow'], [75, 'Heavy snow'], [77, 'Snow grains'],
  [80, 'Light rain showers'], [81, 'Rain showers'], [82, 'Heavy rain showers'],
  [85, 'Snow showers'], [86, 'Heavy snow showers'],
  [95, 'Thunderstorms'], [96, 'Thunderstorms with hail'], [99, 'Thunderstorms with hail'],
]);

export function describeSky(weatherCode) {
  return SKY_BY_CODE.get(weatherCode) ?? 'Conditions unavailable';
}
