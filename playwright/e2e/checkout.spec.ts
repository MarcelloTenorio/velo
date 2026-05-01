import { test, expect } from '../support/fixtures'

test.describe('Checkout', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/order')
        await expect(page.getByRole('heading', { name: 'Finalizar Pedido' })).toBeVisible()
    })


    test.describe('Validações de campos obrigatórios', () => {
        let alerts: any
        test.beforeEach(async ({ app }) => {
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
})
