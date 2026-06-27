import { expect, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class DashboardPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByText(/Dashboard/i).first()).toBeVisible();
  }

  async expectStatCardsVisible(): Promise<void> {
    await expect(this.page.getByText(/Total no of farmers/i).first()).toBeVisible();
    await expect(this.page.getByText(/Total plots/i).first()).toBeVisible();
  }
}
