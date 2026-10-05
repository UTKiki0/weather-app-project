# Technical Specification

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved research, project brief, and hand-drawn screen designs into testable requirements.

## Instructions for the Developer

Make and approve the product decisions, draw every proposed screen, provide the drawings to the Agent, and keep this file current as the intended result changes.

To begin, open the project repository in a fresh chat and enter:

`Read ./spec.md and help me begin the Project 3 specification.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, `research.md`, and this file. Review the screen drawings the Developer provides. Ask one focused question at a time, surface gaps and trade-offs without inventing requirements, and keep the specification concise and testable.

## Goal

Help a US college student quickly decide what to wear for a given day and location by turning live weather data into one character-driven recommendation — an outfit, a written description, and relevant reminders (umbrella, sunscreen, hydration, wind) — without needing to separately check a weather app and reason about clothing themselves. Supports both the time-pressed daily glance (user story 1) and advance outfit planning for upcoming days or other locations (user stories 2 & 3), plus unplanned condition changes (user story 4).

## Screen designs

Two screens: **Main** (character, outfit, weather summary, location and date controls, 7-day outfit strip that doubles as the date picker) and **Info** (creator, weather-data source, recommendation methods/sources, privacy practices, art credits).

### Main screen — phone

[07-main-screen-phone.jpg](reference/07-main-screen-phone.jpg)

- Top bar: free-text location search field, with a device-location icon and an info icon beside it (info icon navigates to the Info screen).
- Character area: character illustration on a weather-reflective background (e.g. sun/cloud/rain cues), current temperature displayed near the top, a short description of current/upcoming sky conditions.
- Below the character: an info pill showing precipitation chance and wind speed (always shown), plus sunscreen and hydration icons (shown only when their threshold is triggered).
- A customization button near the character opens a picker limited to the outfit variations belonging to the current weather category (e.g. the 3 "Cold" variations). Picking one overrides the random default and persists for that date; default on first load of a date is still a random variation from the category.
- Bottom: a horizontal 7-day strip (today + 6 future days), each day shown as a weather emoji/icon over a date number. Tapping a day selects it as the active date, updating the whole screen (character, pill, description) to that day's recommendation state.

### Main screen — laptop

[08-main-screen-laptop.jpg](reference/08-main-screen-laptop.jpg)

Two-column layout using the extra width rather than a stretched phone view:

- Left column: character illustration on weather-reflective background, temperature, customization button — same behavior as phone.
- Right column, top: location search field with device-location icon and info icon.
- Right column, middle: info pill — precipitation chance, wind speed (always shown), sunscreen/hydration icons (conditional, same triggers as phone).
- Right column, bottom: "upcoming days" strip — same today + 6 future days, weather emoji per day, click to select — same date-selection behavior as phone.

### Info screen

[09-info-screen.jpg](reference/09-info-screen.jpg)

One drawing serves both phone and laptop; only the container differs (see Laptop placement below).

- Top: a back button (left arrow) to return to the Main screen.
- "Created by: Kjartan Knutson-Ho" shown as plain text near the top.
- Four collapsible dropdown sections (collapsed by default, expand on tap/click): **Weather data** (names Open-Meteo), **Methodology** (recommendation methods and sources — temperature bands, UV/precipitation/wind thresholds, per `research.md`), **Privacy practice** (location used only to query Open-Meteo; most recent location saved only in local browser storage; no accounts or other server-side storage), **Art credits** (art is AI-generated; UI icons credited to their open-source library — see Assets). Together with the creator line, these cover all five R16 content items.

**Phone placement:** full screen, replacing the Main screen until the back button is tapped.

**Laptop placement:** a right-half panel (matching the Main screen's two-column split) that slides in over the Main screen's right column (location bar, pill, day strip). The left column (character) stays visible and unchanged while Info is open. The back button or clicking outside the panel returns to the Main screen's normal right column.

Draw every proposed screen by hand, in both phone and laptop layouts, on paper, a tablet, a whiteboard, or another hand-drawing surface. Save photos or exports in `reference/`, provide them to the Agent, and link them here. Use the drawings to define layout, hierarchy, controls, navigation, and important interaction states.

## Requirements

Translate every fixed brief requirement and the selected research-driven feature into a testable requirement. Define the chosen behavior, content, controls, current and forecast data, responsive layout, accessibility, error handling, privacy, credits, and deployment. The main screen should make clear the location, date, units, data source, and whether conditions are current or forecast. Include an acceptance check for each requirement.

### Location and data source

- **R1 — Live provider data.** All current and forecast weather values (temperature, precipitation probability, UV index, wind speed) come from the Open-Meteo API at request time; no hard-coded or mock weather values ship in the app.
  *Acceptance:* Changing the selected location or date triggers a new Open-Meteo request, visible in the network tab, and the displayed values match the raw API response for that location/date.
- **R2 — Manual location entry.** A free-text search field resolves a US city or zip to coordinates via Open-Meteo's geocoding endpoint.
  *Acceptance:* Entering a valid US city name or zip returns a matching location and updates the forecast; entering an unrecognized or non-US term shows a clear "location not found" message without crashing.
- **R3 — Device location.** A location icon requests the browser's geolocation and, on success, uses those coordinates for the forecast.
  *Acceptance:* Granting permission updates the displayed location/forecast to the device's position; denying permission falls back to manual entry with a visible message (see R13).
- **R4 — Save most recent location only.** The most recently resolved location (manual or device) is saved to local browser storage, overwriting any prior saved location.
  *Acceptance:* Reloading the page restores the last-used location without a new geocoding/geolocation prompt; selecting a new location replaces the saved one (no list of multiple saved locations).

### Date selection

- **R5 — Forecast range.** Users can select today or any of the next 6 forecast days (7 total) via the day strip.
  *Acceptance:* Each of the 7 day entries is selectable, and the strip does not offer an 8th day or a past day.
- **R6 — Date selection updates everything.** Selecting a day in the strip updates the character, temperature, description, pill, and reminders to that day's recommendation state.
  *Acceptance:* Selecting a different day changes the displayed temperature and (when applicable) outfit category to match that day's forecast, with no stale data from the previously selected day left on screen.

### Main screen clarity

- **R7 — Location, date, units, source, and current/forecast status are all visible.** The main screen always shows: the active location name, the active date (or "Today"), temperature in °F and wind in mph, and whether the shown conditions are current ("Today") or a forecast for a future date.
  *Acceptance:* A person unfamiliar with the app can state the displayed location, date, and whether it's "today" or a forecast day, from the main screen alone, without opening the Info screen.
- **R8 — Data source disclosed.** The Info screen names Open-Meteo as the weather data source.
  *Acceptance:* Open-Meteo is named in text on the Info screen (see R16).

### Outfit customization

- **R9 — Customization picker scoped to current category.** The clothing-customization button opens a picker showing only the outfit variations belonging to the active day's weather category (e.g. only the 3 "Cold" variations when the category is Cold).
  *Acceptance:* Changing the selected day to a different weather category and reopening the picker shows that category's variations, not the previous category's.
- **R10 — Manual pick overrides and persists.** Selecting a variation in the picker replaces the randomly-chosen default for that date and is remembered if the user navigates away and returns to that date in the same session (see Content variation for reload persistence).
  *Acceptance:* After manually picking a variation, switching to another day and back shows the manually picked variation, not a newly randomized one.

### Responsive layout and accessibility

- **R11 — Responsive, platform-appropriate layout.** The app adapts between a one-column phone layout (per [07-main-screen-phone.jpg](reference/07-main-screen-phone.jpg)) and a two-column laptop layout (per [08-main-screen-laptop.jpg](reference/08-main-screen-laptop.jpg)), rather than scaling one layout to fit both.
  *Acceptance:* Viewed at a phone width, the layout matches the phone sketch's single-column structure; viewed at a laptop width, it matches the two-column sketch — neither is a stretched/shrunk copy of the other.
- **R12 — One-handed phone use.** All interactive controls on the phone layout (location search, device-location icon, info icon, customization button, each day in the strip) meet at least a 44×44 CSS px touch target and sit within comfortable thumb reach (lower two-thirds of the screen where feasible).
  *Acceptance:* Every interactive control measures at least 44×44 CSS px in the phone layout.
- **R13 — Accessibility baseline.** Text over weather backgrounds meets WCAG AA contrast (4.5:1 normal text, 3:1 large text/UI); weather/recommendation state is never conveyed by color alone (icon + text label); all icons (weather, reminders, controls) have text alternatives (alt text/aria-label).
  *Acceptance:* A contrast-checking tool confirms 4.5:1/3:1 on rendered text; a screen reader announces a label for every icon-only control.

### Error handling

- **R14 — Loading, missing data, and service errors.** The app shows a loading state while fetching, a clear message when Open-Meteo returns no data for a location/date, and a clear message on request failure (network error, non-2xx response) — none of these states show a blank screen or a broken character.
  *Acceptance:* Simulating a slow/failed/empty API response (e.g. via dev tools network throttling/blocking) shows the corresponding state's message instead of a blank or broken screen.
- **R15 — Denied location permission.** If the browser denies or blocks the geolocation request, the app shows a clear message and falls back to the manual search field (does not get stuck retrying or show a generic error).
  *Acceptance:* Denying the browser's location permission prompt shows the fallback message and leaves manual search usable.

### Privacy, credits, and deployment

- **R16 — Info screen content.** The Info screen identifies the creator, names Open-Meteo as the weather data source, explains the recommendation methods and cites their sources (temperature bands, UV/precipitation/wind thresholds per `research.md`), states the privacy practice (location used only to query Open-Meteo; most recent location saved only in local browser storage; no accounts or other server-side storage), and credits the art (AI-generated, per `research.md`), per [09-info-screen.jpg](reference/09-info-screen.jpg).
  *Acceptance:* Each of the five items (creator, data source, methods/sources, privacy, art credit) appears as readable text on the Info screen; the four dropdown sections (Weather data, Methodology, Privacy practice, Art credits) expand/collapse independently.
- **R17 — Info screen navigation and laptop placement.** The info icon on Main opens the Info screen; a back button returns to Main. On phone, Info is a full-screen view. On laptop, Info opens as a right-half panel over the Main screen's right column, while the left column (character) remains visible and unchanged.
  *Acceptance:* On a phone-width viewport, opening Info covers the full screen; on a laptop-width viewport, opening Info leaves the character (left column) visible and only occupies the right half.
- **R18 — Public HTTPS deployment.** The app is deployed to a public HTTPS URL via GitHub Pages.
  *Acceptance:* The deployed URL loads over HTTPS and functions identically to the local build.

## Recommendation state and data flow

Define the weather inputs, recommendation categories, coded rules, and shared state. Weather values must come from the provider, and rules must follow the weather guidance cited in `research.md`. The selected location, date, and live weather data must produce one recommendation state that drives every visual and written output.

**Weather inputs** (from Open-Meteo, per selected location + date): actual temperature (°F), precipitation probability (%), UV index, wind speed (mph), weather code (for condition icon/background).

**Effective temperature** (used only for outfit category): `effectiveTemp = actualTemp - 5°F` if wind speed ≥ 15 mph OR precipitation probability ≥ 50%, otherwise `effectiveTemp = actualTemp`. (This -5°F adjustment is separate from the Windy reminder's own 25 mph threshold below — a day can trigger the effective-temperature drop without triggering the Windy reminder, and vice versa.)

**Outfit category** (by effective temperature, per `research.md`):
| Category | Range |
|---|---|
| Cold | < 40°F |
| Cool | 40–55°F |
| Mild | 55–70°F |
| Warm | > 70°F |

**Reminders** (independent boolean triggers, evaluated on actual values, per `research.md`):
| Reminder | Trigger |
|---|---|
| Umbrella | precipitation probability ≥ 50% |
| Sunscreen | UV index ≥ 3 |
| Extra hydration | actual temperature ≥ 85°F |
| Windy | wind speed ≥ 25 mph |

**Recommendation state.** For each (location, date) pair, one state object holds: `outfitCategory`, `outfitVariationIndex`, the active reminder flags, each active reminder's chosen wording-variation index, and the raw weather values (actual temperature, precipitation probability, UV index, wind speed, weather code) used to derive them. This single object is the only source read by the character/outfit art, the weather icon/background, the temperature/condition text, the written recommendation text, and the reminder icons/text — no component derives its own copy of category or variation independently. `outfitVariationIndex` and reminder wording indices are assigned per Content variation below.

## Content variation

Define at least three outfit variations for each recommendation category and at least three wording variations for each reminder type. Define how outfit and reminder variations are chosen independently at random, and how a previously selected date keeps the same variations, including whether they persist after the page reloads.

**Variation pools.** Each of the 4 outfit categories (Cold, Cool, Mild, Warm) has exactly 3 outfit variations. Each of the 4 reminder types (Umbrella, Sunscreen, Extra hydration, Windy) has exactly 3 wording variations.

**Random selection.** The first time a given (location, date) pair is viewed, the app independently picks: one random outfit variation index (0–2) from the active category's pool, and, for each reminder that is currently triggered, one random wording variation index (0–2) from that reminder's pool. These picks are independent of each other (e.g. the outfit pick doesn't influence which umbrella wording is chosen).

**Persistence.** The chosen indices are saved to `localStorage`, keyed by `(location, date)`. Returning to a previously viewed (location, date) pair — whether by navigating the day strip in the same visit or reloading the page later — reads the saved indices instead of re-randomizing. A manual pick from the customization picker (R10) overwrites the saved outfit index for that (location, date) key. Changing location re-randomizes variations for the new (location, date) pair, since it's treated as a new recommendation (its weather, and possibly its category, may differ).

**Scope of saved data.** Unlike the single most-recent saved location (R4), variation choices accumulate per (location, date) key as the user browses, so the user doesn't lose a manual customization pick by navigating away and back. No limit is placed on how many (location, date) entries are retained, since the forecast window is fixed at 7 days and old entries age out naturally as dates fall outside that window.

## Assets

List every art and graphical asset: the character, each outfit variation, icons, and any other visuals. For each, note where it appears, its format, and whether it will be created, generated, or licensed, with its credit or license.

| Asset | Count | Appears | Format | Source |
|---|---|---|---|---|
| Base character (neutral, no outfit) | 1 | Loading state and error-state placeholder, Main screen | PNG, transparent background | AI-generated |
| Outfit variations (3 per category × Cold/Cool/Mild/Warm) | 12 | Main character art, Main screen, selected by recommendation state's category + `outfitVariationIndex` | PNG, transparent background | AI-generated |
| Background scenes (Sunny, Cloudy, Rainy, Snowy, Windy) | 5 | Behind the character, Main screen; selected by mapping the Open-Meteo weather code (and the Windy reminder trigger) to one of the 5 scenes | PNG or JPG | AI-generated |
| Weather condition icons (Sunny, Cloudy, Rainy, Snowy, Windy — same 5 conditions as backgrounds) | 5 | 7-day strip (one per day), main condition display | PNG, transparent background | AI-generated |
| Reminder icons (Umbrella, Sunscreen, Extra hydration, Windy) | 4 | Info pill, shown only when that reminder is triggered | PNG, transparent background | AI-generated |
| UI control icons (search, device-location pin, info, customization button) | 4 | Location bar and customization button, Main screen | SVG | Open-source icon library (e.g. Lucide) — library license credited on Info screen |

**Total custom art:** 1 base character + 12 outfit variations + 5 backgrounds + 5 condition icons + 4 reminder icons = 27 AI-generated assets, plus 4 library UI icons. All AI-generated assets are credited as AI-generated on the Info screen (R16); the UI icon library's license is credited alongside it.

## Out of scope

Record features intentionally excluded from this project.

- International (non-US) locations — brief scopes the app to US locations only; Open-Meteo's geocoding is not restricted to US results, so out-of-US matches are treated as unsupported (R2).
- Multiple saved locations — only the single most-recently-used location is saved (R4); no saved-location list or favorites.
- Offline use / cached forecasts — the app requires a live connection each time it checks weather; no offline mode or cached-data fallback.
- User accounts or login — no authentication; the saved location and variation choices live in local browser storage only.
- Metric units (°C, km/h) — the app displays Fahrenheit/mph only; no unit toggle.
- Past-date weather — only today and the next 6 forecast days are selectable; no historical weather lookup.
- Hourly forecast detail — recommendations are daily, not broken down by hour.
- General character/avatar customization — the customization picker only lets the user choose among the current weather category's outfit variations (R9); no free-form color/accessory/cosmetic customization unrelated to weather.
- Social sharing or exporting the character/recommendation (e.g. share to social media, download image).
- Push notifications or reminders outside the app (e.g. a daily alert to check the app) — reminders only display while the app is open.

## Revisions

After implementation or testing, record requirement changes and the evidence that prompted them. Update the screen drawings when a material layout or interaction changes.

## Approval

The Developer reviews and explicitly approves this specification and its screen designs before planning begins.

**Approved by Developer on 2026-10-05.**

## Saving the transcript

After the Developer approves the specification, ask them to enter `save transcript`. When directed, save the complete conversation as `transcripts/spec-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.
