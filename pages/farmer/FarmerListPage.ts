import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class FarmerListPage extends BasePage {
  private readonly appShell: AppShell;
  readonly pageTitle: Locator;
  readonly addFarmerButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole('heading', { name: /all farmers/i });

    this.addFarmerButton = page
      .locator('a.btn-added, button.btn-added')
      .filter({ hasText: /add farmer/i })
      .first();

    this.searchInput = page
      .getByRole('searchbox')
      .or(page.locator('input[type="search"]').first());
  }

  async open(): Promise<void> {
    await this.appShell.openFarmerProfile();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.addFarmerButton).toBeVisible({ timeout: 30000 });

    await expect(this.page.getByRole('columnheader', { name: /Farmer code/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /Cb ref id/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /^Name$/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /Gender/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /Main unit/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /Sub unit/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /City/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /Field officer/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /Active/i })).toBeVisible();
    await expect(this.page.getByRole('columnheader', { name: /Action/i })).toBeVisible();
  }

  async clickAddFarmer(): Promise<void> {
    await this.addFarmerButton.click();
  }

  async search(value: string): Promise<void> {
    await this.expectLoaded();
    await this.searchInput.fill('');
    await this.searchInput.fill(value);
  }

  async getFarmerRow(farmerCodeOrName: string): Promise<Locator> {
    const row = this.page.getByRole('row').filter({ hasText: farmerCodeOrName }).first();
    await expect(row).toBeVisible({ timeout: 30000 });
    return row;
  }

  async expectFarmerVisible(farmerCodeOrName: string): Promise<void> {
    await expect(this.page.getByText(farmerCodeOrName).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async clickEditForFarmer(farmerCodeOrName: string): Promise<void> {
    const row = await this.getFarmerRow(farmerCodeOrName);
    await row.locator('td').last().locator('a').first().click();
  }
}
