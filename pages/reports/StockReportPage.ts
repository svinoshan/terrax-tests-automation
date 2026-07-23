import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class StockReportPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly searchInput: Locator;
  readonly refreshButton: Locator;
  readonly excelButton: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole('heading', { name: /Stock reports/i });

    this.searchInput = page
      .getByRole('searchbox', { name: /Search/i })
      .or(page.getByPlaceholder(/Search/i))
      .first();

    this.refreshButton = page.getByRole('button', { name: /Refresh/i }).first();

    this.excelButton = page.getByRole('button', { name: /Excel/i }).first();
  }

  async open(): Promise<void> {
    await this.appShell.openStockReport();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    //await expect(this.excelButton).toBeVisible({ timeout: 10000 });
    await expect(this.searchInput).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByRole('columnheader', { name: /Crop name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Balance/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Unit price/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Total price/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Expand/i }),
    ).toBeVisible();
  }

  async expectAtLeastOneStockRow(): Promise<void> {
    await expect(
      this.page
        .getByRole('row')
        .filter({ hasText: /Kg|0\.00|\d/i })
        .first(),
    ).toBeVisible({ timeout: 30000 });
  }

  async expandFirstStockRow(): Promise<void> {
    const expandButton = this.page
      .locator('tbody tr button, tbody tr .me-2, tbody tr a')
      .first();

    await expect(expandButton).toBeVisible({ timeout: 10000 });
    await expandButton.click();

    await expect(
      this.page.getByRole('columnheader', { name: /Date/i }).first(),
    ).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByRole('columnheader', { name: /Farmer name/i }).first(),
    ).toBeVisible({ timeout: 10000 });
  }

  async search(value: string): Promise<void> {
    await this.searchInput.fill('');
    await this.searchInput.fill(value);
    await this.page.waitForTimeout(500);
  }

  async refresh(): Promise<void> {
    await expect(this.refreshButton).toBeVisible({ timeout: 10000 });
    await this.refreshButton.click();
  }
}
