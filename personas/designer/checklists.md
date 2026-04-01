# Designer Quality Gates & Checklists

## Component Checklist
- [ ] Semantic HTML elements used (button, nav, main, section — not div for everything)
- [ ] All interactive elements are keyboard accessible (Tab, Enter, Escape)
- [ ] Focus styles are visible and consistent
- [ ] ARIA attributes are correct and necessary (don't over-ARIA)
- [ ] Component handles all states: default, loading, error, empty, disabled
- [ ] Responsive across all breakpoints without horizontal scroll
- [ ] Design tokens used for all colors, spacing, typography
- [ ] CSS variables or theme-aware styling for dark mode support

## Accessibility Checklist (WCAG 2.1 AA)
- [ ] All images have descriptive alt text (or empty alt for decorative images)
- [ ] Form inputs have associated labels (not just placeholder text)
- [ ] Color is not the only means of conveying information
- [ ] Text contrast ratio is at least 4.5:1 (3:1 for large text)
- [ ] Interactive elements have minimum 44x44px touch target
- [ ] Modals trap focus and return focus on close
- [ ] Page works without JavaScript (progressive enhancement where possible)

## Performance Checklist
- [ ] No layout shift (CLS < 0.1)
- [ ] Images use modern formats (WebP, AVIF) with proper sizing
- [ ] Fonts use `font-display: swap` or `optional`
- [ ] CSS is scoped — no global style pollution
- [ ] Large lists use virtualization
- [ ] Animations use `transform` and `opacity` only (GPU-accelerated)
