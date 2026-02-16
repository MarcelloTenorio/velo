  //Teste automatizado de consulta de pedidos, usando o "codegen" do playwright
import { test, expect } from '@playwright/test'
import { generateOrderCode } from '../support/helper'
import { OrderLookupPage } from '../support/pages/OrderLookupPages'

/// AAA - Arrange, Act, Assert
/// PAV - Preparar, Agir, Validar

test.describe('Consulta de pedidos', () => {

  // test.beforeAll(async () =>{
  //   console.log(
  //     'beforeAll: roda uma vez antes de todos os testes.'
  //   )
  // })

  test.beforeEach(async ({page}) => {
  //Arrange
  //Checkpoint: Verificar se a webapp está online
  await page.goto('http://localhost:5173/')
  
  //Checkpoint: Verificar o titulo da página
  await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')
  
  //Acessar a página de consulta de pedidos
  await page.getByRole('link', { name: 'Consultar Pedido' }).click()
  
  //Checkpoint: Verificar o titulo da página de consulta de pedidos
  await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  // test.afterEach(async () => {
  //   console.log(
  //     'afterEach: roda depois de cada teste.'
  //   )
  // })

  // test.afterAll(async () => {
  //   console.log(
  //     'afterAll: roda depois de todos os testes.'
  //   )
  // })

  test('consulta de pedido aprovado', async ({ page }) => {
    //Test Data
    //const order = 'VLO-VA9DJ2'
    const order = {
      number: 'VLO-VA9DJ2',
      status: 'APROVADO' as const,
      color: 'Midnight Black',
      wheels: 'aero Wheels',
      customer: {
        name: 'Marcello Tenorio',
        email: 'teste@email.com'
      },
      payment: 'À Vista'
    }
    
    // -----------------------------------------------------------------------------------
    //Act
    // Preencher o campo de busca de pedidos
      //await page.locator('//label[text()="Número do Pedido"]/..//input').fill(order.number)  //XPath para achar o campo de busca de pedidos usando o label do input e a div pai
    //await page.getByTestId('search-order-id').fill('VLO-VA9DJ2')
    // await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-VA9DJ2')
    // await page.getByLabel('Número do Pedido').fill('VLO-VA9DJ2')
    // await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-VA9DJ2')

    //Act - Clicar no botão de buscar pedido
    //await page.locator('//button[text()="Buscar Pedido"]').click()
      //await page.getByRole('button', { name: 'Buscar Pedido' }).click()

    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(order.number)


  // -----------------------------------------------------------------------------------
  //Assert
  //Checkpoint: Verificar o resultado da busca de pedidos
  
  //await page.waitForTimeout(30000)  <- Nesse exemplo de uso do timeout, a automação vai esperar 30 segundos para o elemento ser visível, ou seja, vai dormir por 30 segundos

      // Resolução Desafio
  //Primeira forma (Com locator e Xpath)
 /*  const orderCode = page.locator('//p[text()="Pedido"]/..//p[text()="VLO-VA9DJ2"]')  // Usando uma constante 'const' para armazenar o locator do elemento
  await expect(orderCode).toBeVisible({timeout: 60_000})
  await expect(orderCode).toContainText(order.number) */
  

  //Segunda forma (Com GetByRole para buscar o parágrafo com o texto 'Pedido' e subir para o elemento pai, para buscar o texto 'VLO-VA9DJ2' na div pai)
  // const containerPedido = page.getByRole('paragraph')  // Usando uma constante 'const' para armazenar o locator do elemento
  //   .filter({ hasText: /^Pedido$/ })  // Usando uma expressão regular para buscar o texto 'Pedido' exatamente como está escrito (^ começa com, $ termina com)
  //   .locator('..')  //Sobe para o elemento pai do texto 'Pedido' (a div que agrupa ambos os elementos)
  // await expect(containerPedido).toContainText(order, { timeout: 10_000 })
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    /* const statusBadge = page.getByRole('status').filter({hasText: order.status})

    await expect(statusBadge).toHaveClass(/bg-green-100/)
    await expect(statusBadge).toHaveClass(/text-green-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide-circle-check-big/) */

    // Validação do badge de status encapsulada no Page Object
    await orderLookupPage.validateStatusBadge(order.status)

  //await expect(page.getByText('VLO-VA9DJ2')).toBeVisible({timeout: 30_000})  //<- Aqui o timeout vai tentar buscar até 30 segundos.
  //await expect(page.getByText('VLO-VA9DJ2')).toContainText('VLO-VA9DJ2')


  //Checkpoint: Verificar o status do pedido
  
  //Primeira forma (Com locator e Xpath)
  //await expect(page.locator('//div[text()="APROVADO"]')).toBeVisible()
  //await expect(page.locator('//div[text()="APROVADO"]')).toContainText('APROVADO')
  
  //Segunda forma (Com GetByText e 'nome no elemento')
  await expect(page.getByText('APROVADO')).toBeVisible()
  await expect(page.getByText('APROVADO')).toContainText('APROVADO')
  })

  test('consulta de pedido reprovado', async ({ page }) => {
    //Test Data
    //const order = 'VLO-LH34RF'
    const order = {
      number: 'VLO-LH34RF',
      status: 'REPROVADO' as const,
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Steve Jobs',
        email: 'jobs@apple.com',
      },
      payment: 'À Vista'
    }
      
    // -----------------------------------------------------------------------------------
    //Act
    // Preencher o campo de busca de pedidos
      //await page.locator('//label[text()="Número do Pedido"]/..//input').fill(order.number)  //XPath para achar o campo de busca de pedidos usando o label do input e a div pai
    //await page.getByTestId('search-order-id').fill('VLO-VA9DJ2')
    // await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-VA9DJ2')
    // await page.getByLabel('Número do Pedido').fill('VLO-VA9DJ2')
    // await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-VA9DJ2')

    //Act - Clicar no botão de buscar pedido
    //await page.locator('//button[text()="Buscar Pedido"]').click()
      //await page.getByRole('button', { name: 'Buscar Pedido' }).click()
    const orderLookupPage = new OrderLookupPage(page)
    await orderLookupPage.searchOrder(order.number)


  // -----------------------------------------------------------------------------------
  //Assert
  //Checkpoint: Verificar o resultado da busca de pedidos
  
  //await page.waitForTimeout(30000)  <- Nesse exemplo de uso do timeout, a automação vai esperar 30 segundos para o elemento ser visível, ou seja, vai dormir por 30 segundos

      // Resolução Desafio
  //Primeira forma (Com locator e Xpath)
  const orderCode = page.locator('//p[text()="Pedido"]/..//p[text()="VLO-LH34RF"]')  // Usando uma constante 'const' para armazenar o locator do elemento
  await expect(orderCode).toBeVisible({timeout: 10_000})
  await expect(orderCode).toContainText(order.number)
  

  //Segunda forma (Com GetByRole para buscar o parágrafo com o texto 'Pedido' e subir para o elemento pai, para buscar o texto 'VLO-VA9DJ2' na div pai)
  // const containerPedido = page.getByRole('paragraph')  // Usando uma constante 'const' para armazenar o locator do elemento
  //   .filter({ hasText: /^Pedido$/ })  // Usando uma expressão regular para buscar o texto 'Pedido' exatamente como está escrito (^ começa com, $ termina com)
  //   .locator('..')  //Sobe para o elemento pai do texto 'Pedido' (a div que agrupa ambos os elementos)
  // await expect(containerPedido).toContainText(order, { timeout: 10_000 })
  

  await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
    - img
    - paragraph: Pedido
    - paragraph: ${order.number}
    - status:
      - img
      - text: ${order.status}
    - img "Velô Sprint"
    - paragraph: Modelo
    - paragraph: Velô Sprint
    - paragraph: Cor
    - paragraph: ${order.color}
    - paragraph: Interior
    - paragraph: cream
    - paragraph: Rodas
    - paragraph: ${order.wheels}
    - heading "Dados do Cliente" [level=4]
    - paragraph: Nome
    - paragraph: ${order.customer.name}
    - paragraph: Email
    - paragraph: ${order.customer.email}
    - paragraph: Loja de Retirada
    - paragraph
    - paragraph: Data do Pedido
    - paragraph: /\\d+\\/\\d+\\/\\d+/
    - heading "Pagamento" [level=4]
    - paragraph: ${order.payment}
    - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
    `);

    /* const statusBadge = page.getByRole('status').filter({hasText: order.status})

    await expect(statusBadge).toHaveClass(/bg-red-100/)
    await expect(statusBadge).toHaveClass(/text-red-700/)

    const statusIcon = statusBadge.locator('svg')
    await expect(statusIcon).toHaveClass(/lucide-circle-x/) */

    // Validação do badge de status encapsulada no Page Object
    await orderLookupPage.validateStatusBadge(order.status)

  //await expect(page.getByText('VLO-VA9DJ2')).toBeVisible({timeout: 30_000})  //<- Aqui o timeout vai tentar buscar até 30 segundos.
  //await expect(page.getByText('VLO-VA9DJ2')).toContainText('VLO-VA9DJ2')


  //Checkpoint: Verificar o status do pedido
  
  //Primeira forma (Com locator e Xpath)
  //await expect(page.locator('//div[text()="APROVADO"]')).toBeVisible()
  //await expect(page.locator('//div[text()="APROVADO"]')).toContainText('APROVADO')
  
  //Segunda forma (Com GetByText e 'nome no elemento')
  await expect(page.getByText('REPROVADO')).toBeVisible()
  await expect(page.getByText('REPROVADO')).toContainText('REPROVADO')
  })

  test('consulta de pedido em_analise', async ({ page }) => {
    //Test Data
    //const order = 'VLO-LH34RF'
    const order = {
      number: 'VLO-IJ3QD2',
      status: 'EM_ANALISE' as const,
      color: 'Glacier Blue',
      wheels: 'aero Wheels',
      customer: {
        name: 'joão Silva',
        email: 'joao@velo.dev',
      },
      payment: 'À Vista'
    }
      
    // -----------------------------------------------------------------------------------
    //Act
    // Preencher o campo de busca de pedidos
      //await page.locator('//label[text()="Número do Pedido"]/..//input').fill(order.number)  //XPath para achar o campo de busca de pedidos usando o label do input e a div pai
    //await page.getByTestId('search-order-id').fill('VLO-VA9DJ2')
    // await page.getByPlaceholder('Ex: VLO-ABC123').fill('VLO-VA9DJ2')
    // await page.getByLabel('Número do Pedido').fill('VLO-VA9DJ2')
    // await page.getByRole('textbox', { name: 'Número do Pedido' }).fill('VLO-VA9DJ2')
  
    //Act - Clicar no botão de buscar pedido
    //await page.locator('//button[text()="Buscar Pedido"]').click()
      //await page.getByRole('button', { name: 'Buscar Pedido' }).click()
      const orderLookupPage = new OrderLookupPage(page)
      await orderLookupPage.searchOrder(order.number)
  
    // -----------------------------------------------------------------------------------
    //Assert
    //Checkpoint: Verificar o resultado da busca de pedidos
    
    //await page.waitForTimeout(30000)  <- Nesse exemplo de uso do timeout, a automação vai esperar 30 segundos para o elemento ser visível, ou seja, vai dormir por 30 segundos
  
        // Resolução Desafio
    //Primeira forma (Com locator e Xpath)
    const orderCode = page.locator('//p[text()="Pedido"]/..//p[text()="VLO-IJ3QD2"]')  // Usando uma constante 'const' para armazenar o locator do elemento
    await expect(orderCode).toBeVisible({timeout: 10_000})
    await expect(orderCode).toContainText(order.number)
    
  
    //Segunda forma (Com GetByRole para buscar o parágrafo com o texto 'Pedido' e subir para o elemento pai, para buscar o texto 'VLO-VA9DJ2' na div pai)
    // const containerPedido = page.getByRole('paragraph')  // Usando uma constante 'const' para armazenar o locator do elemento
    //   .filter({ hasText: /^Pedido$/ })  // Usando uma expressão regular para buscar o texto 'Pedido' exatamente como está escrito (^ começa com, $ termina com)
    //   .locator('..')  //Sobe para o elemento pai do texto 'Pedido' (a div que agrupa ambos os elementos)
    // await expect(containerPedido).toContainText(order, { timeout: 10_000 })
    
  
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: ${order.wheels}
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);
  
    /* const statusBadge = page.getByRole('status').filter({hasText: order.status})

      await expect(statusBadge).toHaveClass(/bg-amber-100/)
      await expect(statusBadge).toHaveClass(/text-amber-700/)

      const statusIcon = statusBadge.locator('svg')
      await expect(statusIcon).toHaveClass(/lucide-clock/)
    */
      // Validação do badge de status encapsulada no Page Object
      await orderLookupPage.validateStatusBadge(order.status)

    //await expect(page.getByText('VLO-VA9DJ2')).toBeVisible({timeout: 30_000})  //<- Aqui o timeout vai tentar buscar até 30 segundos.
    //await expect(page.getByText('VLO-VA9DJ2')).toContainText('VLO-VA9DJ2')
  
  
    //Checkpoint: Verificar o status do pedido
    
    //Primeira forma (Com locator e Xpath)
    //await expect(page.locator('//div[text()="APROVADO"]')).toBeVisible()
    //await expect(page.locator('//div[text()="APROVADO"]')).toContainText('APROVADO')
    
    //Segunda forma (Com GetByText e 'nome no elemento')
    await expect(page.getByText('EM_ANALISE')).toBeVisible()
    await expect(page.getByText('EM_ANALISE')).toContainText('EM_ANALISE')
    })

  //--------------------------------------------------
  // Teste de consulta de pedido não encontrado
  //--------------------------------------------------  -- Nesse teste, vamos verificar se a mensagem de pedido não encontrado é exibida quando o pedido não é encontrado
  test('deve exibir mensagem quando pedido não é encontrado', async ({ page }) => {

    const order = generateOrderCode()

    // -----------------------------------------------------------------------------------
    //Act
    // Preencher o campo de busca de pedidos
        //await page.locator('//label[text()="Número do Pedido"]/..//input').fill(order)  //XPath para achar o campo de busca de pedidos usando o label do input e a div pai

    //Act - Clicar no botão de buscar pedido
        //await page.getByRole('button', { name: 'Buscar Pedido' }).click()

      const orderLookupPage = new OrderLookupPage(page)
      await orderLookupPage.searchOrder(order)
    // -----------------------------------------------------------------------------------
    //Assert
    //Checkpoint: Verificar o resultado da busca de pedidos
    // await expect(page.locator('#root')).toContainText('Pedido não encontrado')
    // await expect(page.locator('#root')).toContainText('Verifique o número do pedido e tente novamente')

    const title = page.getByRole('heading', {name: 'Pedido não encontrado'})
    await expect(title).toBeVisible()

    //const message = page.getByRole('paragraph', {name: 'Verifique o número do pedido e tente novamente'})  // Esse Modelo não funciona para message, apenas title
    // const message = page.locator('//p[text()="Verifique o número do pedido e tente novamente"]')  // <--- XPath para achar o parágrafo com o texto (Funciona)
    // await expect(message).toBeVisible()
    // Ou
    // const message = page.locator('p', {hasText: 'Verifique o número do pedido e tente novamente'})  // <--- Estrutura do Playwright, mais elegante e fácil de entender
    // await expect(message).toBeVisible()

    //Snapshot: Verificar a estrutura da página de consulta de pedidos
    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
    `);
  })

})

