import { Page } from '@playwright/test'

/**
 * Component Object da Navbar (Header).
 * A Navbar é um componente reutilizável presente em várias páginas.
 */
export class Navbar {
    constructor(private page: Page) { }

    async orderLookupLink() {
        await this.page.getByRole('link', { name: 'Consultar Pedido' }).click()
    }
}
