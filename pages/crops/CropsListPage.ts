import { expect, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class CropsListPage extends BasePage {
  private readonly appShell: AppShell;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);
  }

  async open(): Promise<void> {
    await this.appShell.openCropsInfo();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByText(/Crop name/i).first()).toBeVisible({ timeout: 30000 });
    await expect(this.page.getByText(/HS Code/i).first()).toBeVisible();
  }

  async clickAddNew(): Promise<void> {
    await this.page
      .locator('a.btn-added, button.btn-added')
      .filter({ hasText: /add new/i })
      .first()
      .click();
  }

  async search(value: string): Promise<void> {
    await this.page.getByPlaceholder(/search/i).fill(value);
  }

  async expectCropVisible(cropName: string): Promise<void> {
    await expect(this.page.getByText(cropName).first()).toBeVisible({ timeout: 30000 });
  }
}
