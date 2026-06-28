# InFocus Film School — Meta Ad Case Study

A static, single-page case-study site built with vanilla HTML, CSS, and JavaScript — no frameworks, no build step, no dependencies.

**Live:** http://romanjahandideh.com/infocus-meta-ad-case-study/

## Tech Stack

**HTML5**
- Semantic markup, no templating engine

**CSS3**
- Custom properties for design tokens (color, spacing, easing curves)
- Grid and Flexbox layouts; `clamp()` for fluid type and spacing
- `position: sticky`, `aspect-ratio`, `backdrop-filter`
- `prefers-reduced-motion` and `hover`/`pointer` media features to branch behavior between mouse and touch input

**JavaScript**
- No external libraries, frameworks, or polyfills
- `IntersectionObserver` for scroll-triggered reveals and active-nav-link tracking
- `requestAnimationFrame` easing loop driving the magnifier interaction
- Touch and Pointer Events powering the before/after comparison slider and swipe-based carousel navigation
- Code organized as self-contained IIFEs, one per feature

**Fonts**
- Inter / Inter Tight, served from Google Fonts

**Accessibility**
- Skip-to-content link, `:focus-visible` states, `aria-*` attributes on interactive components
- Touch-only controls are visually hidden (not `display: none`) so they stay reachable for keyboard and screen-reader users

## Project Structure

```
index.html   Markup for every section
style.css     All styling, mobile-first, organized by section
script.js     All behavior, one IIFE per feature
assets/       Images referenced by index.html
```

## Running Locally

No build step or package manager required. Either open `index.html` directly in a browser, or serve the directory with any static file server:

```bash
npx serve .
# or
python -m http.server
```

## Browser Support

Targets current evergreen browsers (Chrome, Safari, Firefox, Edge) and degrades gracefully where `backdrop-filter` or `aspect-ratio` are unsupported.
