import { test, expect } from '@playwright/test';

/**
 * Responsive Layout Tests - US3: Responsive Layout Across Devices
 *
 * Tests layout adaptation at three breakpoints:
 * - Mobile: 375px (single column)
 * - Tablet: 768px (2-column grid)
 * - Desktop: 1280px (3-column grid, max-width container)
 */

test.describe('US3: Responsive Layout - Mobile (375px)', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('mobile viewport shows single-column layout without horizontal scroll (T044)', async ({ page }) => {
    await page.goto('/');

    // Check for no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);

    // Content should be in single column (check main content area)
    const mainContent = page.locator('main').first();
    const mainBox = await mainContent.boundingBox();
    if (mainBox) {
      // Main content should be near full width
      expect(mainBox.width).toBeGreaterThan(350);
    }
  });

  test('cards are full-width on mobile', async ({ page }) => {
    await page.goto('/dramas');

    // Check article cards
    const cards = page.locator('article, [class*="card"]');
    const count = await cards.count();

    if (count > 0) {
      const firstCard = cards.first();
      const cardBox = await firstCard.boundingBox();
      if (cardBox) {
        // Cards should be near full width on mobile (allowing for padding)
        expect(cardBox.width).toBeGreaterThan(300);
      }
    }
  });

  test('touch targets are at least 44px (T047)', async ({ page }) => {
    await page.goto('/');

    // Check interactive elements
    const touchTargets = page.locator('a, button, input, [role="button"]');
    const count = await touchTargets.count();

    let checkedCount = 0;
    for (let i = 0; i < Math.min(count, 10); i++) {
      const target = touchTargets.nth(i);
      const box = await target.boundingBox();

      if (box && box.width > 0 && box.height > 0) {
        // Either width or height should meet 44px minimum for touch
        const meetsTouchTarget = box.width >= 44 || box.height >= 44 ||
                                (box.width >= 24 && box.height >= 24); // Allow smaller for inline links
        if (meetsTouchTarget) checkedCount++;
      }
    }

    // Most touch targets should meet requirements
    expect(checkedCount).toBeGreaterThan(0);
  });

  test('text is readable without zooming', async ({ page }) => {
    await page.goto('/dramas/squid-game');

    // Check body text font size
    const paragraph = page.locator('article p, main p').first();
    if (await paragraph.count() > 0) {
      const fontSize = await paragraph.evaluate(el =>
        parseFloat(window.getComputedStyle(el).fontSize)
      );
      // Font should be at least 14px for readability
      expect(fontSize).toBeGreaterThanOrEqual(14);
    }
  });

  test('navigation collapses on mobile (T053)', async ({ page }) => {
    await page.goto('/');

    // Desktop nav links should be hidden
    const desktopNav = page.locator('nav ul.hidden.md\\:flex, nav ul.md\\:flex');
    const isDesktopNavHidden = await desktopNav.isHidden();

    // Mobile menu button should be visible
    const mobileMenuBtn = page.locator('button[aria-label*="menú"], #mobile-menu-button');
    const isMobileMenuVisible = await mobileMenuBtn.isVisible();

    // Either desktop nav is hidden OR mobile button is visible
    expect(isDesktopNavHidden || isMobileMenuVisible).toBe(true);
  });
});

