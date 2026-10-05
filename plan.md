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

- [ ] Create or source the assets listed in `spec.md` (character, 12 outfit variations, 5 backgrounds, 5 condition icons, 4 reminder icons, 4 UI icons), starting early and iterating in parallel with the tasks below
- [ ] Scaffold the project: `index.html`, `style.css`, `script.js`, `assets/` folder
- [ ] Build the phone layout's static markup/CSS against [07-main-screen-phone.jpg](reference/07-main-screen-phone.jpg) (placeholder content, no live data yet)
- [ ] Add the laptop two-column layout via media query against [08-main-screen-laptop.jpg](reference/08-main-screen-laptop.jpg)
- [ ] Implement the Open-Meteo forecast fetch for a fixed test location and confirm returned values in the console (R1)
- [ ] Add manual location search using Open-Meteo geocoding, including the "location not found" error state (R2)
- [ ] Add the device-location button with Geolocation API integration and the permission-denied fallback message (R3, R15)
- [ ] Save and restore the most recently resolved location via `localStorage`, overwriting on each new location (R4)
- [ ] Implement the recommendation engine: `effectiveTemp`, `outfitCategory`, and the four reminder triggers, from live weather values (recommendation state rules)
- [ ] Build the 7-day strip and wire date selection to update the whole screen from the selected day's recommendation state (R5, R6)
- [ ] Implement the per-(location, date) recommendation state object with independent random variation selection and `localStorage` persistence (content variation rules)
- [ ] Wire the character art, background, temperature, and condition description to the recommendation state
- [ ] Wire the info pill (precipitation/wind always shown; sunscreen/hydration icons conditional) to the recommendation state
- [ ] Build the customization picker scoped to the active category, with manual picks overriding and persisting the stored variation index (R9, R10)
- [ ] Add loading, empty-data, and service-error states for all API calls (R14)
- [ ] Build the Info screen content (creator, data source, methodology, privacy, art credits) and the four collapsible sections (R16)
- [ ] Wire Info screen navigation: full-screen on phone, right-half panel over Main's right column on laptop (R17)
- [ ] Accessibility pass: contrast check over weather backgrounds, icon alt text/aria-labels, 44×44px touch targets on phone (R11–R13)
- [ ] Use the approved screen drawings to guide layout and interaction work
- [ ] Keep one recommendation state driving every visual and written output
- [ ] Test and fix each checkpoint against the specification before starting the next
- [ ] Commit meaningful working checkpoints
- [ ] Deploy to a public HTTPS URL via GitHub Pages (R18)

### Verify and revise

- [ ] Check every specification requirement
- [ ] Test multiple locations, current and forecast dates, recommendation categories, outfit and reminder variations, and failure states
- [ ] Verify that eligible outfit and reminder variations are selected independently rather than as fixed pairs
- [ ] Verify that returning to a previously selected date shows the same variations
- [ ] Test the deployed app, independently of the local version, on a real phone and a laptop, including both screens, accessibility, and one-handed controls
- [ ] Prepare the usability test below
- [ ] Test with three peers and record each session
- [ ] Add the chosen improvement to this checklist, and update `spec.md` if the intended result changes
- [ ] Implement, verify, and redeploy at least one meaningful revision

### Deliver

- [ ] Confirm all brief deliverables, sources, privacy information, and asset credits
- [ ] Save all chat transcripts
- [ ] Complete the debrief

## Usability testing

Before testing, record the purpose, a few realistic tasks, non-leading prompts, and a consistent note format. For each session, use a non-identifying label and record the task, what the tester did or said, successes, barriers or questions, and possible changes. Keep observations separate from interpretations. After all three sessions, summarize the strongest findings and the improvement they support.

## Revisions

Record material plan changes and why they were made.

## Saving transcripts

At the end of planning, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/plan-YYYY-MM-DD_HHMMSS.md`, label chat messages `Developer` and `Agent`, and confirm the saved path.

At the end of every implementation chat, ask the Developer to enter `save transcript`. When directed, save the complete conversation as `transcripts/build-YYYY-MM-DD_HHMMSS.md` using the same formatting.
