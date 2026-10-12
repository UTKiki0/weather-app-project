// DOM rendering. Everything on the main screen is drawn from the one recommendation state
// (plus the forecast days for the strip); nothing here derives its own category or variation.
import { REMINDERS, OUTFIT_VARIATIONS } from './recommendation.js';
import {
  REMINDER_TEXT, REMINDER_LABEL, REMINDER_EMOJI, SCENE_EMOJI, SCENE_LABEL,
  CATEGORY_LABEL, CATEGORY_EMOJI, describeSky,
} from './content.js';

// Same breakpoint as the laptop layout in style.css
export const LAPTOP = window.matchMedia('(min-width: 900px)');

const $ = (id) => document.getElementById(id);
const stage = $('stage');
const placeEl = $('place');
const whenEl = $('when');
const tempEl = $('temp');
const conditionEl = $('condition');
const characterEl = $('character');
const customizeBtn = $('customize-btn');
const pillEl = $('pill');
const daysEl = $('days');

// ---- Stage views: each one fully replaces what the previous one showed (R6: no stale data) ----

export function renderEmpty() {
  showMessageStage({ place: 'Choose a location', condition: 'Search for a US city or zip code, or use your location.' });
}

export function renderLoading(place) {
  showMessageStage({ place: place.label, condition: 'Loading forecast…' });
}

export function renderError(place, message) {
  showMessageStage({ place: place.label, condition: message });
}

/** Selected day has no usable weather (R14); the strip stays so another day can be picked. */
export function renderNoData(place, date) {
  showMessageStage({ place: place.label, when: dayHeading(date, false), condition: 'No weather data is available for this day.' });
}

function showMessageStage({ place, when = '', condition }) {
  stage.removeAttribute('data-scene');
  stage.style.removeProperty('--scene-image');
  placeEl.textContent = place;
  whenEl.textContent = when;
  tempEl.textContent = '';
  conditionEl.textContent = condition;
  characterEl.replaceChildren(neutralCharacter()); // decorative: the message above says what is happening
  characterEl.removeAttribute('role');
  characterEl.removeAttribute('aria-label');
  customizeBtn.disabled = true;
  pillEl.hidden = true;
  pillEl.replaceChildren();
}

/** The full recommendation: character, background, temperature, description, pill. */
export function renderRecommendation(place, state, isToday) {
  stage.dataset.scene = state.scene;
  stage.style.setProperty('--scene-image', `url(assets/backgrounds/${state.scene}.png)`);

  placeEl.textContent = place.label;
  whenEl.textContent = dayHeading(state.date, isToday);
  tempEl.textContent = `${state.temperature}°F`;
  conditionEl.textContent = describeSky(state.weatherCode) + (state.reminders.windy ? ', windy' : '');

  renderCharacter(state);
  customizeBtn.disabled = false;
  renderPill(state);
}

function renderCharacter(state) {
  const category = CATEGORY_LABEL[state.outfitCategory];
  const style = state.outfitVariationIndex + 1;
  characterEl.setAttribute('role', 'img');
  characterEl.setAttribute('aria-label', `Character in a ${category.toLowerCase()} weather outfit, style ${style}`);
  characterEl.replaceChildren(outfitArt(state.outfitCategory, state.outfitVariationIndex, true));
}

// Outfit art at its final path; a labeled placeholder shows until the file exists.
function outfitArt(category, variationIndex, large) {
  const label = `${CATEGORY_LABEL[category]} outfit ${variationIndex + 1}`;
  return art(`assets/outfits/${category}-${variationIndex + 1}.png`, () => {
    const box = document.createElement('div');
    box.className = large ? 'character-fallback' : 'option-fallback';
    const emoji = document.createElement('span');
    emoji.textContent = CATEGORY_EMOJI[category];
    emoji.setAttribute('aria-hidden', 'true');
    const caption = document.createElement('span');
    caption.className = 'caption';
    caption.textContent = label;
    box.append(emoji, caption);
    return box;
  });
}

// An <img> that swaps itself for a fallback node if the file is missing.
function art(src, makeFallback) {
  const img = new Image();
  img.alt = '';
  img.addEventListener('error', () => img.replaceWith(makeFallback()), { once: true });
  img.src = src;
  return img;
}

function emojiArt(src, emoji) {
  return art(src, () => {
    const span = document.createElement('span');
    span.textContent = emoji;
    span.setAttribute('aria-hidden', 'true');
    return span;
  });
}

// ---- Info pill: rain and wind always; one icon per triggered reminder, wording as its caption ----

function renderPill(state) {
  const items = [
    metricItem('💧', `${state.precipitationProbability}%`, 'chance of rain'),
    metricItem('💨', `${state.windSpeed} mph`, 'wind'),
  ];
  for (const name of REMINDERS) {
    if (state.reminders[name]) items.push(reminderItem(name, state.reminderVariationIndices[name]));
  }
  pillEl.replaceChildren(...items);
  pillEl.hidden = false;
}

