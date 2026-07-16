import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class MassBalanceReportPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly yearInput: Locator;
  readonly farmerInput: Locator;
  readonly itemInput: Locator;
  readonly searchButton: Locator;
  readonly clearFiltersButton: Locator;
  readonly tableSearchInput: Locator;
  readonly excelButton: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole('heading', { name: /Mass balance/i });

    this.yearInput = page.getByRole('combobox').nth(0);
    this.farmerInput = page.getByRole('combobox').nth(1);
    this.itemInput = page.getByRole('combobox').nth(2);

    this.searchButton = page.getByRole('button', { name: /Search/i }).first();

    this.clearFiltersButton = page
      .getByRole('button', { name: /Clear filters/i })
      .first();

    this.tableSearchInput = page
      .getByRole('searchbox', { name: /Search/i })
      .or(page.getByPlaceholder(/Search/i))
      .first();

    this.excelButton = page.getByRole('button', { name: /Excel/i }).first();
  }

  async open(): Promise<void> {
    await this.appShell.openMassBalanceReport();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.yearInput).toBeVisible({ timeout: 10000 });
    await expect(this.farmerInput).toBeVisible({ timeout: 10000 });
    await expect(this.itemInput).toBeVisible({ timeout: 10000 });
    await expect(this.searchButton).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByRole('columnheader', { name: /Farmer name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Farmer code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Plot code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Crop name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Expected qty/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Purchase qty/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Balance qty/i }),
    ).toBeVisible();
  }

  async selectOptionWithFallback(
    combobox: Locator,
    preferredText?: string,
  ): Promise<string> {
    await combobox.click();

    const options = this.page.getByRole('option');

    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    if (optionTexts.length === 0) {
      throw new Error('No options found in Mass balance dropdown.');
    }

    let selectedText = optionTexts[0];

    if (preferredText) {
      const matchingText = optionTexts.find((text) =>
        text.toLowerCase().includes(preferredText.toLowerCase()),
      );

      if (matchingText) {
        selectedText = matchingText;
      }
    }

    await this.page
      .getByRole('option')
      .filter({ hasText: selectedText })
      .first()
      .click();

    return selectedText;
  }

  async applyFilters(options?: {
    year?: string;
    farmer?: string;
    item?: string;
  }): Promise<void> {
    await this.selectOptionWithFallback(
      this.yearInput,
      options?.year ?? process.env.REPORT_MASS_BALANCE_YEAR ?? '2025',
    );

    await this.selectOptionWithFallback(
      this.farmerInput,
      options?.farmer ?? process.env.REPORT_MASS_BALANCE_FARMER ?? 'Kamal Perera',
    );

    await this.selectOptionWithFallback(
      this.itemInput,
      options?.item ?? process.env.REPORT_MASS_BALANCE_ITEM ?? 'Pepper Green',
    );

    await expect(this.searchButton).toBeVisible({ timeout: 10000 });
    await this.searchButton.click();
  }

  async expectAtLeastOneResultOrEmptyState(): Promise<void> {
    await expect(
      this.page
        .getByRole('row')
        .filter({ hasText: /Kg|No matching records found|\d/i })
        .first(),
    ).toBeVisible({ timeout: 30000 });
  }

  async clearFilters(): Promise<void> {
    await expect(this.clearFiltersButton).toBeVisible({ timeout: 10000 });
    await this.clearFiltersButton.click();
  }
}
