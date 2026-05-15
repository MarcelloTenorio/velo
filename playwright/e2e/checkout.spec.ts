import { test, expect } from '../support/fixtures'
import { deleteOrderByDocument } from '../support/database/orderRepository'

test.describe('Checkout', () => {

    test.describe('Validações de campos obrigatórios', () => {
        let alerts: any

        test.beforeEach(async ({ app, page }) => {
            await page.goto('/order')
            await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
            alerts = app.checkout.elements.alerts
        })

        test('deve validar obrigatoriedade de todos os campos em branco', async ({ app }) => {
            // Act
            await app.checkout.submit()

            // Assert
            await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
            await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
            await expect(alerts.email).toHaveText('Email inválido')
            await expect(alerts.phone).toHaveText('Telefone inválido')
            await expect(alerts.document).toHaveText('CPF inválido')
            await expect(alerts.store).toHaveText('Selecione uma loja')
            await expect(alerts.terms).toHaveText('Aceite os termos')
        })

        test('deve validar limite mínimo de caracteres para Nome e Sobrenome', async ({ app }) => {

            const customer = {
                name: 'A',
                lastname: 'B',
                email: 'marcello@email.com',
                document: '529.982.247-25',
                phone: '(11) 99999-9999'
            }

            // Arrange
            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore('Velô Paulista')
            await app.checkout.acceptTerms()

            // Act
            await app.checkout.submit()

            // Assert
            await expect(alerts.name).toHaveText('Nome deve ter pelo menos 2 caracteres')
            await expect(alerts.lastname).toHaveText('Sobrenome deve ter pelo menos 2 caracteres')
        })

        test('deve exibir erro para e-mail com formato inválido', async ({ app }) => {

            const customer = {
                name: 'João',
                lastname: 'Silva',
                email: 'joao.silva@email',
                document: '529.982.247-25',
                phone: '(11) 99999-9999'
            }

            // Arrange
            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore('Velô Paulista')
            await app.checkout.acceptTerms()

            // Act
            await app.checkout.submit()

            // Assert
            await expect(alerts.email).toHaveText('Email inválido')
        })

        test('deve exibir erro para CPF inválido', async ({ app }) => {

            const customer = {
                name: 'João',
                lastname: 'Silva',
                email: 'joao.silva@email.com',
                document: '123',
                phone: '(11) 99999-9999'
            }

            // Arrange
            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore('Velô Paulista')
            await app.checkout.acceptTerms()

            // Act - 👇O teste de verificação de CPF estava falhando por faltar essa linha👇
            await app.checkout.submit()

            // Assert
            await expect(alerts.document).toHaveText('CPF inválido')
        })

        test('deve exigir o aceite dos termos ao finalizar com dados válidos', async ({ app }) => {

            const customer = {
                name: 'João',
                lastname: 'Silva',
                email: 'joao.silva@email.com',
                document: '529.982.247-25',
                phone: '(11) 99999-9999'
            }

            // Arrange
            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore('Velô Paulista')

            await expect(app.checkout.elements.terms).not.toBeChecked() // Premissa inicial

            // Act
            await app.checkout.submit()

            // Assert
            await expect(alerts.terms).toHaveText('Aceite os termos')
        })
    })


    test.describe('Pagamento e Confirmação', () => {

        test('deve criar um pedido com sucesso para pagamento à vista', async ({ app, page }) => {
            const customer = {
                name: 'João',
                lastname: 'Silva',
                email: 'joaosilva@email.com',
                document: '529.982.247-25',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'À vista',
                totalPrice: 'R$ 40.000,00'
            }

            await deleteOrderByDocument(customer.document)

            // Arrange
            await page.goto('/')
            await page.getByRole('link', { name: /Configure Agora/i }).click()

            await app.configurator.expectPrice("R$ 40.000,00")
            await app.configurator.finishConfigurator()
            await app.checkout.expectLoaded()

            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore(customer.store)

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod)
            await app.checkout.expectSummaryTotal(customer.totalPrice)
            await app.checkout.acceptTerms()
            await app.checkout.submit()

            // Assert
            await expect(page).toHaveURL(/\/success/)
            await expect(page.getByRole('heading', { name: 'Pedido Aprovado' })).toBeVisible()
        })
    })

    test('deve aprovar automaticamente o crédito quando o score do CPF for maior que 700 no financiamento.', async ({ app, page }) => {
        const customer = {
            name: 'Steve',
            lastname: 'Woz',
            email: 'teste2@email.com',
            document: '79699032073',
            phone: '(11) 99999-9999',
            store: 'Velô Paulista',
            paymentMethod: 'Financiamento',
            totalPrice: 'R$ 40.000,00'
        }

        await deleteOrderByDocument(customer.document)

        // Mockando a API de crédito com score maior que 700 (criando uma rota)
        await page.route('**/functions/v1/credit-analysis', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: 'Done',
                    score: 710,
                }),
            });
        });

        // Arrange
        await page.goto('/')
        await page.getByRole('link', { name: /Configure Agora/i }).click()

        await app.configurator.expectPrice(customer.totalPrice)
        await app.configurator.finishConfigurator()
        await app.checkout.expectLoaded()

        await app.checkout.fillCustomerData(customer)
        await app.checkout.selectStore(customer.store)

        // 1. Seleciona Financiamento
        await app.checkout.selectPaymentMethod(customer.paymentMethod)
        //await app.checkout.expectSummaryTotal(customer.totalPrice)
        await app.checkout.acceptTerms()
        await app.checkout.submit()

        await expect(page).toHaveURL(/\/success/)
        await expect(page.getByRole('heading', { name: 'Pedido Aprovado' })).toBeVisible()
    })

    test('deve encaminhar para análise de crédito quando o score do CPF for entre 501 e 700 no financiamento.', async ({ app, page }) => {
        const customer = {
            name: 'Steve',
            lastname: 'Woz',
            email: 'teste2@email.com',
            document: '79699032073',
            phone: '(11) 99999-9999',
            store: 'Velô Paulista',
            paymentMethod: 'Financiamento',
            totalPrice: 'R$ 40.000,00'
        }

        await deleteOrderByDocument(customer.document)

        // Mockando a API de crédito com score entre 501 e 700 (criando uma rota)
        await page.route('**/functions/v1/credit-analysis', route => {
            route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    status: 'Done',
                    score: 600,
                }),
            });
        });

        // Arrange
        await page.goto('/')
        await page.getByRole('link', { name: /Configure Agora/i }).click()

        await app.configurator.expectPrice(customer.totalPrice)
        await app.configurator.finishConfigurator()
        await app.checkout.expectLoaded()

        await app.checkout.fillCustomerData(customer)
        await app.checkout.selectStore(customer.store)

        // 1. Seleciona Financiamento
        await app.checkout.selectPaymentMethod(customer.paymentMethod)
        //await app.checkout.expectSummaryTotal(customer.totalPrice)
        await app.checkout.acceptTerms()
        await app.checkout.submit()

        await expect(page).toHaveURL(/\/success/)
        await expect(page.getByRole('heading', { name: 'Pedido em Análise' })).toBeVisible()
    })

})