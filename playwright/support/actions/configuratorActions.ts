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

    // Ações de opcionais <<----------------------------------------------

    async expectOptionalToBeVisible(name: string) {
      const checkbox = page.getByRole('checkbox', { name });
      await expect(checkbox).toBeVisible();
    },

    async expectOptionalNotToBeChecked(name: string) {
      const checkbox = page.getByRole('checkbox', { name });
      await expect(checkbox).not.toBeChecked();
    },

    async toggleOptional(name: string) {
      await page.getByRole('checkbox', { name }).click();
    },

    
    async goToCheckout() {
      await page.getByRole('button', { name: 'Monte o Seu' }).click();
    },

    async expectCheckoutUrl() {
      await expect(page).toHaveURL(/\/order/);
    },
    async expectSummaryTotalPriceToBe(value: string) {
      await expect(page.getByTestId('summary-total-price')).toContainText(value);
    },
  };
}

