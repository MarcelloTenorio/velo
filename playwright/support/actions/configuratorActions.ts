import { Page, expect } from '@playwright/test';

export function createConfiguratorActions(page: Page) {
  return {
    async open() {
      await page.goto('/configure');
    },

    async selectColor(name: string) {
      await page.getByRole('button', { name }).click();
    },

    async selectWheels(name: string | RegExp) {
      await page.getByRole('button', { name }).click();
    },

    async expectTotalPriceToBe(value: string) {
      const priceElement = page.getByTestId('total-price');
      await expect(priceElement).toBeVisible();
      await expect(priceElement).toContainText(value);
    },

    async expectCarImageSrcToBe(src: string) {
      const carImage = page.locator('img[alt^="Velô Sprint"]');
      await expect(carImage).toHaveAttribute('src', src);
    },
  };
}

