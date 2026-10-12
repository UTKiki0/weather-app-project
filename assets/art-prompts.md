# Art prompts and generation record

The Developer approved the cozy cartoon base character (generated as `character-base-v2.png`, since removed; the approved base is `character-base.png`) on 2026-10-12, with light warm skin (not pale), dark brown hair, and all 12 proposed outfits. The approved base is also exported at the app path `character-base.png`. The original appearance is preserved in `character-base-v1.png`.

Match the references in `research.md`: minimalist weather scenes with a character in front of a weather-reflective background.

## Approved direction

1. **Character:** friendly, gender-neutral young adult with rounded cartoon features and a cozy feel.
2. **Appearance:** light warm skin, not pale; dark brown tousled hair; simple eyes and smile.
3. **Outfits:** all 12 below retained as approved. Each was generated from the same approved base reference.

## Workflow that keeps 13 characters consistent

1. Generate the **base character** first (prompt 1) until you love it. Pick one image.
2. For each outfit, feed the base image back to the tool as a **reference or edit image** and use the outfit prompts. If your tool has no reference-image feature, repeat the CHARACTER block exactly and expect to generate more variations to get a match.
3. Keep **identical canvas size, character height, and foot position** in all 13 so the character does not jump when the outfit changes.
4. **Transparent backgrounds:** if your tool can output a transparent PNG, use it. If not, keep the "plain flat bright green background" line, then remove the background (any remove-background tool or image editor) and export a PNG with transparency. Zoom in to check for green fringes on the edges.
5. Check every image for stray **text, letters, logos, or brand marks** on clothes and re-generate if any appear. Brand logos and lettering also create licensing problems.
6. Export as **real PNG files** (not renamed JPGs) at the sizes below, compress them (for example with Squoosh or TinyPNG), and save at the exact paths in the last section.

## Technical targets

| Asset | Canvas | Notes |
|---|---|---|
| Base character and 12 outfits | 2:3 portrait, about 800 x 1200 px final | Transparent. Full body, whole figure visible with about 8% margin. The app shows it up to 80% of the stage width. |
| 5 backgrounds | 1:1, about 1200 x 1200 px final | Opaque. The stage crops these (narrow portrait on phone, wide on laptop), so keep everything important in the **central 50% of the width**. |
| 5 condition icons | 1:1, 256 x 256 px final | Transparent. Shown as small as 28 px in the day strip, so shapes must be bold and simple. |
| 4 reminder icons | 1:1, 256 x 256 px final | Transparent. Shown about 32 px in the info pill. |

**Text must stay readable on top of the backgrounds.** The app draws dark navy text (the temperature, place, and description) over the top of the stage. Keep the top 40% of every background calm, pale, and low contrast. Nothing darker than a medium gray, and no busy detail behind the top-left or top-center. Once the files are in, ask the Agent to measure contrast over the real art.

## Reusable blocks (paste into each prompt)

**STYLE:**
`Minimalist flat vector-style cozy cartoon illustration, soft rounded shapes and features, clean smooth edges, gentle pastel color palette with a limited number of colors, restrained soft shading, friendly and playful, consistent line weight. No text, no letters, no logos, no watermark.`

**CHARACTER:**
`a friendly gender-neutral young adult, simple rounded cartoon proportions, small simple face with dot eyes and a small smile, short tousled dark brown hair, light warm skin that is not pale, standing front-facing in a relaxed neutral pose with arms slightly away from the body, full body from head to toe visible with a small margin around, centered`

**CUTOUT** (for transparent assets):
`genuinely transparent alpha background, no shadows, no ground, no backdrop, no halo or glow`

## 1. Base character (neutral, no outfit)

File: `assets/character-base.png`

```
[STYLE] A character design: [CHARACTER], wearing only a plain light-grey crewneck t-shirt and plain light-grey shorts and plain white sneakers. [CUTOUT]. Portrait 2:3.
```

## 2. Outfits (12): use the base image as the reference

Prefix for every outfit prompt: `Use the attached image as the character reference. Keep the exact same character, face, hair, proportions, pose, scale, and framing. Change only the clothing.`

