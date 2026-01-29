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
  await page.locator('//label[text()="Número do Pedido"]/..//input').fill('VLO-VA9DJ2')  //XPath para achar o campo de busca de pedidos usando o label do input e a div pai
  //await page.getByTestId('search-order-id').fill('VLO-VA9DJ2')
  // await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-VA9DJ2')
  // await page.getByLabel('Número do Pedido').fill('VLO-VA9DJ2')
  // await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-VA9DJ2')

  //Act - Clicar no botão de buscar pedido
  //await page.locator('//button[text()="Buscar Pedido"]').click()
  await page.getByRole('button', { name: 'Buscar Pedido' }).click()


  // -----------------------------------------------------------------------------------
  //Assert
  //Checkpoint: Verificar o resultado da busca de pedidos
  
  //await page.waitForTimeout(30000)  <- Nesse exemplo de uso do timeout, a automação vai esperar 30 segundos para o elemento ser visível, ou seja, vai dormir por 30 segundos

      // Resolução Desafio
  //Primeira forma (Com locator e Xpath)
  //await expect(page.locator('//p[text()="VLO-VA9DJ2"]/..//p')).toBeVisible({timeout: 30_000})
  //await expect(page.locator('//p[text()="VLO-VA9DJ2"]/..//p')).toContainText('VLO-VA9DJ2')
  //Segunda forma (Com GetByText e 'nome no elemento')
  await expect(page.getByText('VLO-VA9DJ2')).toBeVisible({timeout: 30_000})  //<- Aqui o timeout vai tentar buscar até 30 segundos.
  await expect(page.getByText('VLO-VA9DJ2')).toContainText('VLO-VA9DJ2')


  //Checkpoint: Verificar o status do pedido
  //Primeira forma (Com locator e Xpath)
  //await expect(page.locator('//div[text()="APROVADO"]')).toBeVisible()
  //await expect(page.locator('//div[text()="APROVADO"]')).toContainText('APROVADO')
  //Segunda forma (Com GetByText e 'nome no elemento')
  await expect(page.getByText('APROVADO')).toBeVisible()
  await expect(page.getByText('APROVADO')).toContainText('APROVADO')
})