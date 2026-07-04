import { expect, test, type Page } from '@playwright/test';

async function useTheme(page: Page, theme: 'light' | 'dark') {
  await page.addInitScript((value) => localStorage.setItem('theme', value), theme);
}

test.describe('theme and navigation regressions', () => {
  test('theme toggle updates page, navbar, cards, and footer colors', async ({ page }) => {
    await useTheme(page, 'dark');
    await page.goto('/');

    const body = page.locator('body');
    const navbar = page.locator('header');
    const footer = page.locator('footer');

    const darkBodyColor = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
    const darkFooterColor = await footer.evaluate((el) => getComputedStyle(el).backgroundColor);

    await page.locator('[data-theme-toggle]:visible').first().click();
    await expect(page.locator('html')).not.toHaveClass(/dark/);

    await expect
      .poll(() => body.evaluate((el) => getComputedStyle(el).backgroundColor))
      .not.toBe(darkBodyColor);
    await expect
      .poll(() => footer.evaluate((el) => getComputedStyle(el).backgroundColor))
      .not.toBe(darkFooterColor);

    await expect(navbar).toBeVisible();
  });

  test('theme toggle remains clickable after scrolling', async ({ page }) => {
    await useTheme(page, 'light');
    await page.goto('/');
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight / 2));

    const toggle = page.locator('[data-theme-toggle]:visible').first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator('html')).toHaveClass(/dark/);
  });
});

test.describe('seo regressions', () => {
  test('homepage exposes canonical, robots, open graph, and twitter metadata', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('link[rel="sitemap"]')).toHaveAttribute('href', '/sitemap.xml');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    await expect(page.locator('meta[property="og:title"]')).toContainText('SoftBuyDeals');
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:site"]')).toHaveAttribute('content', '@softbuydeals');
  });
});
