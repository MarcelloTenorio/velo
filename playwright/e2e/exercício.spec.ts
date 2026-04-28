import { test, expect } from '@playwright/test';

test.describe('Validando campos', () => {
    test('validando campos', async ({ page }) => {
        // Página inicial
        await page.goto('/')
        await expect(page.locator('//h1[text()="Velô Sprint"]')).toBeVisible()

        await page.getByTestId('hero-cta-primary').click()

        // Página de escolha do carro e opcionais (configuração)
        await expect(page).toHaveURL('/configure')
        await expect(page.locator('//p[text()="Configure seu"]')).toBeVisible()

        await page.getByTestId('color-option-midnight-black').click()
        await page.getByTestId('wheel-option-aero').click()
        await page.getByTestId('opt-flux-capacitor').click()

        await page.getByText('Monte o Seu').click()

        // Página de checkout
        await expect(page).toHaveURL('/order')
        await expect(page.locator('//h1[text()="Finalizar Pedido"]')).toBeVisible()

        await page.getByTestId('checkout-name').fill('Marcello');
        await page.getByTestId('checkout-surname').fill('Tenorio')
        await page.getByTestId('checkout-email').fill('marcello@email.com')
        await page.getByTestId('checkout-phone').fill('(00) 00000-0000')
        await page.getByTestId('checkout-cpf').fill('45958120000')
        await page.getByTestId('checkout-store').click()
        await page.getByRole('option', { name: "Velô Morumbi - Av. Morumbi, 1500" }).click()
        await page.getByTestId('checkout-store').click()
        await page.getByRole('option', { name: 'Velô Paulista - Av. Paulista, 1000' }).click()

        await page.getByTestId('payment-avista').click()
        await page.getByTestId('checkout-terms').check()

        await page.getByTestId('checkout-submit').click()

        // Página de resumo do pedido
        await expect(page).toHaveURL('/success')
        await expect(page.getByTestId('success-status')).toBeVisible()
    })
})