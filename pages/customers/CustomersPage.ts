import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class CustomersPage extends BasePage {
  private readonly appShell: AppShell;
  readonly addNewButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);

    this.addNewButton = this.page
      .getByRole('button', { name: /\+?\s*add new/i })
      .or(this.page.getByText(/\+?\s*Add new/i))
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
    await this.appShell.openCustomers();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/home\/customers\/all/i, { timeout: 30000 });
    await expect(this.page.getByRole('heading', { name: /Customers/i })).toBeVisible({
      timeout: 30000,
    });
    await expect(this.addNewButton).toBeVisible({ timeout: 30000 });
  }

  async clickAddNew(): Promise<void> {
    await this.addNewButton.click();
  }

  async search(value: string): Promise<void> {
    await this.expectLoaded();
    await this.searchInput.fill('');
    await this.searchInput.fill(value);
  }

  async expectCustomerVisible(customerName: string): Promise<void> {
    await expect(this.page.getByText(customerName).first()).toBeVisible({ timeout: 30000 });
  }

  async getCustomerRow(customerName: string): Promise<Locator> {
    const row = this.page.getByRole('row').filter({ hasText: customerName }).first();
    await expect(row).toBeVisible({ timeout: 30000 });
    return row;
  }

  async expectCustomerRowContains(customerName: string, expectedText: string | RegExp): Promise<void> {
    const row = await this.getCustomerRow(customerName);
    await expect(row).toContainText(expectedText);
  }
}
