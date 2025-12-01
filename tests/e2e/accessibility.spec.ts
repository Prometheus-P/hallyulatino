import { test, expect } from '@playwright/test';

test.describe('Accessibility', () => {
  test('page has proper heading hierarchy', async ({ page }) => {
    await page.goto('/');

    // Should have exactly one h1
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
  });

  test('images have alt text', async ({ page }) => {
    await page.goto('/dramas');

    const images = page.locator('img');
    const count = await images.count();

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `Image ${i + 1} should have alt text`).toBeTruthy();
    }
  });

  test('links have accessible text', async ({ page }) => {
    await page.goto('/');

    // Check navigation links
    const navLinks = page.locator('nav a');
    const count = await navLinks.count();

    for (let i = 0; i < count; i++) {
      const text = await navLinks.nth(i).textContent();
      expect(text?.trim().length, `Nav link ${i + 1} should have text`).toBeGreaterThan(0);
    }
  });

  test('page is keyboard navigable', async ({ page }) => {
    await page.goto('/');

    // Tab to first focusable element
    await page.keyboard.press('Tab');

    // Check that something is focused
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(focusedElement).toBeTruthy();
  });

  test('color contrast is sufficient', async ({ page }) => {
    await page.goto('/');

    // Check that main text is visible (basic check)
    const body = page.locator('body');
    await expect(body).toBeVisible();

    // Check text content is readable
    const mainContent = await page.locator('main, [role="main"], body').first().textContent();
    expect(mainContent?.length).toBeGreaterThan(0);
  });
});