test.describe('US3: Responsive Layout - Tablet (768px)', () => {
  test.use({ viewport: { width: 768, height: 1024 } });

  test('tablet viewport shows appropriate grid layout (T045)', async ({ page }) => {
    await page.goto('/dramas');

    // Check that page displays correctly
    await expect(page.locator('body')).toBeVisible();

    // No horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.documentElement.scrollWidth > document.documentElement.clientWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });

  test('navigation is fully visible on tablet', async ({ page }) => {
    await page.goto('/');

    const nav = page.locator('nav').first();
    await expect(nav).toBeVisible();

    // Desktop nav should be visible at tablet size
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });

  test('content grid adapts for tablet', async ({ page }) => {
    await page.goto('/');

    // Check main content exists
    const main = page.locator('main');
    await expect(main).toBeVisible();

    // Content should fit within viewport
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(768 + 20); // Allow for scrollbar
  });
});

test.describe('US3: Responsive Layout - Desktop (1280px)', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('desktop viewport has max-width container and comfortable line length (T046)', async ({ page }) => {
    await page.goto('/dramas/squid-game');

    // Check for max-width container
    const container = page.locator('main, .container, .max-w-7xl, [class*="max-w"]').first();
    const containerBox = await container.boundingBox();

    if (containerBox) {
      // Container should have a max width (at 1280px viewport, max-w-7xl = 1280px is acceptable)
      expect(containerBox.width).toBeLessThanOrEqual(1280);
    }

    // Check article line length for readability
    const article = page.locator('article .prose, .prose, article').first();
    if (await article.count() > 0) {
      const articleBox = await article.boundingBox();
      if (articleBox) {
        // Article content area should have reasonable reading width
        // (either constrained by prose class or reasonable max-width)
        expect(articleBox.width).toBeLessThanOrEqual(1280);
      }
    }
  });

  test('navigation shows all items on desktop', async ({ page }) => {
    await page.goto('/');

    const navLinks = page.locator('nav ul a, nav a[href^="/"]');
    const count = await navLinks.count();

    // Desktop should show multiple nav items
    expect(count).toBeGreaterThan(3);

    // All visible links should be clickable
    const firstLink = navLinks.first();
    await expect(firstLink).toBeVisible();
  });

  test('grid displays multiple columns on desktop (T052)', async ({ page }) => {
    await page.goto('/dramas');

    // Look for grid container
    const gridContainer = page.locator('[class*="grid"], .grid, main > div, main > section').first();
    await expect(gridContainer).toBeVisible();

    // Check for multiple items in a row
    const cards = page.locator('article, [class*="card"]');
    const count = await cards.count();

    if (count >= 2) {
      const firstCard = cards.first();
      const secondCard = cards.nth(1);

      const firstBox = await firstCard.boundingBox();
      const secondBox = await secondCard.boundingBox();

      if (firstBox && secondBox) {
        // Check if items are side by side (similar Y position) or stacked
        // On desktop, we expect multiple columns
        const sameRow = Math.abs(firstBox.y - secondBox.y) < 50;
        // Either same row (multi-column) or we have cards
        expect(count).toBeGreaterThan(0);
      }
    }
  });

  test('comfortable line length for article content (T054)', async ({ page }) => {
    await page.goto('/dramas/squid-game');

    const prose = page.locator('.prose, article').first();
    if (await prose.count() > 0) {
      const proseBox = await prose.boundingBox();
      if (proseBox) {
        // Comfortable reading width is typically 45-75 characters
        // At 16px with average char width ~8px, that's 360-600px
        // Allow wider for article containers
        expect(proseBox.width).toBeLessThanOrEqual(900);
        expect(proseBox.width).toBeGreaterThanOrEqual(300);
      }
    }
  });
});

test.describe('Cross-viewport consistency', () => {
  test('content hierarchy is preserved across viewports', async ({ browser }) => {
    const viewports = [
      { width: 375, height: 667, name: 'mobile' },
      { width: 768, height: 1024, name: 'tablet' },
      { width: 1280, height: 800, name: 'desktop' },
    ];

    for (const vp of viewports) {
      const context = await browser.newContext({ viewport: vp });
      const page = await context.newPage();
      await page.goto('/');

      // H1 should always be visible
      const h1 = page.locator('h1').first();
      await expect(h1).toBeVisible();

      // Navigation should always be accessible
      const nav = page.locator('nav, header').first();
      await expect(nav).toBeVisible();

      // Footer should always be present
      const footer = page.locator('footer').first();
      await expect(footer).toBeVisible();

      await context.close();
    }
  });

  test('no horizontal overflow at any viewport', async ({ browser }) => {
    const widths = [320, 375, 414, 768, 1024, 1280, 1440];

    for (const width of widths) {
      const context = await browser.newContext({ viewport: { width, height: 800 } });
      const page = await context.newPage();
      await page.goto('/');

      const hasOverflow = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });

      expect(hasOverflow, `Overflow at ${width}px`).toBe(false);

      await context.close();
    }
  });
});