function metricItem(emoji, value, label) {
  const item = document.createElement('li');
  item.className = 'metric';
  const icon = document.createElement('span');
  icon.textContent = emoji;
  icon.setAttribute('aria-hidden', 'true');
  const text = document.createElement('span');
  text.className = 'label';
  text.textContent = label;
  item.append(icon, ` ${value} `, text);
  return item;
}

function reminderItem(name, wordingIndex) {
  const item = document.createElement('li');
  item.className = 'reminder';

  // Phone: a button that reveals the wording. Laptop: the wording is always visible, so the row is
  // plain content rather than a control that does nothing (same class, so the layout matches).
  const showsAsButton = !LAPTOP.matches;
  const button = document.createElement(showsAsButton ? 'button' : 'div');
  button.className = 'reminder-btn';
  if (showsAsButton) {
    button.type = 'button';
    button.setAttribute('aria-expanded', 'false');
  }

  const icon = document.createElement('span');
  icon.className = 'reminder-icon';
  icon.append(emojiArt(`assets/reminders/${name}.png`, REMINDER_EMOJI[name]));

  // The caption is the picked wording variation; the control's name reads "<type>: <wording>"
  const caption = document.createElement('span');
  caption.className = 'label';
  caption.textContent = REMINDER_TEXT[name][wordingIndex];
  const type = document.createElement('span');
  type.className = 'visually-hidden';
  type.textContent = `${REMINDER_LABEL[name]}: `;

  button.append(icon, type, caption);
  item.append(button);
  return item;
}

// ---- 7-day strip ----

/**
 * One button per day. `summaries` has { date, scene, temperature } per day, or null where a day has
 * no data. Pass an empty array to clear the strip.
 */
export function renderStrip(summaries, dates, selectedIndex) {
  daysEl.replaceChildren(...dates.map((date, index) => {
    const summary = summaries[index];
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'day';
    button.dataset.index = index;
    button.setAttribute('aria-pressed', String(index === selectedIndex));

    const tag = document.createElement('span');
    tag.className = 'day-tag';
    tag.textContent = index === 0 ? 'Today' : weekday(date, 'short');

    const icon = document.createElement('span');
    icon.className = 'day-icon';
    if (summary) icon.append(emojiArt(`assets/conditions/${summary.scene}.png`, SCENE_EMOJI[summary.scene]));
    else icon.textContent = '–';
    icon.setAttribute('aria-hidden', 'true');

    const number = document.createElement('span');
    number.className = 'day-num';
    number.textContent = String(Number(date.slice(8)));

    const when = index === 0 ? `Today, ${weekday(date, 'long')} ${monthDay(date)}` : `${weekday(date, 'long')} ${monthDay(date)}`;
    button.setAttribute('aria-label', summary
      ? `${when}: ${SCENE_LABEL[summary.scene]}, ${summary.temperature}°F`
      : `${when}: no data`);

    button.append(tag, icon, number);
    return button;
  }));
}

// ---- Customization picker (R9, R10): only the active category's variations ----

export function renderPicker(state) {
  $('outfit-dialog-title').textContent = `${CATEGORY_LABEL[state.outfitCategory]} weather outfits`;
  $('outfit-options').replaceChildren(...Array.from({ length: OUTFIT_VARIATIONS }, (_, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'outfit-option';
    button.dataset.variation = index;
    button.setAttribute('aria-pressed', String(index === state.outfitVariationIndex));
    button.setAttribute('aria-label', `${CATEGORY_LABEL[state.outfitCategory]} outfit ${index + 1}`);
    button.append(outfitArt(state.outfitCategory, index, false));
    return button;
  }));
}

// ---- Date text ----

// "Today · daytime forecast" or "Wed, Oct 7 · forecast": values are forecasts either way (R7)
function dayHeading(date, isToday) {
  return isToday
    ? `Today · ${weekday(date, 'short')}, ${monthDay(date, true)} · daytime forecast`
    : `${weekday(date, 'short')}, ${monthDay(date, true)} · forecast`;
}

// Dates are local calendar dates at the location; noon avoids any timezone rollover when formatting.
function dateOf(date) {
  return new Date(`${date}T12:00:00`);
}
function weekday(date, style) {
  return dateOf(date).toLocaleDateString('en-US', { weekday: style });
}
function monthDay(date, short = false) {
  return dateOf(date).toLocaleDateString('en-US', { month: short ? 'short' : 'long', day: 'numeric' });
}

// Neutral character shown when there is no recommendation (empty, loading, error, no data).
// Nothing is shown if the file is missing.
function neutralCharacter() {
  return art('assets/character-base.png', () => document.createElement('span'));
}

// Phone: the info pill overlays the bottom of the stage and grows taller when reminders wrap onto
// extra rows, so keep the character clear of however tall it currently is. (Laptop: the pill is in
// the right column and nothing is reserved; CSS supplies the default for when the pill is hidden.)
function updateCharacterClearance() {
  const clearance = LAPTOP.matches || pillEl.hidden ? 0 : pillEl.offsetHeight + 24;
  characterEl.style.paddingBottom = clearance ? `${Math.max(clearance, 72)}px` : '';
}
new ResizeObserver(updateCharacterClearance).observe(pillEl);
LAPTOP.addEventListener('change', updateCharacterClearance);
