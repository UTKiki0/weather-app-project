# Research

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Research your context of use, references, weather guidance, technical options, and choices that will guide the specification.

## Instructions for the Developer

Judge sources and recommendations, make the consequential decisions, and keep this file current as the work develops.

To begin, open the project repository in a fresh chat and enter:

`Read ./research.md and help me begin Project 3 research.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, and this file. Ask one focused question at a time. Help investigate and compare options without deciding for the Developer. Verify sources directly and keep this file concise.

## Context of use

As the User, describe when and where you would use the app and what you need from it. Record important circumstances, assumptions, and limitations.

Used in the morning while deciding what to wear for the day based on the day's weather, on either a phone or a laptop. Most checks are a quick glance (time-pressed, e.g. getting ready), but the app must also support browsing forecast days ahead for users who like to plan outfits in advance. A home location is the preset default for ease of use, but the location can be changed to check a different area (e.g. traveling or planning for a trip).

Assumptions and limitations:
- US locations only (per brief) — no international city search needed.
- Requires an internet connection when checking — no offline caching of forecasts.
- Single saved location — per brief, only the most recent location is saved on the device; switching overwrites the previous save (no multi-location list).
- Location permission may be denied — user can still proceed via manual entry (required error state, per brief).
- No accounts/login — local device storage is sufficient for the saved location.

## User story

Write at least one user story grounded in your context of use:

> As a [type of user], I want to [need or goal], so that [reason or outcome].

Focus on the need rather than prescribing an interface or feature.

1. As a student getting ready in the morning, I want to quickly see what to wear based on today's weather, so that I don't have to check a separate weather app and figure out clothing myself.
2. As a student planning ahead, I want to check outfit recommendations for upcoming days, so that I can prepare or pack the right clothing in advance.
3. As a student traveling or visiting a different city, I want to get weather-based outfit advice for a location other than home, so that I'm dressed appropriately even when away from my usual area.
4. As a student caught off guard by changing conditions, I want to be reminded of things like umbrellas, sunscreen, or extra hydration, so that I don't forget something I'd need but wouldn't necessarily think to check for.

## References

Collect 5–10 reference images from relevant products and interfaces. Save each image in `reference/`, identify its source, and record a brief observation about what is useful, ineffective, or relevant to this project. Reference images are examples only; do not use them in the app.

1. `01-weather-frog-character.png` — screenshot, app unidentified (inspo only). Minimalist weather style with a character on screen and a background that reflects current weather conditions.
2. `02-weather-hills-forecast.png` — screenshot, app unidentified (inspo only). Same minimalist weather style: simple temperature display, room for a character, weather-reflective background.
3. `03-dressup-outfit-picker.png` — screenshot, app unidentified (inspo only). Ability to select different clothing/accessory items around a central character figure — relevant to picking outfit variations per weather condition.
4. `04-clothing-icon-chart.png` — screenshot, app unidentified (inspo only). Labeled reference chart of clothing items (cap, hat, umbrella, jacket, etc.) — useful for enumerating outfit and accessory categories.
5. `05-avatar-customization.png` — screenshot, app unidentified (inspo only). Avatar customization interface with distinct clothing categories (shirt, sleeves, pants, shoes, etc.) — relevant to structuring outfit variation by category.
6. `06-weather-avatar-yard.png` — screenshot, app unidentified (inspo only). Minimalist weather style: character standing in a weather-reflective background scene, current conditions and temperature shown at top.

## Weather and technical evidence

Record each useful source, what it supports, and important limitations. Research the weather variables, apparel guidance, reminders, accessibility, privacy, artwork, weather providers, and technical options needed for informed decisions.

### Weather providers considered

- **NWS (weather.gov) API** — free, no key required, official US government data. 7-day forecast. Only accepts lat/lon (no built-in geocoding for manual city/zip entry). [weather.gov API docs](https://www.weather.gov/documentation/services-web-api)
- **Open-Meteo** — free for non-commercial use, no key required. Up to 16-day forecast, global coverage including full US. Includes a built-in geocoding endpoint (city/zip → coordinates), simplifying manual location entry. Provides temperature, precipitation, wind, humidity, UV index, and WMO weather codes among other variables. [Open-Meteo docs](https://open-meteo.com/en/docs)

**Decision: Open-Meteo selected** as the weather provider — built-in geocoding simplifies manual location entry, forecast range comfortably covers the brief's needs, and it's free with no key required.

### Apparel and reminder guidance

- **Temperature-to-clothing bands** (general consumer dressing-guide consensus, e.g. [Fit The Forecast](https://fittheforecast.com/blog/what-to-wear-by-temperature), [Nike](https://www.nike.com/a/what-to-wear-by-temperature)): below 40°F calls for a real coat, 40–55°F is jacket range, above 55°F a jacket starts to feel like too much, and around 60°F+ long pants/t-shirt is comfortable. Wind and rain shift the effective temperature down a band (e.g. a breezy 55°F dresses like 48°F). Limitation: these are informal consumer guides, not a clinical/regulatory standard, but they're consistent across sources and reasonable for a lifestyle app.
- **UV index and sunscreen** ([EPA UV Index Scale](https://www.epa.gov/sunsafety/uv-index-scale-0)): 1–2 (Low) = no protection needed; 3–7 (Moderate to High) = apply broad-spectrum SPF-15+ sunscreen, wear a hat/sunglasses, seek shade late morning–mid afternoon; 8+ (Very High/Extreme) = extra protection, same measures more urgently. This gives a clear, authoritative threshold (UV ≥ 3) for triggering a sunscreen reminder.
- **Precipitation → umbrella reminder**: straightforward from precipitation probability/type fields in the weather data (e.g. Open-Meteo's precipitation probability); a simple threshold (e.g. ≥ 50% chance of rain) is a reasonable, testable trigger.
- **Hydration/heat reminder**: high temperature (e.g. ≥ 85–90°F) or high heat index is a common trigger for extra-hydration reminders in consumer weather/health guidance; exact threshold is a product decision rather than a regulatory one.
- **Wind reminder**: wind speeds above ~25 mph are commonly cited as the point where wind noticeably affects everyday activity; official NWS wind advisories don't trigger until 31–39 mph sustained (a safety threshold, not a daily-dress one). [NWS wind warnings/advisories](https://www.weather.gov/safety/wind-ww)

### Accessibility

- **WCAG 2.2 touch targets**: minimum 24×24 CSS px (AA), 44×44 CSS px recommended (AAA) — relevant to one-handed phone controls.
- **Color contrast**: WCAG AA requires 4.5:1 for normal text, 3:1 for large text/UI components — relevant since weather backgrounds (sky, storm scenes) sit behind text and icons.
- **Non-color signaling**: weather/recommendation state should not rely on color alone (e.g. icon + text label, not just a colored dot) for users with color-vision deficiency.
- **Screen reader support**: icons (weather icons, reminder icons) need text alternatives (alt text/aria-label), not decorative-only markup.

### Privacy

Location data is used only to fetch weather data from Open-Meteo and is not sent to any other server. The most recent location is saved only in local browser storage on the user's device — no accounts, no server-side storage, no data shared with third parties beyond the weather provider request itself.

## Decisions

Record the selected weather provider, forecast range, recommendation categories and rules, screen structure, visual direction, artwork approach (original, AI-generated, or appropriately licensed), deployment method, and one additional feature justified by the research. Briefly explain important trade-offs.

Once the recommendation categories are chosen, estimate the art needed: the character, three outfit variations per category, weather icons, and reminder icons. Use that estimate to choose the artwork approach.

**Weather provider:** Open-Meteo (see above).

**Forecast range:** through Open-Meteo's daily forecast, covering today plus several days ahead for advance planning (exact number of selectable days to be set in `spec.md`).

**Recommendation categories:**
- Outfit (by temperature, adjusted for wind/precipitation): Cold (< 40°F), Cool (40–55°F), Mild (55–70°F), Warm (> 70°F)
- Reminders (independent triggers): Umbrella (precipitation probability ≥ 50%), Sunscreen (UV index ≥ 3), Extra hydration (temperature ≥ 85°F), Windy (wind speed ≥ 25 mph)

**Art estimate:** 1 base character + 12 outfit variations (4 categories × 3 each) + ~6–8 weather condition icons (sun, cloud, rain, wind, snow, etc.) + 4 reminder icons (umbrella, sunscreen, hydration, wind) — reminder wording variations are text, not separate art. This is a meaningful volume of consistent-style art.

**Artwork approach: AI-generated**, chosen given the art volume above; keeps a consistent style across many variations without requiring original illustration skill or paid licensing. Generated assets will be credited as AI-generated on the info screen per the brief's credit requirement.

**Deployment method: GitHub Pages**, using the existing git repository already set up for this project.

**Additional feature: multi-day outfit strip** — a quick-glance row/preview of upcoming days' outfit icons alongside the main character view. Justified by the context-of-use research: the app must support both a quick daily glance and advance outfit planning (user story 2), and a multi-day strip serves the planning need with less navigation than checking one day at a time.

## Revisions

Record new evidence or changed decisions and explain why they changed.

## Approval

The Developer reviews the sources and decisions, corrects this file, and explicitly approves it before specification begins.

**Approved by Developer on 2026-09-28.**

## Saving the transcript

After the Developer approves the research, ask them to enter `save transcript`. When directed, save the complete conversation as `transcripts/research-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.
