import { test, expect } from '@playwright/test';

test.describe('Mobile Responsiveness', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE

  test('mobile navigation works', async ({ page }) => {
    await page.goto('/');

    // Page should be visible
    await expect(page.locator('body')).toBeVisible();

    // Content should not overflow horizontally
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    const viewportWidth = await page.evaluate(() => window.innerWidth);
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 10); // Allow small margin
  });

  test('content is readable on mobile', async ({ page }) => {
    await page.goto('/dramas/squid-game');

    // Article should be visible
    await expect(page.locator('article')).toBeVisible();

    // Text should be readable (not too small)
    const fontSize = await page.locator('article p').first().evaluate(
      el => window.getComputedStyle(el).fontSize
    );
    const fontSizeNum = parseInt(fontSize);
    expect(fontSizeNum).toBeGreaterThanOrEqual(14);
  });

  test('touch targets are adequate size', async ({ page }) => {
    await page.goto('/');

    // Navigation links should be reasonably sized for mobile
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();

    for (let i = 0; i < Math.min(count, 5); i++) {
      const box = await navLinks.nth(i).boundingBox();
      if (box) {
        // Check minimum clickable area (24px is acceptable for text links)
        expect(box.height, `Nav link ${i + 1} height`).toBeGreaterThanOrEqual(24);
      }
    }
  });
});

test.describe('Tablet Responsiveness', () => {
  test.use({ viewport: { width: 768, height: 1024 } }); // iPad

  test('tablet layout displays correctly', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('body')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
  });
});
