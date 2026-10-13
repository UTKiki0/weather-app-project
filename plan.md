# Implementation Plan

> EDITING DIRECTIVE: DEVELOPER AND AGENT EDIT THIS FILE COLLABORATIVELY. THE DEVELOPER MUST REVIEW AND APPROVE ITS CONTENT.

Purpose of this file: Turn the approved specification into an ordered, trackable build and verification plan.

## Instructions for the Developer

Set priorities, review the checklist, verify results rather than relying only on the Agent's report, and keep the project documents current as the work changes. Expect the build to take many rounds of testing and fixing; record material changes under Revisions.

To begin planning, open the project repository in a fresh chat and enter:

`Read ./plan.md and help me create the Project 3 implementation plan.`

After approving the plan, open the project repository in a fresh chat and enter:

`Read ./plan.md and help me implement the approved Project 3 plan in working checkpoints.`

## Instructions for the Agent

Read `AGENTS.md`, `brief.md`, `research.md`, `spec.md`, and this file, then inspect the relevant project files. Propose concrete tasks and checks without expanding the approved scope.

During implementation, follow the approved plan in working checkpoints and keep it current. Never mark approvals or items requiring Developer verification complete on the Developer's behalf.

## Approach

**Stack:** Plain HTML/CSS/JS, no build step — static files served directly, which maps cleanly onto GitHub Pages deployment and keeps debugging simple for an app this size (two screens, one shared state object, no routing library needed).

**Structure:**
- `index.html` — single page; Main and Info are two views toggled via JS/CSS rather than separate pages/routes.
- `style.css` — layout and theming, with a media-query breakpoint switching between the phone (single-column) and laptop (two-column) layouts.
- `script.js` (split into modules as it grows, e.g. `weather.js`, `state.js`, `render.js`) — API calls, recommendation logic, localStorage persistence, and DOM rendering.
- `assets/` — the 27 AI-generated images (character, outfit variations, backgrounds, condition icons, reminder icons) and the 4 sourced UI icon SVGs.

**Data flow:** selected location + date → Open-Meteo forecast request → derive `effectiveTemp`, `outfitCategory`, and reminder flags per the rules in `spec.md` → look up or create the persisted recommendation state for that (location, date) key (including variation indices) → render every visual/written element from that one state object only.

