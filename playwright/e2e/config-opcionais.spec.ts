import { test, expect } from '../support/fixtures';

test.describe('CT03 - Opcionais e Cálculo de Preço', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open();
  });

  test('deve atualizar o preço ao adicionar/remover opcionais e refletir no checkout', async ({
    app,
  }) => {
    // Valores conforme regra de negócio do sistema
    const valorBase = '40.000,00';
    const valorPrecision = '45.500,00';
    const valorPrecision_Flux = '50.500,00';

    const precisionPark = 'Precision Park';
    const fluxCapacitor = 'Flux Capacitor';

    // Verificações iniciais
    await app.configurator.expectOptionalToBeVisible(precisionPark);
    await app.configurator.expectOptionalToBeVisible(fluxCapacitor);
    await app.configurator.expectOptionalNotToBeChecked(precisionPark);
    await app.configurator.expectOptionalNotToBeChecked(fluxCapacitor);
    await app.configurator.expectTotalPriceToBe(valorBase); //reutilizou a verificação que já tinha anteriormente no arquivo 'configuratorActions.ts'

    // Passo 1: Precision Park
    await app.configurator.toggleOptional(precisionPark);
    await app.configurator.expectTotalPriceToBe(valorPrecision); //reutilizou a verificação que já tinha anteriormente no arquivo 'configuratorActions.ts'

    // Passo 2: Precision Park + Flux Capacitor
    await app.configurator.toggleOptional(fluxCapacitor);
    await app.configurator.expectTotalPriceToBe(valorPrecision_Flux); //reutilizou a verificação que já tinha anteriormente no arquivo 'configuratorActions.ts'

    // Passo 3: desmarcar os opcionais
    await app.configurator.toggleOptional(precisionPark); // remove Precision Park (Flux ainda permanece)
    await app.configurator.toggleOptional(fluxCapacitor); // remove Flux Capacitor
    await app.configurator.expectTotalPriceToBe(valorBase); //reutilizou a verificação que já tinha anteriormente no arquivo 'configuratorActions.ts'

    // Passo 4: navegar para checkout
    await app.configurator.goToCheckout();
    await app.configurator.expectCheckoutUrl();
    await app.configurator.expectSummaryTotalPriceToBe(valorBase);
  });
});

