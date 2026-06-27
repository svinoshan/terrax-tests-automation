import { expect, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class FarmerListPage extends BasePage {
  private readonly appShell: AppShell;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);
  }

  async open(): Promise<void> {
    await this.appShell.openFarmerProfile();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByText(/Farmer code/i).first()).toBeVisible({ timeout: 30000 });
    await expect(this.page.getByText(/Name/i).first()).toBeVisible();
  }

  async clickAddFarmer(): Promise<void> {
    await this.page.getByRole('button', { name: /add farmer/i })
      .or(this.page.getByText(/\+ Add farmer|Add farmer/i))
      .click();
  }
}
