// Entry point. Checkpoint 3 (in progress): confirm the forecast pipeline in the console before wiring the UI.
import { fetchForecast } from './weather.js';

// Fixed test location (Austin, TX) until search and device location are added.
fetchForecast(30.2672, -97.7431)
  .then((days) => days.forEach((day) => console.log(JSON.stringify(day))))
  .catch((error) => console.error('Forecast failed:', error));
