import { test, expect } from '@playwright/test';

test.describe('Content Pages', () => {
  test.describe('K-Dramas Section', () => {
    test('dramas index shows all dramas', async ({ page }) => {
      await page.goto('/dramas');

      // Check page title
      await expect(page.locator('h1')).toBeVisible();

      // Check drama cards are visible
      const dramaLinks = page.locator('a[href^="/dramas/"]');
      await expect(dramaLinks.first()).toBeVisible();

      // Verify at least 4 dramas exist
      const count = await dramaLinks.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('drama detail page loads correctly', async ({ page }) => {
      await page.goto('/dramas/squid-game');

      // Check article content
      await expect(page.locator('article')).toBeVisible();
      await expect(page.locator('h1')).toContainText(/Squid Game/i);

      // Check share buttons exist
      await expect(page.locator('.share-buttons').first()).toBeVisible();
    });
  });

  test.describe('K-Pop Section', () => {
    test('kpop index shows all artists', async ({ page }) => {
      await page.goto('/kpop');

      await expect(page.locator('h1')).toBeVisible();

      const artistLinks = page.locator('a[href^="/kpop/"]');
      await expect(artistLinks.first()).toBeVisible();

      const count = await artistLinks.count();
      expect(count).toBeGreaterThanOrEqual(4);
    });

    test('artist detail page loads correctly', async ({ page }) => {
      await page.goto('/kpop/bts');

      await expect(page.locator('article')).toBeVisible();
      await expect(page.locator('h1')).toContainText(/BTS/i);
    });
  });

  test.describe('Noticias Section', () => {
    test('noticias index shows all news', async ({ page }) => {
      await page.goto('/noticias');

      await expect(page.locator('h1')).toBeVisible();

      const newsLinks = page.locator('a[href^="/noticias/"]');
      await expect(newsLinks.first()).toBeVisible();

      // Verify at least 10 noticias exist
      const count = await newsLinks.count();
      expect(count).toBeGreaterThanOrEqual(10);
    });
  });

  test.describe('Guías Section', () => {
    test('guias index shows all guides', async ({ page }) => {
      await page.goto('/guias');

      await expect(page.locator('h1')).toBeVisible();

      const guideLinks = page.locator('a[href^="/guias/"]');
      await expect(guideLinks.first()).toBeVisible();

      const count = await guideLinks.count();
      expect(count).toBeGreaterThanOrEqual(3);
    });
  });
});