Suffix for every outfit prompt: `[STYLE] [CUTOUT]. Portrait 2:3. No text or logos on the clothing.`

### Cold (below 40°F)

`assets/outfits/cold-1.png`
```
Clothing: a chunky puffer coat zipped up, a knit beanie, a thick scarf, gloves, dark jeans, and winter boots.
```

`assets/outfits/cold-2.png`
```
Clothing: a long wool overcoat, a knit hat, a wrapped scarf, dark trousers, and leather boots.
```

`assets/outfits/cold-3.png`
```
Clothing: a hooded parka with a fur-trimmed hood, a thick sweater underneath, mittens, and insulated snow boots.
```

### Cool (40-55°F)

`assets/outfits/cool-1.png`
```
Clothing: a denim jacket over a hoodie, straight jeans, and canvas sneakers.
```

`assets/outfits/cool-2.png`
```
Clothing: a varsity-style bomber jacket with plain stripes (no letters), a long-sleeve tee, joggers, and chunky sneakers.
```

`assets/outfits/cool-3.png`
```
Clothing: a quarter-zip fleece pullover, chino pants, and sneakers, with a small crossbody bag.
```

### Mild (55-70°F)

`assets/outfits/mild-1.png`
```
Clothing: a plain long-sleeve tee, relaxed jeans, and white sneakers.
```

`assets/outfits/mild-2.png`
```
Clothing: a light knit cardigan open over a t-shirt, straight-leg pants, and loafers.
```

`assets/outfits/mild-3.png`
```
Clothing: a thin zip-up hoodie, joggers, and running shoes, with a backpack.
```

### Warm (above 70°F)

`assets/outfits/warm-1.png`
```
Clothing: a short-sleeve t-shirt, casual shorts, and sandals.
```

`assets/outfits/warm-2.png`
```
Clothing: a sleeveless tank top, athletic shorts, sneakers, and a baseball cap with no logo.
```

`assets/outfits/warm-3.png`
```
Clothing: a short-sleeve untucked button-up shirt, light shorts, sunglasses pushed up on the head, and slip-on shoes.
```

The sunscreen and water reminders are separate icons, so the warm outfits do not need to show them.

## 3. Backgrounds (5)

Shared suffix: `No characters, no people, no text. Very light and airy with low contrast, calm and nearly empty pale sky in the top 40% of the image, soft details concentrated in the center 50% of the width, no dark areas, nothing darker than a medium gray. Square 1:1.`

`assets/backgrounds/sunny.png`
```
[STYLE] A soft minimalist scenery background: a pale blue gradient sky with a large pale, low-contrast yellow sun glow near the upper right, a few very faint wispy clouds, and gently rolling pale green hills along the bottom. [shared suffix]
```

`assets/backgrounds/cloudy.png`
```
[STYLE] A soft minimalist scenery background: a pale grey-blue sky filled with large fluffy light-grey clouds in low contrast, and muted gently rolling hills along the bottom. [shared suffix]
```

`assets/backgrounds/rainy.png`
```
[STYLE] A soft minimalist scenery background: a light blue-grey sky with soft pale clouds, fine light rain streaks falling in low contrast, and small puddle shapes with ripples along the bottom. Keep it bright, not stormy or dark. [shared suffix]
```

`assets/backgrounds/snowy.png`
```
[STYLE] A soft minimalist scenery background: a very pale white-blue sky, small sparse snowflakes falling, snow-covered rolling hills along the bottom, and two tiny pine trees near the left and right edges. [shared suffix]
```

`assets/backgrounds/windy.png`
```
[STYLE] A soft minimalist scenery background: a pale mint-green sky with flowing soft curved wind lines across it in low contrast, a few small leaves blowing, and grass bending in the breeze along the bottom. [shared suffix]
```

## 4. Weather condition icons (5)

Shared prefix and suffix: `[STYLE] A single bold simple icon, centered, thick rounded shapes that stay readable when shrunk to 32 px, [CUTOUT]. Square 1:1.`

`assets/conditions/sunny.png`
```
[shared] A round warm-yellow sun with short, rounded rays and no face.
```

