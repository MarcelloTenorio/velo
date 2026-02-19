import { Page, expect } from '@playwright/test'

/**
 * Page Object da página inicial (landing).
 */
export class LandingPage {
    constructor(private page: Page) { }

    async goto() {
        await this.page.goto('/')
        const title = this.page.getByTestId('hero-section').getByRole('heading')
        await expect(title).toContainText('Velô Sprint')
    }
}
