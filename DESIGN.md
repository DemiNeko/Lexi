---
"name": "Lexi"
"description": "Reading annotations for focused bilingual vocabulary practice."
"colors":
  "primary": "#4e6851"
  "accent-hover": "#3e5541"
  "ink": "#243329"
  "muted": "#58665b"
  "paper": "#f5f7f3"
  "surface": "#fff"
  "soft": "#e8eee5"
  "line": "#ccd5c9"
  "rail": "#4e6851"
  "rail-text": "#fff"
  "rail-muted": "#e2ecdf"
  "active": "#fff"
  "active-ink": "#304c35"
  "success": "#315c3a"
  "error": "#9c3b34"
  "error-bg": "#fcf0ee"
  "focus": "#58723d"
  "dark-primary": "#4e6851"
  "dark-accent-hover": "#607e63"
  "dark-ink": "#edf2e9"
  "dark-muted": "#afbdab"
  "dark-paper": "#141c17"
  "dark-surface": "#1c2820"
  "dark-soft": "#2a392d"
  "dark-line": "#425245"
  "dark-rail": "#202f24"
  "dark-rail-text": "#f4f8f1"
  "dark-rail-muted": "#c3d3be"
  "dark-active": "#4e6851"
  "dark-active-ink": "#fff"
  "dark-success": "#b2d1aa"
  "dark-error": "#ffc3bb"
  "dark-error-bg": "#402b29"
  "dark-focus": "#bfdb9e"
  "dark-progress": "#a7c59c"
"typography":
  "headline":
    "fontFamily": "Segoe UI, Arial, sans-serif"
    "fontSize": "clamp(28px,2.6vw,38px)"
    "fontWeight": 650
    "lineHeight": 1.16
    "letterSpacing": "-.03em"
  "title":
    "fontFamily": "Segoe UI, Arial, sans-serif"
    "fontSize": "22px"
    "fontWeight": 650
    "lineHeight": 1.3
    "letterSpacing": "-.02em"
  "subtitle":
    "fontFamily": "Segoe UI, Arial, sans-serif"
    "fontSize": "18px"
    "fontWeight": 650
    "lineHeight": 1.35
  "body":
    "fontFamily": "Segoe UI, Arial, sans-serif"
    "fontSize": "15px"
    "fontWeight": 400
    "lineHeight": 1.5
  "label":
    "fontFamily": "Segoe UI, Arial, sans-serif"
    "fontSize": "13px"
  "annotation":
    "fontFamily": "Segoe UI, Arial, sans-serif"
    "fontSize": "11px"
    "lineHeight": 1.65
  "study-word":
    "fontFamily": "Segoe UI, Arial, sans-serif"
    "fontSize": "clamp(27px,3.6vw,42px)"
    "fontWeight": 650
    "lineHeight": 1.25
    "letterSpacing": "-.025em"
"rounded":
  "key": "4px"
  "control": "8px"
  "option": "10px"
  "surface": "12px"
  "dialog": "16px"
"spacing":
  "6": "6px"
  "8": "8px"
  "10": "10px"
  "12": "12px"
  "14": "14px"
  "16": "16px"
  "18": "18px"
  "20": "20px"
  "22": "22px"
  "24": "24px"
  "26": "26px"
  "28": "28px"
  "30": "30px"
  "42": "42px"
"components":
  "button-primary":
    "backgroundColor": "{colors.primary}"
    "textColor": "{colors.rail-text}"
    "rounded": "{rounded.control}"
    "padding": "12px 20px"
  "button-primary-hover":
    "backgroundColor": "{colors.accent-hover}"
  "button-secondary":
    "backgroundColor": "{colors.surface}"
    "textColor": "{colors.ink}"
    "rounded": "{rounded.control}"
    "padding": "12px 20px"
  "button-ghost":
    "textColor": "{colors.muted}"
    "rounded": "{rounded.control}"
    "padding": "12px"
  "search-input":
    "backgroundColor": "{colors.surface}"
    "textColor": "{colors.ink}"
    "rounded": "{rounded.control}"
    "padding": "12px 14px 12px 44px"
  "navigation-active":
    "backgroundColor": "{colors.active}"
    "textColor": "{colors.active-ink}"
    "rounded": "{rounded.control}"
    "padding": "10px 14px"
  "filter-chip":
    "backgroundColor": "{colors.surface}"
    "textColor": "{colors.ink}"
    "rounded": "{rounded.control}"
    "padding": "10px 17px"
  "filter-chip-active":
    "backgroundColor": "{colors.primary}"
    "textColor": "{colors.rail-text}"
  "flash-card":
    "backgroundColor": "{colors.surface}"
    "textColor": "{colors.ink}"
    "rounded": "{rounded.surface}"
    "padding": "24px 30px"
  "source-reference":
    "textColor": "{colors.muted}"
    "typography": "{typography.annotation}"
  "answer-option":
    "backgroundColor": "{colors.surface}"
    "textColor": "{colors.ink}"
    "rounded": "{rounded.option}"
    "padding": "15px"
---

# Design System: Lexi

## Overview

**Creative North Star: "Reading annotations"**

A calm, practical study workspace connects vocabulary to its source reading. A sage navigation rail, paper surfaces and clear system type give familiar controls a coherent academic character. The user delegated composition while fixing the principal green and retaining light/dark themes and Russian/Kazakh support.

Density follows the task: compact dictionary rows and source notes surround a generous central study word. Tonal separation and fine borders carry hierarchy; decoration does not compete with reading.

**Key Characteristics:**

- Familiar controls with a clear primary action.
- Paper-like light surfaces and charcoal-green dark surfaces.
- Source references stay adjacent to the vocabulary they explain.

