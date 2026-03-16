import { test, expect } from '@playwright/test';

const VALOR_BASE = '40.000,00';
const VALOR_SPORT = '42.000,00';

test.describe('CT02 - Configuração de Cores e Rodas', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/configure', { waitUntil: 'domcontentloaded' });
  });

  test('alternar cores do veículo mantendo o preço base', async ({ page }) => {
    const totalPrice = page.getByTestId('total-price');
    const car = page.locator('img[alt^="Velô Sprint"]');
    // Arrange: acessar a URL de configuração a partir da landing page
    /*   await expect(page.getByRole('heading', { name: 'Velô Sprint', level: 1 })).toBeVisible();
      await page.getByRole('link', { name: 'Configure Agora' }).click();
      await expect(page).toHaveURL(/\/configure/); */

    // Passo 1: verificar preço inicial de venda
    await expect(totalPrice).toBeVisible();
    await expect(totalPrice).toContainText(VALOR_BASE);

    // Passo 2: selecionar outras cores exteriores e garantir que o preço permanece o mesmo
    await page.getByRole('button', { name: 'Midnight Black' }).click();
    await expect(totalPrice).toContainText(VALOR_BASE);

    /*     await page.getByRole('button', { name: 'Lunar White' }).click();
        await expect(totalPrice).toContainText(VALOR_BASE); */

    await expect(car).toHaveAttribute('src', '/src/assets/midnight-black-aero-wheels.png');
  });

  test('atualizar o preço ao alterar as rodas do veículo', async ({ page }) => {
    const car = page.locator('img[alt^="Velô Sprint"]');
    // Arrange: acessar a URL de configuração a partir da landing page
    /* await expect(page.getByRole('heading', { name: 'Velô Sprint', level: 1 })).toBeVisible();
    await page.getByRole('link', { name: 'Configure Agora' }).click();
    await expect(page).toHaveURL(/\/configure/); */

    // Passo 1: verificar preço inicial de venda
    const totalPrice = page.getByTestId('total-price');
    await expect(totalPrice).toBeVisible();
    await expect(totalPrice).toContainText(VALOR_BASE);

    // Passo 2: selecionar rodas Sport Wheels e validar acréscimo no preço
    await page.getByRole('button', { name: 'Sport Wheels' }).click();
    await expect(totalPrice).toContainText(VALOR_SPORT);
    // Checkpoint: conferir visualmente que Sport está selecionado
    await expect(page.getByRole('button', { name: /Sport Wheels/i })).toBeVisible();
    await expect(car).toHaveAttribute('src', '/src/assets/glacier-blue-sport-wheels.png');

    // Passo 3: voltar para Aero Wheels e garantir que o preço retorna ao valor base
    await page.getByRole('button', { name: 'Aero Wheels' }).click();
    await expect(totalPrice).toContainText(VALOR_BASE);
    await expect(car).toHaveAttribute('src', '/src/assets/glacier-blue-aero-wheels.png');
  });
});

