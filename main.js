// Entry point: wires search, device location, the forecast, the day strip, and the picker to the
// single recommendation state for the selected (location, date).
import { fetchForecast } from './weather.js';
import { searchLocations } from './geocode.js';
import { getDeviceLocation } from './device-location.js';
import { saveLocation, loadLocation } from './storage.js';
import './info.js';
import { deriveRecommendation } from './recommendation.js';
import { getRecommendationState, setOutfitVariation } from './state.js';
import {
  renderEmpty, renderLoading, renderError, renderNoData,
  renderRecommendation, renderStrip, renderPicker, LAPTOP,
} from './render.js';

const form = document.getElementById('search-form');
const input = document.getElementById('location-input');
const statusEl = document.getElementById('search-status');
const resultsEl = document.getElementById('results');
const daysEl = document.getElementById('days');
const pillEl = document.getElementById('pill');
const dialog = document.getElementById('outfit-dialog');

// What the screen is showing: a place, its 7 forecast days, and which day is selected.
let place = null;
let days = [];
let selectedIndex = 0;
let requestId = 0; // ignores a slow forecast that finishes after the user chose something else

// ---- Location search (R2, R2a) ----

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

// ---- Device location (R3, R15) ----

document.getElementById('device-location-btn').addEventListener('click', async () => {
  hideFeedback();
  showStatus('Finding your location…');
  try {
    selectLocation(await getDeviceLocation());
  } catch (error) {
    // Denied or unavailable: explain once and hand control back to manual search (no retry loop)
    showStatus(error.reason === 'denied'
      ? 'Location permission was denied. Search for a city or zip code instead.'
      : "Couldn't determine your location. Search for a city or zip code instead.");
    input.focus();
  }
});

// Escape dismisses the search list/message and any open reminder caption
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    hideFeedback();
    closeReminders();
  }
});

// A location the user just chose: remember it (replacing any earlier one), then show it.
function selectLocation(chosen) {
  saveLocation(chosen);
  hideFeedback();
  input.value = '';
  loadPlace(chosen);
}

// ---- Forecast loading and screen updates ----

async function loadPlace(chosen) {
  place = chosen;
  days = [];
  selectedIndex = 0;
  const thisRequest = ++requestId;

  renderLoading(place);
  renderStrip([], [], 0);

  let forecast;
  try {
    forecast = await fetchForecast(place.latitude, place.longitude);
  } catch (error) {
    if (thisRequest !== requestId) return;
    console.error('Forecast failed:', error);
    renderError(place, "Couldn't load the forecast. Check your connection and try searching again.");
    return;
  }
  if (thisRequest !== requestId) return;

  if (forecast.length === 0) {
    renderError(place, 'No forecast is available for this location.');
    return;
  }
  days = forecast;
  showSelectedDay();
}

// Redraw the whole screen for the selected day from its recommendation state (R6).
function showSelectedDay() {
  closeReminders();
  const dates = days.map((day) => day.date);
  const summaries = days.map((day) => deriveRecommendation(day));
  renderStrip(summaries, dates, selectedIndex);

  const state = getRecommendationState(place, days[selectedIndex]);
  if (!state) {
    renderNoData(place, days[selectedIndex].date);
    return;
  }
  renderRecommendation(place, state, selectedIndex === 0);
}

// Day strip: each day button selects that date (R5)
daysEl.addEventListener('click', (event) => {
  const button = event.target.closest('.day');
  if (!button) return;
  selectedIndex = Number(button.dataset.index);
  showSelectedDay();
});

// ---- Info pill: tapping a reminder icon shows its wording (phone; always visible on laptop) ----

pillEl.addEventListener('click', (event) => {
  const button = event.target.closest('button.reminder-btn');
  if (!button) return;
  const wasOpen = button.parentElement.classList.contains('open');
  closeReminders();
  if (!wasOpen) {
    button.parentElement.classList.add('open');
    button.setAttribute('aria-expanded', 'true');
  }
});

// Tapping anywhere else closes an open caption
document.addEventListener('click', (event) => {
  if (!event.target.closest('.reminder')) closeReminders();
});

function closeReminders() {
  pillEl.querySelectorAll('.reminder.open').forEach((item) => {
    item.classList.remove('open');
    item.querySelector('.reminder-btn').setAttribute('aria-expanded', 'false');
  });
}

// Crossing the phone/laptop breakpoint changes how reminders render (button vs plain text)
LAPTOP.addEventListener('change', () => {
  if (place && days.length) showSelectedDay();
});

// ---- Customization picker (R9, R10) ----

document.getElementById('customize-btn').addEventListener('click', () => {
  const state = place && days.length ? getRecommendationState(place, days[selectedIndex]) : null;
  if (!state) return;
  renderPicker(state);
  dialog.showModal();
});

document.getElementById('outfit-options').addEventListener('click', (event) => {
  const option = event.target.closest('.outfit-option');
  if (!option) return;
  setOutfitVariation(place, days[selectedIndex].date, Number(option.dataset.variation));
  dialog.close();
  showSelectedDay();
});

document.getElementById('outfit-close').addEventListener('click', () => dialog.close());

// Clicking the dimmed backdrop closes the dialog
dialog.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

// ---- Search feedback helpers ----

function showChoices(matches) {
  resultsEl.replaceChildren(
    ...matches.map((choice) => choiceItem(choice.label, () => selectLocation(choice))),
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

// ---- Startup: restore the last-used location without a new geocoding or geolocation request (R4) ----

const savedLocation = loadLocation();
if (savedLocation) {
  loadPlace(savedLocation);
} else {
  renderEmpty();
}
