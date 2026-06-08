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
            await app.checkout.navigateToConfigurator()

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
            await app.checkout.expectOrderApproved()
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
            await app.checkout.mockCreditAnalysis(710)

            // Arrange
            await app.checkout.navigateToConfigurator()

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

            await app.checkout.expectOrderApproved()
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
            await app.checkout.mockCreditAnalysis(600)

            // Arrange
            await app.checkout.navigateToConfigurator()

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

            await app.checkout.expectOrderUnderAnalysis()
        })

        test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento sem entrada', async ({ page, app }) => {

            const customer = {
                name: 'Clark',
                lastname: 'Kent',
                email: 'clark@email.com',
                document: '52998224725',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'Financiamento',
                totalPrice: 'R$ 40.000,00'
            }

            await deleteOrderByDocument(customer.document)

            await app.checkout.mockCreditAnalysis(500)

            // Arrange
            await app.checkout.navigateToConfigurator()

            await app.configurator.expectPrice(customer.totalPrice)
            await app.configurator.finishConfigurator()
            await app.checkout.expectLoaded()

            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore(customer.store)

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod)
            await app.checkout.acceptTerms()
            await app.checkout.submit()

            // Assert
            await app.checkout.expectOrderRejected()
        })

        test('deve reprovar o crédito quando o score do CPF for menor ou igual a 500 no financiamento com entrada menor que 50%', async ({ page, app }) => {

            const customer = {
                name: 'Diana',
                lastname: 'Prince',
                email: 'diana@themiscira.com',
                document: '11144477735',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'Financiamento',
                totalPrice: 'R$ 40.000,00',
                downPayment: '10000'
            }

            await deleteOrderByDocument(customer.document)

            await app.checkout.mockCreditAnalysis(500)

            // Arrange
            await app.checkout.navigateToConfigurator()

            await app.configurator.expectPrice(customer.totalPrice)
            await app.configurator.finishConfigurator()
            await app.checkout.expectLoaded()

            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore(customer.store)

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod)
            await app.checkout.fillDownPayment(customer.downPayment)
            await app.checkout.acceptTerms()
            await app.checkout.submit()

            // Assert
            await app.checkout.expectOrderRejected()
        })
        test('deve aprovar o crédito quando o score do CPF for menor que 500 no financiamento com entrada igual a 50%', async ({ page, app }) => {

            const customer = {
                name: 'Peter',
                lastname: 'Parker',
                email: 'peter@email.com',
                document: '38552222078',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'Financiamento',
                totalPrice: 'R$ 40.000,00',
                downPayment: '20000'
            }

            await deleteOrderByDocument(customer.document)

            await app.checkout.mockCreditAnalysis(450)

            // Arrange
            await app.checkout.navigateToConfigurator()

            await app.configurator.expectPrice(customer.totalPrice)
            await app.configurator.finishConfigurator()
            await app.checkout.expectLoaded()

            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore(customer.store)

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod)
            await app.checkout.fillDownPayment(customer.downPayment)
            await app.checkout.acceptTerms()
            await app.checkout.submit()

            // Assert
            await app.checkout.expectOrderApproved()
        })
        test('deve aprovar o crédito quando o score do CPF for menor que 500 no financiamento com entrada maior que 50%', async ({ page, app }) => {

            const customer = {
                name: 'Steve',
                lastname: 'Wozniak',
                email: 'steve@email.com',
                document: '57333172058',
                phone: '(11) 99999-9999',
                store: 'Velô Paulista',
                paymentMethod: 'Financiamento',
                totalPrice: 'R$ 40.000,00',
                downPayment: '30000'
            }

            await deleteOrderByDocument(customer.document)

            await app.checkout.mockCreditAnalysis(450)

            // Arrange
            await app.checkout.navigateToConfigurator()

            await app.configurator.expectPrice(customer.totalPrice)
            await app.configurator.finishConfigurator()
            await app.checkout.expectLoaded()

            await app.checkout.fillCustomerData(customer)
            await app.checkout.selectStore(customer.store)

            // Act
            await app.checkout.selectPaymentMethod(customer.paymentMethod)
            await app.checkout.fillDownPayment(customer.downPayment)
            await app.checkout.acceptTerms()
            await app.checkout.submit()

            // Assert
            await app.checkout.expectOrderApproved()
        })
    })
})