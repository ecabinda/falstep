# Atelier Drop

## Design System Metadata
- **Version**: 1
- **Resource ID**: assets/b62795293b8349a0ba2de7bace0ce4df
- **Color Variant**: None
- **Primary Color**: `None`
- **Secondary Color**: `None`
- **Tertiary Color**: `None`
- **Neutral Color**: `None`
- **Spacing Scale**: None
- **Headline Font**: None
- **Body Font**: None
- **Label Font**: None

---

## Brand & Style

This design system establishes an unapologetic collision between Mediterranean editorial leisure and raw UK drop-culture hype. It blends the curated, relaxed luxury of contemporary lifestyle collectives with the gritty, fast-paced exclusivity of underground streetwear releases. 

### Emotional Expression & Positioning
- **Aesthetic Movement:** High-Contrast Minimalist Brutalism fused with Haute Editorial. Raw architectural alignment, stark negative space, heavyweight type, and delicate precision lines.
- **Audience:** Digital-native fashion connoisseurs, streetwear archivers, and drop-culture obsessives seeking elevated garment construction without corporate sanitization.
- **Tone:** Exclusive, blunt, architectural, and restrained. Imagery commands focus; interface elements serve as tactile gallery frames and stark utility tools.

## Layout & Spacing

Layouts follow an intentional editorial structure: uncompromising alignment, asymmetric grid modules, and stark border separations inspired by physical printed lookbooks.

### Grid Rhythm
- **Desktop (12 Columns):** Fixed outer boundaries up to a maximum container of `1600px`. Margins at `3rem` (`48px`) with `1.5rem` (`24px`) gutters. Heavy imagery occupies full 6 or 8-column modules, balanced against 4-column compact technical specs.
- **Tablet (8 Columns):** Fluid layout with `2rem` outer margins and `1rem` gutters.
- **Mobile (4 Columns):** Strict edge-to-edge feel with `1rem` outer canvas padding, dropping gutters to `0.75rem`. Full-width modular product cards simulate raw physical flash cards stacked vertically.

### Rhythm Principles
Whitespace is deliberate and stark. Vertical block sections maintain dramatic macro padding (`space-xl` scaled to multiples of 4-6x in hero areas) contrasted against tight, dense typographic telemetry in metadata headers.

## Elevation & Depth

This design system completely discards synthetic dropshadows, blurs, and skeuomorphic bevels. Visual depth is established exclusively via architectural plane stacking, structural hairpins, and solid contrasting surfaces.

### Layering Hierarchy
1. **Base Foundation (Ground):** Canvas level (`#FBFBFB` or pure `#FFFFFF`).
2. **Structural Enclosures (Planes):** Outlined with crisp 1px borders tinted in Deep Espresso (`#20151115`).
3. **Component Pods (Cards & Panels):** Subtle tinted solid surface fills (`#F3EFE8`) framed by hairpins. No shadow blur; cards achieve separation solely via value shift against the white canvas.
4. **Floating Overlays & Drawers:** High-contrast solid Deep Espresso `#201511` backing panels or pure white overlays bordered by a defined 1px `#201511` solid outline. Scrims use an opaque 60% tint without backdrop blur.

## Components

### Buttons & Action Triggers
- **Primary Action (Drop CTA / Add to Cart):** Razor-sharp rectangular box. Solid Deep Espresso (`#201511`) background, pure white uppercase `Anton` or heavy `Hanken Grotesk` text. Hover transitions to Warm Mocha (`#4A3226`) with zero corner rounding. Full-width on mobile.
- **Secondary Action:** Transparent base, 1px solid `#201511` boundary, Deep Espresso text. Hover shifts to `#F3EFE8` interior fill.
- **Quick-Add / Size Selector Buttons:** Modular segmented grid bar of square boxes with 1px internal dividers. Selecting a size fills the individual square solid `#201511` with white text.

### Badges, Pill Tags & Drop Counters
- **Drop Status Indicators:** Warm Bone (`#F3EFE8`) background, Deep Espresso (`#201511`) text, uppercase tracking (`label-caps`). 
- **Inventory Warning / Live Counter:** Bordered pill with a live blinking espresso dot (`#201511`), indicating "STRICTLY LIMITED" or live stock levels.

### Product & Editorial Cards
- **Lookbook / Product Grid Unit:** Rectangular layout with a 1px border (`#20151115`). Imagery sits on top of or within a `#F3EFE8` neutral background tone. Typography sits immediately below the image frame separated by a sharp 1px horizontal line, dividing title, edition number, and currency.
- **Hover State:** Instant image swap to garment detail crop, accompanied by a clean reveal of the quick-add size matrix.

### Inputs & Form Fields
- **Text Inputs (Drop Alerts, Checkout):** Flat `#FFFFFF` or `#FBFBFB` surface framed by a 1px `#20151130` border. Active/Focus states switch to a solid 1px `#201511` boundary. Zero border-radius. Labels sit in high-tracking uppercase (`label-caps`) above the input.

### Drop-Specific Specialized Components
- **Drop Ticker Tape:** Edge-to-edge scrolling marquee banner with pure `#201511` background, cream text (`#F3EFE8`), and high-impact condensed uppercase typography.
- **Archival Accordion:** Utilitarian expandable garment specs (GSM weight, fabric origin, fit profile) separated by 1px horizontal line dividers across the full width of the container.

---

## Typography Hierarchy

| Style Token | Font Family | Size | Weight | Line Height | Letter Spacing |
|-------------|-------------|------|--------|-------------|----------------|

---

## Spacing System

| Token | Value |
|-------|-------|