/* import { test, expect } from '@playwright/test'

import { generateOrderCode } from '../support/helpers'

import { OrderLockupPage } from '../support/pages/OrderLockupPage'

/// AAA - Arrange, Act, Assert

test.describe('Consulta de Pedido', () => {

  test.beforeEach(async ({ page }) => {
    // Arrange
    await page.goto('http://localhost:5173/')
    await expect(page.getByTestId('hero-section').getByRole('heading')).toContainText('Velô Sprint')

    await page.getByRole('link', { name: 'Consultar Pedido' }).click()
    await expect(page.getByRole('heading')).toContainText('Consultar Pedido')
  })

  test('deve consultar um pedido aprovado', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-6E2J20',
      status: 'APROVADO' as const,
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'Fernando Papito',
        email: 'papito@velo.dev'
      },
      payment: 'À Vista'
    }

    // Act  
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: Aero Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)

  })

  test('deve consultar um pedido reprovado', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-0LNFEA',
      status: 'REPROVADO' as const,
      color: 'Midnight Black',
      wheels: 'sport Wheels',
      customer: {
        name: 'Steve Jobs',
        email: 'jobs@apple.com'
      },
      payment: 'À Vista'
    }

    // Act  
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: Aero Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve consultar um pedido em analise', async ({ page }) => {

    // Test Data
    const order = {
      number: 'VLO-412O06',
      status: 'EM_ANALISE' as const,
      color: 'Lunar White',
      wheels: 'aero Wheels',
      customer: {
        name: 'João da Silva',
        email: 'joao@velo.dev'
      },
      payment: 'À Vista'
    }

    // Act  
    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order.number)

    // Assert
    await expect(page.getByTestId(`order-result-${order.number}`)).toMatchAriaSnapshot(`
      - img
      - paragraph: Pedido
      - paragraph: ${order.number}
      - status:
        - img
        - text: ${order.status}
      - img "Velô Sprint"
      - paragraph: Modelo
      - paragraph: Velô Sprint
      - paragraph: Cor
      - paragraph: ${order.color}
      - paragraph: Interior
      - paragraph: cream
      - paragraph: Rodas
      - paragraph: Aero Wheels
      - heading "Dados do Cliente" [level=4]
      - paragraph: Nome
      - paragraph: ${order.customer.name}
      - paragraph: Email
      - paragraph: ${order.customer.email}
      - paragraph: Loja de Retirada
      - paragraph
      - paragraph: Data do Pedido
      - paragraph: /\\d+\\/\\d+\\/\\d+/
      - heading "Pagamento" [level=4]
      - paragraph: ${order.payment}
      - paragraph: /R\\$ \\d+\\.\\d+,\\d+/
      `);

    // Validação do badge de status encapsulada no Page Object
    await orderLockupPage.validateStatusBadge(order.status)
  })

  test('deve exibir mensagem quando o pedido não é encontrado', async ({ page }) => {

    const order = generateOrderCode()

    const orderLockupPage = new OrderLockupPage(page)
    await orderLockupPage.searchOrder(order)


    await expect(page.locator('#root')).toMatchAriaSnapshot(`
      - img
      - heading "Pedido não encontrado" [level=3]
      - paragraph: Verifique o número do pedido e tente novamente
      `)

  })
}) */