# Galeonica Logo Builder (Figma Plugin)

This plugin drops a pre-built Galeonica "G/J" negative-space logo onto the current page so you can tweak or export it (SVG, PNG, etc.) without hand-drawing.

## Setup (macOS)

1. **Install deps**
   ```bash
   cd figma-plugins/galenica-logo
   npm install
   npm run build
   ```
   This compiles `src/main.ts` to `dist/main.js`.

2. **Import the plugin into Figma**
   - Open Figma Desktop → `Plugins → Development → Import plugin from manifest…`
   - Select `figma-plugins/galenica-logo/manifest.json`.

3. **Run it**
   - In your blank file (`https://www.figma.com/design/XHjfuqvieA3YZwhO2tjf5V/...`), go to `Plugins → Development → Galeonica Logo Builder → Run`.
   - The plugin creates a 500×500 frame named “Galeonica Logo” centered on the viewport with the vector logo already booleaned into a single path.

4. **Export**
   - Select the resulting vector → `⌘⇧E` → choose SVG (or anything else).

### Customize ratios
Adjust the constants in `src/main.ts`:
- `OUTER_SIZE`, `INNER_SIZE` → overall proportions.
- `ROTATION` → forward-lean angle (default 15°).
- `STROKE_EQUIV` → implied stroke thickness for the crossbar/tail.

Re-run `npm run build` after editing and relaunch the plugin to regenerate the logo.
