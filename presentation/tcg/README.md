# TCG Talent & Teams — General Presentation

An 11-slide editorial executive presentation for TCG, a boutique
executive-search and organizational-consulting firm. Designed for live
delivery to CEOs and boards.

## Open the deck

Two ways to open, same deck either way:

**Easiest — single-file bundle.** Double-click
`TCG General Presentation - bundled.html`. CSS and JS are inlined,
so it runs anywhere you drop it (email attachment, USB stick, etc.)
as long as you have internet for the fonts.

**Source version.** Double-click `TCG General Presentation.html` —
this one loads `styles.css` and `deck-stage.js` from the same folder.

**Recommended for either version (avoids `file://` quirks):**

```bash
cd presentation/tcg
python3 -m http.server 8000
```

Then open <http://localhost:8000/TCG%20General%20Presentation.html>
or <http://localhost:8000/TCG%20General%20Presentation%20-%20bundled.html>.

> Fonts (Source Serif 4, Open Sans) load from Google Fonts — present
> with an internet connection.

## Keyboard

| Key | Action |
| --- | --- |
| `→` `↓` `Space` `PgDn` | Next slide |
| `←` `↑` `PgUp` | Previous slide |
| `Home` / `End` | First / last slide |
| `1`–`9`, `0` | Jump to slide N |
| `R` | Reset to slide 1 |

The deck remembers your slide on refresh (localStorage).

## Interactive moments

- **Slide 7 (Flujo Vanguard)** — click the three method cards
  ("Terrain", "Root Causes", "People") to jump to slides 8 / 9 / 10.
- **Slides 8–10 (Wardley / Cynefin / Estuarine)** — `← Back` button
  top-right returns to slide 7.
- **Slide 8 (Wardley map)** — hover any node for an annotation card.
- **Slides 1, 3, 5, 6, 9, 10** — staggered animations on entry
  (cover trapezoids, stat count-ups, reveal beats, framework pulses).

## Files

```
TCG General Presentation.html            the deck (11 slides) — loads external CSS/JS
TCG General Presentation - bundled.html  same deck, CSS + JS inlined — single file
styles.css                               design system (palette, type, layouts)
deck-stage.js                            <deck-stage> web component (nav, scaling, persistence)
assets/                                  brand logo PNG variants
```

The deck is authored at 1920×1080. `<deck-stage>` auto-scales it
letterboxed to fit any viewport.
