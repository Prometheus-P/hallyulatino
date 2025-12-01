import { test, expect } from '@playwright/test';

test.describe('404 Error Page', () => {
  test('404 page displays for non-existent routes', async ({ page }) => {
    const response = await page.goto('/this-page-does-not-exist');

    // Should return 404 status (in dev) or show 404 content
    // Note: Static sites may return 200 with 404 content
    await expect(page.locator('body')).toContainText(/404|no encontr|not found/i);
  });

  test('404 page has navigation back to home', async ({ page }) => {
    await page.goto('/non-existent-page-12345');

    // Should have link to go back home
    const homeLink = page.locator('a[href="/"]');
    await expect(homeLink.first()).toBeVisible();
  });

  test('404 page has proper styling', async ({ page }) => {
    await page.goto('/another-fake-page');

    // Check page has content (not blank)
    const content = await page.locator('body').textContent();
    expect(content?.length).toBeGreaterThan(50);
  });
});
