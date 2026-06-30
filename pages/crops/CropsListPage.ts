import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class CropsListPage extends BasePage {
  private readonly appShell: AppShell;
  readonly addNewButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);

    this.addNewButton = this.page
      .locator('a.btn-added, button.btn-added')
      .filter({ hasText: /add new/i })
      .first();

    this.searchInput = this.page
      .getByRole('searchbox')
      .or(
        this.page
          .locator('input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]')
          .first()
      );
  }

  async open(): Promise<void> {
    await this.appShell.openCropsInfo();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/home\/crops-info\/all/i, { timeout: 30000 });
    await expect(this.addNewButton).toBeVisible({ timeout: 30000 });
    await expect(this.page.getByRole('columnheader', { name: /Crop name/i }).first()).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /HS Code/i }).first()).toBeVisible();
  }

  async clickAddNew(): Promise<void> {
    await this.addNewButton.click();
  }

  async search(value: string): Promise<void> {
    await this.expectLoaded();
    await this.searchInput.fill(value);
  }

  async expectCropVisible(cropName: string): Promise<void> {
    await expect(this.page.getByText(cropName).first()).toBeVisible({ timeout: 30000 });
  }
}