**Dependencies:** Open-Meteo forecast and geocoding endpoints (no key), browser Geolocation API, `localStorage` (saved location + per-date variation state), and a small set of static SVGs from an open-source icon library (downloaded directly, no package manager needed since there's no build step).

**Task order:** scaffold and static layouts first (so screen structure can be checked against the sketches early), then the weather/location data pipeline, then the recommendation engine and state persistence, then wiring the UI to that state, then error/accessibility passes, then the Info screen, then deployment. Asset creation runs in parallel starting early, since 27 consistent-style AI-generated images will take iteration.

**Main risks:** Open-Meteo geocoding can return multiple matches for an ambiguous city name (needs a sensible default, e.g. first/top match, rather than a blocking disambiguation UI); keeping 27 AI-generated assets visually consistent in style will likely take several generation passes; the laptop Info panel (overlay on the right column while the left column stays live) is the trickiest interaction to get right; and verifying that outfit and reminder variations are truly independent requires deliberately testing forecasts that trigger multiple reminders at once.

## Checklist

### Approvals

- [x] Research approved
- [x] Specification approved
- [x] Plan approved (Developer, 2026-10-05)

### Build

- [x] Create or source the assets listed in `spec.md` (character, 12 outfit variations, 5 backgrounds, 5 condition icons, 4 reminder icons, 4 UI icons), starting early and iterating in parallel with the tasks below
- [x] Scaffold the project: `index.html`, `style.css`, `script.js`, `assets/` folder
- [x] Build the phone layout's static markup/CSS against [07-main-screen-phone.jpg](reference/07-main-screen-phone.jpg) (placeholder content, no live data yet)
- [x] Add the laptop two-column layout via media query against [08-main-screen-laptop.jpg](reference/08-main-screen-laptop.jpg)
- [x] Implement the Open-Meteo forecast fetch for a fixed test location and confirm returned values in the console (R1)
- [x] Add manual location search using Open-Meteo geocoding, including the "location not found" error state and the pick-a-result list for ambiguous matches (R2, R2a)
- [x] Add the device-location button with Geolocation API integration and the permission-denied fallback message (R3, R15)
- [x] Save and restore the most recently resolved location via `localStorage`, overwriting on each new location (R4)
- [x] Implement the recommendation engine: `effectiveTemp`, `outfitCategory`, and the four reminder triggers, from live weather values (recommendation state rules)
- [x] Build the 7-day strip and wire date selection to update the whole screen from the selected day's recommendation state (R5, R6)
- [x] Implement the per-(location, date) recommendation state object with independent random variation selection and `localStorage` persistence (content variation rules)
- [x] Wire the character art, background, temperature, and condition description to the recommendation state
- [x] Wire the info pill (precipitation/wind always shown; sunscreen/hydration icons conditional) to the recommendation state
- [x] Build the customization picker scoped to the active category, with manual picks overriding and persisting the stored variation index (R9, R10)
- [x] Add loading, empty-data, and service-error states for all API calls (R14)
- [x] Build the Info screen content (creator, data source, methodology, privacy, art credits) and the four collapsible sections (R16)
- [x] Wire Info screen navigation: full-screen on phone, right-half panel over Main's right column on laptop (R17)
- [x] Accessibility pass: contrast check over weather backgrounds, icon alt text/aria-labels, 44×44px touch targets on phone (R11–R13)
- [x] Use the approved screen drawings to guide layout and interaction work
- [x] Keep one recommendation state driving every visual and written output
- [x] Test and fix each checkpoint against the specification before starting the next
- [x] Commit meaningful working checkpoints
- [x] Deploy to a public HTTPS URL via GitHub Pages (R18)

### Verify and revise

- [x] Check every specification requirement
- [x] Test multiple locations, current and forecast dates, recommendation categories, outfit and reminder variations, and failure states
- [x] Verify that eligible outfit and reminder variations are selected independently rather than as fixed pairs
- [x] Verify that returning to a previously selected date shows the same variations
- [x] Test the deployed app, independently of the local version, on a real phone and a laptop, including both screens, accessibility, and one-handed controls
- [x] Prepare the usability test below
- [ ] Test with three peers and record each session
- [ ] Add the chosen improvement to this checklist, and update `spec.md` if the intended result changes
- [ ] Implement, verify, and redeploy at least one meaningful revision

### Deliver

- [ ] Confirm all brief deliverables, sources, privacy information, and asset credits
- [ ] Save all chat transcripts
- [ ] Complete the debrief

## Usability testing

Before testing, record the purpose, a few realistic tasks, non-leading prompts, and a consistent note format. For each session, use a non-identifying label and record the task, what the tester did or said, successes, barriers or questions, and possible changes. Keep observations separate from interpretations. After all three sessions, summarize the strongest findings and the improvement they support.

> DRAFT proposed by the Agent for Developer review; nothing below has been run.

### Purpose

Find out whether a US college student can, without help, (1) learn what to wear today within about 30 seconds, (2) plan an outfit for a later day, (3) check another city, (4) notice and understand the extra reminders, (5) change the outfit, and (6) find out where the data comes from and what happens to their location. These map to user stories 1–4 in `research.md` plus the Info screen requirements (R16).

### Setup

- **Testers:** three peers who are US college students or close to it and who do not know how the app works. Label them P1, P2, P3. Record no names, photos, or faces.
- **Devices:** the deployed URL, https://utkiki0.github.io/weather-app-project/. At least two testers use their own phone and one uses a laptop, so both layouts are observed. Note the device and browser for each session.
- **State:** each tester starts on a fresh browser profile or private window, so there is no saved location. The Developer does not explain the app beforehand beyond "it suggests what to wear based on the weather".
- **Recording:** the written notes are the record. Screen or audio recording only with the tester's spoken consent at the start, and delete it after notes are written up. The tester can stop at any time.
- **Art status:** all 27 production PNGs were generated on 2026-10-12 using the Developer-approved cozy character. See `assets/art-prompts.md` for prompts, credits, and verification. Final artwork and responsive crop approval remain with the Developer; note the version used in each session.
- **Roles:** the Developer facilitates and takes notes. If possible, a second person takes notes so the facilitator can stay quiet.

### Tasks and prompts

Read each task aloud; give no hints about where to tap. Ask the tester to think aloud.

| # | Task (said to the tester) | What success looks like | Maps to |
|---|---|---|---|
| T1 | "It's morning and you're getting ready. Use this to figure out what you'd wear today." | States the temperature or conditions and an outfit idea without help; allows time to first answer. Observe how they set a location. | Story 1, R1–R4, R7 |
| T2 | "You're packing for a trip on Thursday. Find out what the weather will be then and what you'd wear." | Reaches Thursday's view and can say it is a forecast for that day, not today. | Story 2, R5–R7 |
| T3 | "A friend lives in Portland and you're visiting. Check what to wear there." | Gets a Portland forecast; handles the choice between several Portlands; can say which one they picked. | Story 3, R2, R2a |
| T4 | "Is there anything else the app suggests you bring or do today?" | Notices the reminder icons, finds the wording, and understands it. | Story 4 |
| T5 | "You don't like the outfit it's showing. See if you can pick another." | Finds the outfit picker and changes the outfit without help. | R9, R10 |
| T6 | "Find out where this app gets its weather and what it does with your location." | Reaches the Info screen and finds the data source and privacy text. | R16, R17 |

Optional if time allows: "Use your current location instead." Observe the permission prompt and, if declined, whether the fallback message is clear (R3, R15).

**Neutral prompts to use during tasks:** "What are you thinking right now?", "What do you expect to happen if you tap that?", "What are you looking for?", "Tell me what you see here."

**Do not:** name controls ("tap the shirt button"), explain the app, answer "is this right?", or react to successes and errors. If stuck for about a minute, ask "What would you try next?"; if still stuck, record it as a barrier and give the minimum hint needed to continue.

**Closing questions (after all tasks):** "What was easiest?", "What was confusing or annoying?", "Was anything missing you expected?", "How much would you trust this to decide what you wear, and why?" (rate 1–5, then ask why), "Would you use it? When?"

### Note format (one block per session)

```
Session: P_  | Device/browser: ___ | Layout: phone / laptop | Art: placeholders / final | Date: ___

Task | What the tester did or said (observation) | Result (done / done with help / not done) | Barrier or question | Possible change (interpretation)
T1 |
T2 |
T3 |
T4 |
T5 |
T6 |
Closing answers (quotes, trust rating 1-5):
```

Keep "what the tester did or said" to facts and short quotes. Put guesses about why only in the last column.

### After the sessions

Summarize in this file: a count of how many of the three testers completed each task unaided, the barriers that appeared more than once, the strongest finding, and the single improvement it supports. Add that improvement to the Verify and revise checklist and, if the intended result changes, to `spec.md`.

### Results

(To be filled in after testing: session notes P1–P3, findings summary, chosen improvement.)

## Verification log

Agent-run checks against the deployed app (https://utkiki0.github.io/weather-app-project/), 2026-10-12, using headless Edge driven over the DevTools protocol (real geolocation grant/deny, real network blocking/holding, a separately written oracle for the rules) plus the two browser test pages in `tests/`. Scripted checks: 114 run, 112 passed, 2 failed (one cause, below). The Developer still verifies everything under "Developer to verify" and the unticked checklist items.

| Req | Evidence | Status |
|---|---|---|
| R1 live data | 70 forecast days over 10 US locations (Austin, Miami, Seattle, Anchorage, Phoenix, Minneapolis, Honolulu, New York, Denver, Chicago) matched an independently computed expectation for temperature, rain chance, wind, category, reminders, and scene; no mock data in the app | Pass (acceptance reworded; finding 2 resolved) |
| R2 / R2a search | Ambiguous list (5 + Cancel, 44 px rows, states shown), single-match zip goes straight through, unrecognized term and empty search show the message | Pass (finding 1 resolved) |
| R3 / R15 device location | Real permission grant (Boston test position) gave a forecast for those coordinates; real denial gave the message, focused manual search, and search still worked | Pass |
| R4 saved location | Reload restores the last location with 0 geocoding requests; device location also restores; one saved location only | Pass |
| R5 / R6 / R7 | Exactly 7 days, first is Today; each day matched the oracle with no stale values; place with state, date, "Today" vs "forecast", °F and mph visible | Pass |
| R8 / R16 Info | Creator, Open-Meteo, thresholds and sources, privacy, and art/icon credits present as text; four sections collapsed by default and independent | Pass (art tool still blank, finding 4) |
| R9 / R10 picker | On all 70 days the picker listed only that day's category (3 options); manual pick persisted across days and reload | Pass |
| R11 layout | Phone: one column, no sideways scroll at 320, 360, 390, 430 px. Laptop: stage 768 px left, search, details, and upcoming days stacked in the right column | Pass on geometry; sketch match is the Developer's call |
| R12 targets | Every control at least 44 x 44 px at 320 to 430 px, including picker and Info | Pass; see finding 5 for thumb reach |
| R13 accessibility | axe-core (WCAG 2.2 AA + best practice): 0 violations on phone main, picker, Info, and laptop main. Text contrast by calculation 8.2:1 or better on all five scene colors. Selection not by color alone | Pass for flat placeholder colors; real art and screen readers are open |
| R14 states | Real interception: forecast network error, HTTP 500, malformed JSON, empty forecast, one no-data day, geocoding down, and a held request each gave the right message with place kept and no broken character; each failure recovered on the next search | Pass |
| R17 Info placement | Phone: full 390 x 844. Laptop: panel at x = 768, 512 wide, character column unchanged, outside click closes | Pass |
| R18 deployment | HTTPS, HTTP redirects, all files served with correct types, full flow passes on the deployed URL | Pass |
| Rules and variation | 72 + 27 unit checks (every boundary, independence over 2,000 runs); synthetic forecasts end to end for windy and snowy scenes, all four reminders at once, and boundaries 55/56, 70/71, 49/50% rain, 14/15 mph | Pass |

**Findings for Developer decision**

1. **RESOLVED (07f3a48): non-US term resolved to a US look-alike.** Searching "Tokyo" auto-selects "Tokyo Hill, Texas" because the geocoder's fuzzy match returns that single US result, so no list is shown. R2's acceptance says a non-US term shows "location not found". Option: when there is one match whose name does not match the typed text, show it as a one-item "did you mean" choice instead of selecting it.
2. **RESOLVED (07f3a48): R1 acceptance wording vs behavior.** R1 says changing the date triggers a new Open-Meteo request. The app fetches all 7 days once per location and date changes use that data (one request on load, none on day taps). Either reword R1 to "changing the location triggers a request and date changes use the already-fetched 7 days", or refetch on date change.
   Resolution evidence (deployed, after the fix): "Tokyo" and "Austi" show "No exact match. Did you mean:" with the location unchanged until a choice is made, Cancel keeps the old place, choosing "Tokyo Hill, Texas" loads it; "Springfield" keeps its plain list; a zip goes straight through; typos the geocoder cannot match ("Springfeld") show "Location not found". 19 new unit checks cover the matching rules and the mutant (always-exact) is caught. 20 of 20 search/location checks, 26 of 26 real-forecast checks, 13 of 13 failure-state checks, and axe on the new list state (phone and laptop) all pass.
3. **Real data never produced a windy day, a snowy day, or all four reminders** in the 10 locations, so those paths are proven by the synthetic-forecast run and unit tests rather than real forecasts.
4. **Art credit placeholder.** The Info screen says the generation tool is "to be added".
5. **Thumb reach.** Per the sketches, search, location, and info sit at the top of the phone screen; the customize button (82% down) and day strip are low. Worth watching in usability testing.

**Developer to verify** (cannot be proven from here): the real phone and real laptop, including one-handed use; a screen reader (VoiceOver, TalkBack, or NVDA) announcing every icon-only control; dragging a browser window across 900 px with a reminder showing; the real device-location prompt; whether the layouts match the hand sketches; text contrast over the final art once it exists.

### Art integration (2026-10-12)

The 27 AI-generated images were made in a separate session (transcript in `transcripts/build-2026-10-12_173005.md`, prompts and credits in `assets/art-prompts.md`, generation record in `assets/generation-log.json`, review sheets in `art-review/`). Agent checks on the app with the real art, run against the local build before deployment:

- Every outfit, background, day-strip icon, reminder icon, and the 12 picker thumbnails loaded, with no placeholder left, across synthetic forecasts covering all 4 categories, 5 scenes, and all 4 reminders at once (14 checks).
- Neutral base character shown in the empty, loading, and error states.
- Text contrast from rendered pixels with the text hidden, over each real background at 6 screen sizes (390x844, 360x740, 430x932, 1280x720, 1440x900, 1920x1080): worst case 10.7:1 against the 4.5:1 required (31 checks).
- Layout with the art found a bug: on laptop the 800x1200 character overflowed the stage (cropped at the knees, page scrollbar), and at 320 px wide it collided with a two-row info pill. Fixed by sizing the character to the stage and reserving space for the pill's actual height; verified at 14 sizes from 320x568 to 2560x1080 (28 checks).
- Regression of every earlier suite against the build with art: 70 real forecast days vs the oracle (26), synthetic rule cases (10), failure states (13), search and location (20), layout and accessibility (27); unit suites 72, 27, and 19. All pass. Console: 0 errors, 0 404s (a tab icon was added so the browser's automatic favicon request no longer 404s).

After the push (commit `acb4a88`), the same checks were rerun against the deployed URL: all 27 art files served as `image/png` and byte-identical to the local files (SHA-256), so the contrast results carry over; art loading 14 of 14; character fit and clearance at 14 sizes 28 of 28; 70 real forecast days vs the oracle 26 of 26; synthetic rule cases 10 of 10; failure states 13 of 13; search and device location 20 of 20; layout, Info, and accessibility 27 of 27. One early failure on the deployed run was my test measuring a 500 KB image before it finished loading; it passed once the test waited for the image.

Developer-reported (2026-10-12): checked the deployed app on a laptop and a phone and everything looked good. On request the Developer confirmed that all of these "work well and as intended": one-handed use on the phone, a screen reader on the icon-only controls, the real device-location prompt, resizing the browser window across 900 px, and the match to the hand sketches. These were the items the Agent could not verify. The Developer also reviewed the `spec.md` Revisions entries and the `AGENTS.md` project section and found them "in order". The Developer ticks the checklist items; the Agent has not.

Developer decisions: keep the art as PNG (a JPEG conversion of the backgrounds would cut 8.3 MB to about 0.5 MB, offered and declined); the unused base-character originals (v1, v2) were deleted; the review sheets are committed.

## Revisions

Record material plan changes and why they were made.

- 2026-10-05: Replaced "use the top geocoding match, no disambiguation UI" (Main risks) with a pick-a-result list shown on submit when a search has more than one US match (R2a). Developer's request; a visible choice avoids silently showing the wrong city.
- 2026-10-12: Deployed to GitHub Pages from `master` (repo root) at https://utkiki0.github.io/weather-app-project/ (HTTPS enforced). Agent-run checks on the deployed URL: all files load with correct types, HTTP redirects to HTTPS, and a scripted headless-browser run at phone and laptop sizes passed search, forecast, day selection, picker, Info, and reload-restore. Real-device testing is still the Developer's.
- 2026-10-12: The accessibility pass found a layout bug the earlier phone checks missed: below about 390 px wide the page scrolled sideways (at 360 px the content was 389 px wide) because the grid column sized itself to its widest content. Fixed by pinning the columns to the available width; verified no overflow and 44 px targets from 320 to 430 px. Also added a main-screen `h1`, a 3:1 border for outfit options with a check mark for the selected one, and plain-text reminders on laptop (button only on phone).
- 2026-10-05: Local server is `tools/serve.ps1` (PowerShell) because Python and Node are not installed.

## Saving transcripts

At the end of planning, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.

At the end of every implementation chat, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/build-YYYY-MM-DD_HHMMSS.md` using the same formatting.