`assets/conditions/cloudy.png`
```
[shared] One fluffy light-grey-blue cloud with a smaller cloud behind it.
```

`assets/conditions/rainy.png`
```
[shared] A grey-blue cloud with three blue raindrops falling below it.
```

`assets/conditions/snowy.png`
```
[shared] A pale blue cloud with three simple white-and-blue snowflakes falling below it.
```

`assets/conditions/windy.png`
```
[shared] Three curved flowing wind swirl lines in blue-grey with one small green leaf blowing along.
```

## 5. Reminder icons (4)

Same shared prefix and suffix as the condition icons. Keep these visually distinct from the condition icons (they sit in the same view).

`assets/reminders/umbrella.png`
```
[shared] An open umbrella in a bold bright color, seen from the front, with a curved handle.
```

`assets/reminders/sunscreen.png`
```
[shared] A squeeze bottle of sunscreen with a small yellow sun symbol on the front and no text.
```

`assets/reminders/hydration.png`
```
[shared] A reusable water bottle with a large blue water droplet on the front and no text.
```

`assets/reminders/windy.png`
```
[shared] A baseball cap being blown away by a strong gust, with two curved gust lines trailing behind it.
```

## After generating

1. Put the files at the paths above. The app shows a placeholder for any missing file and the real art as soon as it exists.
2. Open `http://localhost:8000/` (start `tools\serve.ps1` first) and look at all 12 outfits, 5 backgrounds, the day strip icons at their real small size, and the reminder icons.
3. Ask the Agent to run the contrast measurement over the real backgrounds.
4. Fill in this table for the Info screen's Art credits, which currently says the tool is "to be added":

| Item | Tool and version/model | Date generated | Terms checked (can the output be used in this project?) |
|---|---|---|---|
| Character and outfits | OpenAI built-in image generation; model/version not exposed | 2026-10-12 | Output ownership terms checked; see below |
| Backgrounds | OpenAI built-in image generation; model/version not exposed | 2026-10-12 | Output ownership terms checked; see below |
| Icons | OpenAI built-in image generation; model/version not exposed | 2026-10-12 | Output ownership terms checked; see below |

OpenAI's [Terms of Use](https://openai.com/policies/terms-of-use/), effective January 1, 2026 and checked October 12, 2026, assign output ownership to the user as between the user and OpenAI, to the extent permitted by law. The terms require respecting third-party rights and note outputs may not be unique. This supports using these generated assets in the prototype; it is not a guarantee of exclusive copyright or third-party clearance.

## Export record

All 27 production assets were generated with the built-in tool and saved at the paths above. Final exports: character/outfits 800 × 1200, backgrounds 1200 × 1200, condition/reminder icons 256 × 256. PNG alpha is preserved when resizing. Original generated outputs remain in the tool's generated-images directory; the approved base reference remains in this repository.

Portraits use a common export scale and a foot baseline at y=1104 on the 1200-pixel canvas, measured at alpha ≥128. This leaves at least 8% vertical margin, including winter hats. Clothing silhouette and face alignment can still vary slightly between generated images.

Agent inspection: all 27 PNGs decode; all 22 cutouts contain transparency; all 5 backgrounds are opaque. The icon contact sheet was inspected at 28 px (weather) and 32 px (reminders). Minimum contrast against `#12202e` across every pixel of the top 40%: sunny 10.58:1, cloudy 11.14:1, rainy 10.82:1, snowy 13.70:1, windy 5.50:1. These exceed the 4.5:1 normal-text target in that source region. Lower scenery has darker details, so these measurements do not establish contrast for every responsive crop.

Browser verification remains open: Chrome produced no screenshot and Edge exited with an unusable GPU-process error. Further retries were stopped after these two failures. Review the app on phone and laptop before accepting the final crop and layout. Contact sheets and raw measurements are in `../art-review/`.

The prompts above, with the approved reusable blocks, define the prompt set. `generation-log.json` records expanded prompts and source paths for the batch. Generated scenes contain more landscape detail than the minimalist starting prompts; final visual approval remains with the Developer.
