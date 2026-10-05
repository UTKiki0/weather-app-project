// Entry point. Checkpoint 3 (in progress): location search wired to the forecast; full UI wiring comes later.
import { fetchForecast } from './weather.js';
import { searchLocations } from './geocode.js';

const form = document.getElementById('search-form');
const input = document.getElementById('location-input');
const statusEl = document.getElementById('search-status');
const resultsEl = document.getElementById('results');
const placeEl = document.getElementById('place');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  hideFeedback();
  showStatus('Searching…');

  let matches;
  try {
    matches = await searchLocations(input.value);
  } catch (error) {
    console.error('Geocoding failed:', error);
    showStatus("Couldn't reach the location service. Check your connection and try again.");
    return;
  }

  if (matches.length === 0) {
    showStatus('Location not found. Enter a US city or zip code.');
  } else if (matches.length === 1) {
    selectLocation(matches[0]); // single match: no choice to make
  } else {
    showChoices(matches);
  }
});

// Escape dismisses the list or message
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') hideFeedback();
});

function selectLocation(place) {
  hideFeedback();
  input.value = '';
  placeEl.textContent = place.label;

  // Temporary: log the forecast until the UI is wired to the recommendation state.
  fetchForecast(place.latitude, place.longitude)
    .then((days) => days.forEach((day) => console.log(place.label, JSON.stringify(day))))
    .catch((error) => console.error('Forecast failed:', error));
}

function showChoices(matches) {
  resultsEl.replaceChildren(
    ...matches.map((place) => choiceItem(place.label, () => selectLocation(place))),
    choiceItem('Cancel', hideFeedback, 'dismiss'),
  );
  statusEl.hidden = true;
  resultsEl.hidden = false;
  resultsEl.querySelector('button').focus(); // keyboard/screen-reader users land on the first option
}

function choiceItem(text, onClick, className = '') {
  const item = document.createElement('li');
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = text;
  button.className = className;
  button.addEventListener('click', onClick);
  item.append(button);
  return item;
}

function showStatus(message) {
  resultsEl.hidden = true;
  statusEl.textContent = message;
  statusEl.hidden = false;
}

function hideFeedback() {
  statusEl.hidden = true;
  resultsEl.hidden = true;
}
