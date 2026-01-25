  //Teste automatizado de consulta de pedidos, usando o "codegen" do playwright
import { test, expect } from '@playwright/test'

/// AAA - Arrange, Act, Assert
/// PAV - Preparar, Agir, Validar

test('consulta de pedidos', async ({ page }) => {
  //Arrange
  //Checkpoint: Verificar se a webapp está online
  await page.goto('http://localhost:5173/')
  
  //Checkpoint: Verificar o titulo da página
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  
  //Acessar a página de consulta de pedidos
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  
  //Checkpoint: Verificar o titulo da página de consulta de pedidos
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')

  
  // -----------------------------------------------------------------------------------
  //Act
  // Preencher o campo de busca de pedidos
  await page.getByTestId('search-order-id').fill('VLO-VA9DJ2')
  //Act - Clicar no botão de buscar pedido
  await page.getByTestId('search-order-button').click()


  // -----------------------------------------------------------------------------------
  //Assert
  //Checkpoint: Verificar o resultado da busca de pedidos
  await expect(page.getByTestId('order-result-id')).toBeVisible()
  await expect(page.getByTestId('order-result-id')).toContainText('VLO-VA9DJ2')

  //Checkpoint: Verificar o status do pedido
  await expect(page.getByTestId('order-result-status')).toBeVisible()
  await expect(page.getByTestId('order-result-status')).toContainText('APROVADO')
})