## Colors

Muted green supplies identity; green-tinted neutrals keep the two themes related. The frontmatter is normative: unprefixed tokens describe the light theme, and `dark-` counterparts describe dark-theme overrides from `assets/style.css`. Components consume the corresponding runtime CSS variables.

### Primary

- **Sage green** (`primary` / `dark-primary`): principal actions, selected filters and the light navigation rail. Hover uses the theme's accent-hover token.
- **Navigation greens** (`rail`, `active`, `active-ink`, with dark counterparts): permanent navigation and its current-location treatment. The dark rail is deeper, with a sage active item.

### Neutral

- **Paper** (`paper`): overall canvas; **surface**: cards, inputs and dialogs; **soft**: practice context, examples and revealed cards.
- **Reading ink** (`ink`) and **annotation ink** (`muted`): primary content and secondary source metadata. **Line** separates rows and frames controls.
- Rail text and rail muted preserve a distinct navigation hierarchy. All these roles have dark counterparts.
- Success, error and error-background roles distinguish feedback. Focus uses its dedicated theme token; dark progress uses a lighter green for visibility.

## Typography

All text uses **Segoe UI, Arial, sans-serif**, with no downloaded font. The hierarchy is practical and supports Cyrillic, Kazakh and English consistently. Frontmatter records the observed role values; headline is the page heading, title/subtitle are section headings, body is ordinary copy, annotation is source metadata, and study-word is the flashcard focal point.

Body paragraphs have a maximum width of (72ch). Source titles wrap; study words and translations allow long-word breaks. Progress figures use tabular numerals. On phones, page headings become (30px) and study words (30px). No typographic scale ratio is imposed by the implementation.

## Layout

Desktop uses a fixed left rail (224px), an (88px) topbar, and a centered content region capped at (1280px) including padding. Main gutters are (42px); practice content caps at (780px). Repeated gaps generally fall between (12–28px). Rows use thin separators instead of a separate card for each record.

- At widths at least (1450px), main top padding grows to (52px), and topbar contents align to the centered content.
- At widths at most (1120px), the rail becomes (196px), main gutters (28px), and directory columns tighten.
- At widths at most (840px), the rail becomes bottom navigation, the topbar becomes (72px), breadcrumbs hide, and the practice container caps at (700px). Bottom navigation reserves safe-area padding; footer and toast clear it.
- At widths at most (600px), main gutters become (20px); setup, answer options and statistics stack. Dictionary translations sit below the word, beside the audio/save actions. Source metadata remains visible.

## Elevation & Depth

The workspace is flat at rest: paper, surface and soft tones plus one-pixel borders create hierarchy. Only the settings dialog uses the theme's shadow token; its scrim separates the temporary task. Exact shadow values, scrim and motion live in the sidecar.

Page changes reveal content over (.24s); toast opacity changes over (.18s). Reduced-motion preference removes animations and transitions and restores automatic scroll behavior.

## Shapes

Soft rectangular controls use the control radius; cards and context panels use the surface radius, with slightly rounder dialogs. Answer choices use the option radius. Keyboard hints use the small key radius. Progress tracks and status dots are narrow or circular functional markers, not a pill-shaped control language. Inline icons are thin rounded strokes, normally (20px).

## Components

- **Buttons:** primary green/white actions, surface-and-border secondary actions, and muted ghost actions share a (46px) minimum height. Icon buttons are (44px) squares. Hover adjusts brightness; primary hover also changes the accent. Disabled buttons reduce opacity and change the cursor.
- **Inputs and selects:** solid surface, fine line border and control radius. Search includes an inset icon and a (48px) minimum height; selects are at least (46px). Typed answers use paper with larger text. Every interactive control retains a (3px) focus outline offset by (3px).
- **Filter chips:** rectangular, bordered, at least (44px) high. Selected state is green with white text; selection is also exposed through control semantics.
- **Navigation:** icon and label rows on the rail; active rows use active background/ink. Bottom navigation uses soft selected backgrounds and visible labels. Keep RU/KK labels legible rather than forcing a desktop width.
- **Study cards and context panels:** bordered surface cards reserve space for source metadata, word, audio and reveal affordance. Revealed cards switch to soft. Examples remain secondary in a separate soft panel with translation underneath.
- **Source-to-word references:** muted annotations show unit, reading title and page range immediately beside the word or question. Dictionary rows expand into examples and a practice action. These are provenance labels, not decorative badges or fabricated links.
- **Answer choices and feedback:** neutral choices become success or error states with explicit feedback. Preserve the displayed answer and explanatory example; do not rely on colored borders alone.
- **Settings and status:** native dialog with a constrained viewport height; short toast messages use inverse ink/surface and live status semantics. Keep source attribution and device-local persistence disclosures readable.

Implementation references: `assets/style.css` owns tokens and responsive rules; `index.html` owns persistent navigation, language and theme controls; `assets/app.js` owns study, dictionary, feedback and source-reference patterns. `PRODUCT.md` records binding product constraints; `.impeccable/surfaces/index-html.md` records the chosen surface direction. This document records the implementation, not an external comparison or user endorsement.

## Do's and Don'ts

### Do:

- **Do** use semantic CSS variables so both themes retain the same hierarchy.
- **Do** keep unit, reading title and page references with vocabulary; permit wrapping.
- **Do** retain visible focus, labelled controls and keyboard access in Russian and Kazakh.
- **Do** let long translations and source titles wrap at narrow widths.

### Don't:

- **Don't** introduce a separate display font or decorative imagery into study controls.
- **Don't** communicate correctness with color alone; retain feedback text and icons.
- **Don't** present reading page ranges as verified page locations for every word.
- **Don't** animate when reduced motion is requested.
