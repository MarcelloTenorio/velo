import { test, expect } from '@playwright/test';


// Acessa a URL base (http://localhost:5173 via baseURL do Playwright) antes de cada teste
test.describe('Configuração do Veículo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/configure');
  });

  test('deve atualizar a imagem e manter o preço base ao alterar a cor do veículo', async ({ page }) => {
    const VALOR_BASE = '40.000,00';
    const priceElement = page.getByTestId('total-price');
    const car = page.locator('img[alt^="Velô Sprint"]');

    // Passo 1: Verificar o preço inicial de venda (R$ 40.000,00)
    await expect(priceElement).toBeVisible();
    await expect(priceElement).toContainText(VALOR_BASE);

    // Passo 2: Selecionar uma cor exterior diferente e garantir que o preço permanece o mesmo
    await page.getByRole('button', { name: 'Midnight Black' }).click();
    await expect(priceElement).toContainText(VALOR_BASE);
    //validar alteração da imagem
    await expect(car).toHaveAttribute('src', '/src/assets/midnight-black-aero-wheels.png');
  });




  test('deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrão', async ({ page }) => {
    const VALOR_BASE = '40.000,00';
    const VALOR_SPORT = '42.000,00';
    const priceElement = page.getByTestId('total-price');
    const car = page.locator('img[alt^="Velô Sprint"]');

    // Passo 1: Verificar o preço inicial de venda (R$ 40.000,00)
    await expect(priceElement).toBeVisible();
    await expect(priceElement).toContainText(VALOR_BASE);

    // Passo 2: Selecionar rodas "Sport Wheels" e validar acréscimo de R$ 2.000,00 (R$ 42.000,00)
    await page.getByRole('button', { name: /Sport Wheels/ }).click();
    await expect(priceElement).toContainText(VALOR_SPORT);
    //validar alteração da imagem
    await expect(car).toHaveAttribute('src', '/src/assets/glacier-blue-sport-wheels.png');

    // Passo 3: Voltar para "Aero Wheels" e garantir que o preço retorna ao valor base
    await page.getByRole('button', { name: /Aero Wheels/ }).click();
    await expect(priceElement).toContainText(VALOR_BASE);
    //validar alteração da imagem
    await expect(car).toHaveAttribute('src', '/src/assets/glacier-blue-aero-wheels.png');

  });
});

