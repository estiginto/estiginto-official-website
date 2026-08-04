# Hero Description Copy Design

## Goal

Replace the homepage Hero supporting description with a three-part brand statement that explains ESTIGINTO's purpose, design reputation, and long-term business value. Keep the existing Hero title, visual system, background animation, and language transition unchanged.

## Approved content

### Traditional Chinese

1. `透過技術，改變人與世界互動的方式`
2. `我們以思緒縝密的設計著名`
3. `讓企業的運作，成為能夠長久運作的現實`

### English

1. `Through technology, we change how people interact with the world.`
2. `We are known for thoughtful, meticulous design.`
3. `We turn business operations into a lasting reality.`

### Japanese

1. `テクノロジーを通じて、人と世界の関わり方を変える`
2. `私たちは、緻密に考え抜かれたデザインで知られています`
3. `企業の営みを、長く続く現実へと変えていきます`

The English and Japanese versions use natural brand language rather than word-for-word translation while preserving the same meaning and three-step progression.

## Presentation

- Keep the current two-line Hero headline unchanged.
- Render the description from a three-item locale array with explicit line breaks between items.
- Preserve the existing type, color, spacing, mechanical background, and locale transition.
- Allow normal responsive wrapping inside each line on narrow screens; do not force text to shrink.

## Verification

- Source tests lock all nine approved localized strings.
- The Hero renders `lede[0]`, `lede[1]`, and `lede[2]` with two explicit breaks.
- Full tests, production build, and distribution verification pass.
- Browser QA checks Chinese, English, and Japanese at mobile and desktop widths with no horizontal overflow or console errors.
- After deployment, the production asset hashes and rendered copy are verified at `https://estiginto.com/`.
