  //Teste automatizado de consulta de pedidos, usando o "codegen" do playwright
import { test, expect } from '@playwright/test'

test('consulta de pedidos', async ({ page }) => {
  await page.goto('http://localhost:5173/')

  //Checkpoint: Verificar o titulo da página
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  
  //Acessar a página de consulta de pedidos
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  
  //Checkpoint: Verificar o titulo da página de consulta de pedidos
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  //Preenchimento do campo de busca de pedidos
  await page.getByTestId('search-order-id').fill('VLO-VA9DJ2')
  await page.getByTestId('search-order-button').click()

  //Checkpoint: Verificar o resultado da busca de pedidos
  await expect(page.getByTestId('order-result-id')).toBeVisible()
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-VA9DJ2')

  //Checkpoint: Verificar o status do pedido
  await expect(page.getByTestId('order-result-status')).toBeVisible()
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')
})