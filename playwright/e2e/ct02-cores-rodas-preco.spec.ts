import { test, expect } from '@playwright/test';


// Acessa a URL base (http://localhost:5173 via baseURL do Playwright) antes de cada teste
test.beforeEach(async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
});


test.describe('CT02 - Configuração do Veículo (Cores e Rodas) e Cálculo do Preço Base', () => {
  const VALOR_BASE = '40.000,00';
  const VALOR_SPORT = '42.000,00';

  test('deve manter o preço base ao trocar apenas a cor e alterar ao selecionar rodas Sport', async ({ page }) => {
      // Garante que a seção de CTA está visível e navega para o configurador via CTA principal
    await expect(page.getByTestId('cta-section')).toBeVisible();
    await page.getByRole('link', { name: 'Monte o Seu Agora' }).click();
    await expect(page).toHaveURL(/\/configure/);

    // Passo 1: Verificar o preço inicial de venda (R$ 40.000,00)
    const totalPrice = page.getByTestId('total-price');
    await expect(totalPrice).toBeVisible();
    await expect(totalPrice).toContainText(VALOR_BASE);

    // Passo 2: Selecionar uma cor exterior diferente e garantir que o preço permanece o mesmo
    await page.getByTestId('color-option-midnight-black').click();
    await expect(totalPrice).toContainText(VALOR_BASE);

    // Passo 3: Selecionar rodas "Sport Wheels" e validar acréscimo de R$ 2.000,00 (R$ 42.000,00)
    await page.getByTestId('wheel-option-sport').click();
    await expect(totalPrice).toContainText(VALOR_SPORT);

    // Passo 4: Voltar para "Aero Wheels" e garantir que o preço retorna ao valor base
    await page.getByTestId('wheel-option-aero').click();
    await expect(totalPrice).toContainText(VALOR_BASE);
  });
});

