# Art files the app looks for

Drop AI-generated art here at these exact paths; no code changes are needed. While a file is
missing, the app shows a labeled placeholder instead (emoji or a flat color).

| Folder | Files | Format |
|---|---|---|
| `outfits/` | `cold-1.png` … `cold-3.png`, `cool-1.png` … `cool-3.png`, `mild-1.png` … `mild-3.png`, `warm-1.png` … `warm-3.png` | PNG, transparent |
| `backgrounds/` | `sunny.png`, `cloudy.png`, `rainy.png`, `snowy.png`, `windy.png` | PNG (real PNG files, not renamed JPGs) |
| `conditions/` | `sunny.png`, `cloudy.png`, `rainy.png`, `snowy.png`, `windy.png` | PNG, transparent |
| `reminders/` | `umbrella.png`, `sunscreen.png`, `hydration.png`, `windy.png` | PNG, transparent |
| `ui/` | `search.svg`, `map-pin.svg`, `info.svg`, `shirt.svg` (Lucide, already present) | SVG |

All 27 production PNGs are present. `character-base.png` is the approved cozy neutral character. The
app shows it in the empty, loading, and error states. The original full-resolution generations of the
base character (v1 and v2) were removed from the repository on 2026-10-12 at the Developer's direction.

Prompts, approval, export dimensions, and credits are recorded in `art-prompts.md`.
Run `powershell -NoProfile -ExecutionPolicy Bypass -File tools/check-art.ps1` from the project root
to inspect dimensions, transparency, visible bounds, and background contrast against the app's navy ink.
