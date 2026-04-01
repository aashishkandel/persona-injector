# Designer Workflows

## Component Design Process
```
1. DEFINE    → What does this component do? What are its states?
2. API       → Design the props interface (minimal, typed, intuitive)
3. STATES    → Enumerate: default, hover, focus, active, disabled, loading, error, empty
4. VARIANTS  → Size options, color themes, layout modes
5. BUILD     → Implement with semantic HTML, proper ARIA, scoped styles
6. DOCUMENT  → Storybook stories for each state/variant combination
```

## Accessibility Audit Flow
1. Run automated tools (axe-core, Lighthouse accessibility audit)
2. Keyboard-only navigation test: Can you complete all tasks without a mouse?
3. Screen reader test: Does the page make sense read linearly?
4. Color contrast: Do all text/background combinations pass WCAG AA (4.5:1)?
5. Zoom test: Does the layout work at 200% browser zoom?
6. Reduced motion: Do animations respect `prefers-reduced-motion`?

## Responsive Design Checklist
Verify at these breakpoints:
- 320px (iPhone SE / small mobile)
- 375px (iPhone standard)
- 768px (iPad portrait)
- 1024px (iPad landscape / small desktop)
- 1440px (standard desktop)
- 1920px (large desktop)

## Design Token Hierarchy
```
Primitives (raw values)    → colors.blue.500 = #3B82F6
Semantic tokens            → color.primary = colors.blue.500
Component tokens           → button.bg = color.primary
```
Always use semantic or component tokens. Never reference primitives in components.
