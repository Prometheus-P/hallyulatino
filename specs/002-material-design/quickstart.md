# Quickstart: M3 Design System Verification

**Feature**: 002-material-design
**Purpose**: Manual and automated testing guide for M3 implementation

## Prerequisites

- Site running locally: `pnpm dev`
- Build complete: `pnpm build`
- Playwright installed: `pnpm test:e2e`

## Quick Verification Checklist

### 1. Visual Consistency (US1)

- [ ] Open homepage - verify consistent pink (#ec4899) accent across all elements
- [ ] Check navigation bar - consistent typography and spacing
- [ ] View article card - consistent border radius, shadows, typography
- [ ] Click through to article page - same design language maintained
- [ ] Check search results page - styling consistent with rest of site

**Pass Criteria**: All pages use same color palette, typography scale, spacing rhythm

### 2. Accessibility (US2)

- [ ] Run Lighthouse Accessibility audit: score ≥95
- [ ] Test keyboard navigation: Tab through all interactive elements
- [ ] Verify focus indicators: visible on all buttons, links, inputs
- [ ] Check color contrast: use browser DevTools (4.5:1 for text)
- [ ] Test with screen reader: headings announced correctly

**Pass Criteria**: Zero critical accessibility violations

### 3. Responsive Layout (US3)

Test at these widths:

| Viewport | Width | Expected Layout |
|----------|-------|-----------------|
| Mobile | 375px | Single column, full-width cards |
| Tablet | 768px | 2-column grid |
| Desktop | 1280px | 3-column grid, max-width container |

- [ ] No horizontal scrolling at any viewport
- [ ] Text readable without zooming on mobile
- [ ] Touch targets ≥44px on mobile

**Pass Criteria**: Layout adapts correctly at all breakpoints

### 4. Dark Mode (US1 + Edge Cases)

- [ ] Enable system dark mode preference
- [ ] Verify all colors invert appropriately
- [ ] Check text contrast remains ≥4.5:1
- [ ] Images and icons remain visible
- [ ] No "flash" of light mode on page load

**Pass Criteria**: Dark mode fully functional with same level of polish

### 5. Interactive Feedback (US4)

- [ ] Hover over buttons: visual feedback visible
- [ ] Focus on inputs: focus ring visible
- [ ] Click buttons: pressed state visible
- [ ] Check reduced-motion: animations disabled when preference set

**Pass Criteria**: All interactive elements have clear state feedback

## Automated Tests

### Run All Design System Tests

```bash
pnpm test:e2e tests/e2e/design-*.spec.ts
```

### Run Accessibility Tests Only

```bash
pnpm test:e2e tests/e2e/accessibility.spec.ts
```

### Run Visual Consistency Tests Only

```bash
pnpm test:e2e tests/e2e/visual-consistency.spec.ts
```

### Run Lighthouse Audit

```bash
npx lighthouse http://localhost:4321 --only-categories=accessibility,performance --output=json
```

## CSS Token Verification

### Verify Tokens Are Loaded

Open browser DevTools Console:

```javascript
// Check primary color is set
getComputedStyle(document.documentElement).getPropertyValue('--md-color-primary')
// Should return: #ec4899 (light) or #f9a8d4 (dark)

// Check typography is applied
getComputedStyle(document.documentElement).getPropertyValue('--md-typo-body-large-size')
// Should return: 1rem
```

### Verify Dark Mode Tokens

1. Open DevTools → Rendering → Emulate prefers-color-scheme: dark
2. Check that `--md-color-surface` returns `#111827`
3. Check that `--md-color-on-surface` returns `#f9fafb`

## Performance Verification

### Bundle Size Check

```bash
pnpm build
du -h dist/_astro/*.css
```

**Pass Criteria**: Total CSS ≤50KB

### Lighthouse Performance

```bash
npx lighthouse http://localhost:4321 --only-categories=performance --output=json
```

**Pass Criteria**: Performance score ≥90

### Core Web Vitals

| Metric | Target | How to Check |
|--------|--------|--------------|
| LCP | <2.5s | Lighthouse or PageSpeed Insights |
| FID | <100ms | Chrome DevTools Performance |
| CLS | <0.1 | Lighthouse or Layout Instability tool |

## Troubleshooting

### Tokens Not Applied

1. Check `global.css` imports design tokens
2. Verify no CSS specificity conflicts
3. Check browser DevTools for computed values

### Dark Mode Not Working

1. Verify `prefers-color-scheme: dark` media query exists
2. Check for competing light-mode styles
3. Test with DevTools Rendering emulation

### Accessibility Violations

1. Run `npx @axe-core/cli http://localhost:4321`
2. Check specific violations and fix
3. Re-run until zero violations

### Performance Issues

1. Check for unused CSS with DevTools Coverage
2. Verify fonts use `font-display: swap`
3. Check for render-blocking resources

## Success Criteria Summary

| Criteria | Target | Verification Method |
|----------|--------|---------------------|
| Lighthouse Accessibility | ≥95 | `npx lighthouse` |
| WCAG 2.1 AA Contrast | 4.5:1 | DevTools/automated |
| CSS Bundle Size | ≤50KB | `du -h dist/*.css` |
| FCP Increase | ≤100ms | Lighthouse comparison |
| Focus Indicators | 100% | Manual + automated |
| Dark Mode Support | Full | Manual + automated |
| Responsive Layouts | 3 breakpoints | Manual + automated |
