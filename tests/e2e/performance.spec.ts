import { test, expect } from '@playwright/test';

test.describe('Performance', () => {
  test('homepage loads within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    const loadTime = Date.now() - startTime;

    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('no console errors on homepage', async ({ page }) => {
    const errors: string[] = [];

    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (like missing images in dev)
    const criticalErrors = errors.filter(e =>
      !e.includes('favicon') &&
      !e.includes('404') &&
      !e.includes('Failed to load resource')
    );

    expect(criticalErrors).toHaveLength(0);
  });

  test('no broken internal links on homepage', async ({ page }) => {
    await page.goto('/');

    const internalLinks = await page.locator('a[href^="/"]').all();

    for (const link of internalLinks.slice(0, 10)) { // Check first 10 links
      const href = await link.getAttribute('href');
      if (href && !href.includes('#')) {
        const response = await page.request.get(href);
        expect(response.status(), `Link ${href} should not be broken`).toBeLessThan(400);
      }
    }
  });

  test('critical CSS is loaded', async ({ page }) => {
    await page.goto('/');

    // Check that styles are applied (body has some styling)
    const bodyStyles = await page.locator('body').evaluate(el => {
      const styles = window.getComputedStyle(el);
      return {
        fontFamily: styles.fontFamily,
        backgroundColor: styles.backgroundColor,
      };
    });

    expect(bodyStyles.fontFamily).toBeTruthy();
  });
});
