import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class DispatchSummaryReportPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly dateFromInput: Locator;
  readonly dateToInput: Locator;
  readonly dispatchToInput: Locator;
  readonly showSummaryButton: Locator;
  readonly showDetailsButton: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole('heading', { name: /Dispatch summary/i });

    this.dateFromInput = page.locator('input').nth(0);
    this.dateToInput = page.locator('input').nth(1);
    this.dispatchToInput = page.getByRole('combobox').first();

    this.showSummaryButton = page
      .getByRole('button', { name: /Show summary/i })
      .first();

    this.showDetailsButton = page
      .getByRole('button', { name: /Show details/i })
      .first();
  }

  async open(): Promise<void> {
    await this.appShell.openDispatchSummaryReport();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });

    await expect(this.dateFromInput).toBeVisible({ timeout: 10000 });
    await expect(this.dateToInput).toBeVisible({ timeout: 10000 });
    await expect(this.dispatchToInput).toBeVisible({ timeout: 10000 });

    await expect(this.showSummaryButton).toBeVisible({ timeout: 10000 });
    await expect(this.showDetailsButton).toBeVisible({ timeout: 10000 });

    await this.expectSummaryColumnsVisible();
  }

  async expectSummaryColumnsVisible(): Promise<void> {
    await expect(
      this.page.getByRole('columnheader', { name: /Crop name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Dispatch qty/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Total dispatch value/i }),
    ).toBeVisible();
  }

  async expectDetailsColumnsVisible(): Promise<void> {
    await expect(
      this.page.getByRole('columnheader', { name: /^Date$/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Dispatch no/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Dispatch to/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Crop name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Dispatch qty/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Dispatch price/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /^Total$/i }),
    ).toBeVisible();
  }

  private defaultFromDate(): string {
    const currentYear = new Date().getFullYear();
    return `${currentYear - 2}-01-01`;
  }

  private defaultToDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  async fillDateRange(options?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<void> {
    const fromDate =
      options?.fromDate ??
      process.env.REPORT_DISPATCH_SUMMARY_FROM ??
      this.defaultFromDate();

    const toDate =
      options?.toDate ??
      process.env.REPORT_DISPATCH_SUMMARY_TO ??
      this.defaultToDate();

    await this.dateFromInput.fill(fromDate);
    await this.dateToInput.fill(toDate);

    await expect(this.dateFromInput).toHaveValue(fromDate);
    await expect(this.dateToInput).toHaveValue(toDate);
  }

  private async firstVisibleOptionText(): Promise<string | null> {
    const options = this.page.getByRole('option');

    const hasOption = await options
      .first()
      .isVisible({ timeout: 3000 })
      .catch(() => false);

    if (!hasOption) {
      return null;
    }

    const optionCount = await options.count();

    for (let index = 0; index < optionCount; index += 1) {
      const option = options.nth(index);

      if (!(await option.isVisible().catch(() => false))) {
        continue;
      }

      const text = (await option.innerText()).replace(/\s+/g, ' ').trim();

      if (text) {
        return text;
      }
    }

    return null;
  }

  async selectFirstAvailableDispatchTo(): Promise<string> {
    await this.dispatchToInput.click();
    await this.dispatchToInput.fill('');

    let firstOptionText = await this.firstVisibleOptionText();

    if (!firstOptionText) {
      await this.dispatchToInput.press('ArrowDown');
      await this.page.waitForTimeout(300);
      firstOptionText = await this.firstVisibleOptionText();
    }

    if (firstOptionText) {
      await this.page
        .getByRole('option')
        .filter({ hasText: firstOptionText })
        .first()
        .click();

      return firstOptionText;
    }

    await this.dispatchToInput.press('ArrowDown');
    await this.dispatchToInput.press('Enter');

    const selectedValue = await this.dispatchToInput.inputValue().catch(() => '');

    if (selectedValue.trim()) {
      return selectedValue.trim();
    }

    throw new Error(
      'No Dispatch to option found for Dispatch Summary using click, option list, or keyboard selection.',
    );
  }

  async fillFilters(options?: {
    fromDate?: string;
    toDate?: string;
  }): Promise<string> {
    await this.fillDateRange({
      fromDate: options?.fromDate,
      toDate: options?.toDate,
    });

    return await this.selectFirstAvailableDispatchTo();
  }

  private genericOkButton(): Locator {
    return this.page.getByRole('button', { name: /^Ok$/i });
  }

  async expectNoGenericOkPopup(): Promise<void> {
    await expect(this.genericOkButton()).toBeHidden({ timeout: 3000 });
  }

  async expectReportCompletedWithRowsOrEmptyState(): Promise<void> {
    const startTime = Date.now();
    const minimumObservationMs = 3000;
    const timeoutMs = 10000;

    let sawValidTableState = false;

    while (Date.now() - startTime < timeoutMs) {
      const okVisible = await this.genericOkButton()
        .isVisible({ timeout: 300 })
        .catch(() => false);

      if (okVisible) {
        throw new Error(
          'Dispatch Summary report showed generic "Something went wrong" popup.',
        );
      }

      const noRecordsVisible = await this.page
        .getByText(/No matching records found/i)
        .first()
        .isVisible({ timeout: 300 })
        .catch(() => false);

      if (noRecordsVisible) {
        sawValidTableState = true;
      }

      const rows = this.page.locator('tbody tr');
      const rowCount = await rows.count();

      for (let index = 0; index < rowCount; index += 1) {
        const rowText = (await rows.nth(index).innerText())
          .replace(/\s+/g, ' ')
          .trim();

        if (rowText && !/No matching records found/i.test(rowText)) {
          sawValidTableState = true;
          break;
        }
      }

      if (sawValidTableState && Date.now() - startTime >= minimumObservationMs) {
        break;
      }

      await this.page.waitForTimeout(250);
    }

    await this.expectNoGenericOkPopup();

    if (!sawValidTableState) {
      throw new Error(
        'Dispatch Summary report did not complete with data rows or No matching records found.',
      );
    }
  }

  async showSummary(): Promise<void> {
    await expect(this.showSummaryButton).toBeVisible({ timeout: 10000 });
    await this.showSummaryButton.click();

    await this.expectSummaryColumnsVisible();
  }

  async showDetails(): Promise<void> {
    await expect(this.showDetailsButton).toBeVisible({ timeout: 10000 });
    await this.showDetailsButton.click();

    await this.expectDetailsColumnsVisible();
  }
}
