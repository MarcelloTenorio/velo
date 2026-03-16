import { test, expect } from '@playwright/test'

test('CT01 - Acessar a Landing Page com sucesso', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' })

  await expect(page.getByTestId('hero-section')).toBeVisible()
  await expect(
    page.getByTestId('hero-section').getByRole('heading', { name: 'Velô Sprint' })
  ).toBeVisible()

  await page.getByTestId('hero-cta-primary').click()
  await expect(page).toHaveURL(/\/configure$/)
})

