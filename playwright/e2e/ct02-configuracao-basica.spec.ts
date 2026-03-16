import path from 'path'
import fs from 'fs'
import { test, expect } from '@playwright/test'

const VALOR_BASE = '40.000,00'
const EVIDENCIAS_DIR = 'playwright/evidencias/CT02'

test('CT02 - Configuração Básica do Veículo (Fluxo Feliz)', async ({ page }) => {
  fs.mkdirSync(EVIDENCIAS_DIR, { recursive: true })

  await page.goto('/configure', { waitUntil: 'domcontentloaded' })

  const totalPrice = page.getByTestId('total-price')
  await expect(totalPrice).toBeVisible()
  await expect(totalPrice).toContainText(VALOR_BASE)

  await page.screenshot({
    path: path.join(EVIDENCIAS_DIR, 'ct02-passo1-configurador-valor-base.png'),
    type: 'png',
  })

  await page.getByTestId('checkout-button').click()
  await expect(page).toHaveURL(/\/order/)

  const summaryTotal = page.getByTestId('summary-total-price')
  await expect(summaryTotal).toBeVisible()
  await expect(summaryTotal).toContainText(VALOR_BASE)

  await page.screenshot({
    path: path.join(EVIDENCIAS_DIR, 'ct02-passo2-checkout-resumo.png'),
    type: 'png',
  })
})
