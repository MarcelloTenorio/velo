import { test, expect } from '../support/fixtures';

test.describe('Configuração do Veículo', () => {
  test.beforeEach(async ({ app }) => {
    await app.configurator.open();
  });


  
  test('deve atualizar a imagem e manter o preço base ao alterar a cor do veículo', async ({ app }) => {
    // Arrange
    const VALOR_BASE = '40.000,00';
  
    // Act
    await app.configurator.expectTotalPriceToBe(VALOR_BASE);
    await app.configurator.selectColor('Midnight Black');

    // Assert
    await app.configurator.expectTotalPriceToBe(VALOR_BASE);
    await app.configurator.expectCarImageSrcToBe('/src/assets/midnight-black-aero-wheels.png');
  });



  test('deve atualizar o preço e a imagem ao alterar as rodas, e restaurar os valores padrão', async ({ app }) => {
    // Arrange
    const VALOR_BASE = '40.000,00';
    const VALOR_SPORT = '42.000,00';
    
    // Act
    await app.configurator.expectTotalPriceToBe(VALOR_BASE);
    await app.configurator.selectWheels(/Sport Wheels/);

    // Assert
    await app.configurator.expectTotalPriceToBe(VALOR_SPORT);
    await app.configurator.expectCarImageSrcToBe('/src/assets/glacier-blue-sport-wheels.png');

    // Act
    await app.configurator.selectWheels(/Aero Wheels/);

    // Assert
    await app.configurator.expectTotalPriceToBe(VALOR_BASE);
    await app.configurator.expectCarImageSrcToBe('/src/assets/glacier-blue-aero-wheels.png');
  });
});

