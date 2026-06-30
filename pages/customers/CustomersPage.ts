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
    await expect(this.page.getByText(/Customer name/i).first()).toBeVisible();
    await expect(this.page.getByText(/Customer address/i).first()).toBeVisible();
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

  async expectCustomerNotVisible(customerName: string): Promise<void> {
    await expect(this.page.getByText(customerName).first()).toBeHidden({ timeout: 30000 });
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

  async clickEditForCustomer(customerName: string): Promise<void> {
    const row = await this.getCustomerRow(customerName);

    // Action cell has two links: first = edit, second = delete.
    await row.locator('td').last().locator('a').nth(0).click();
  }

  async clickDeleteForCustomer(customerName: string): Promise<void> {
    const row = await this.getCustomerRow(customerName);

    // Action cell has two links: first = edit, second = delete.
    await row.locator('td').last().locator('a').nth(1).click();
  }

  async confirmDelete(): Promise<void> {
    await this.page.getByRole('button', { name: /Yes, delete it!/i }).click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  }

  async expectSuccessToast(): Promise<void> {
    await expect(this.page.getByText(/Success|success|deleted|Delete/i).first()).toBeVisible({
      timeout: 10000,
    });
  }
}
