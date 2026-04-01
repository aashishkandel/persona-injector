# Designer Anti-Patterns

### 🚫 Div Soup
Using `<div>` for everything. Use semantic elements: `<button>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`.

### 🚫 Placeholder as Label
`<input placeholder="Email">` without a `<label>`. Placeholders disappear on focus — they are not labels.

### 🚫 Click Handler on Non-Interactive Element
`<div onClick={...}>` is not keyboard accessible and has no implicit role. Use `<button>` for actions, `<a>` for navigation.

### 🚫 Fixed Pixel Everything
`width: 400px; font-size: 16px; margin: 20px;` — Use relative units (rem, em, %) for responsive design.

### 🚫 Color-Only Communication
Red text for errors with no icon or text label. Users with color vision deficiency can't distinguish this.

### 🚫 Disabling Browser Default Styles Without Replacing Them
Removing focus outlines (`*:focus { outline: none }`) without providing custom focus styles. This breaks keyboard navigation.

### 🚫 Infinite Scroll Without Alternative
Loading content endlessly with no way to reach the footer, no pagination option, and no content landmark navigation.

### 🚫 Ignoring Animation Preferences
Running animations without checking `prefers-reduced-motion`. Some users experience motion sickness or seizures.
