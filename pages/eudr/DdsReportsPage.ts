import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";

export class DdsReportsPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly addNewButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole('heading', { name: 'DDS Reports' });

    this.addNewButton = page.getByRole("button", { name: /Add new/i }).first();

    this.searchInput = page
      .getByRole("searchbox", { name: /Search/i })
      .or(page.getByPlaceholder(/Search/i))
      .first();
  }

  async open(): Promise<void> {
    await this.appShell.openEudrDdsReports();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.addNewButton).toBeVisible({ timeout: 30000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Internal ref no/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Operator/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Trade name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Activity type/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Last update by/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Update at/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Status/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Action/i }),
    ).toBeVisible();
  }

  async clickAddNew(): Promise<void> {
    await this.addNewButton.click();
  }

  async search(value: string): Promise<void> {
    await this.expectLoaded();

    await this.searchInput.fill("");
    await this.searchInput.fill(value);

    await this.page.waitForTimeout(500);
  }

  async expectAtLeastOneReportRow(): Promise<void> {
    await expect(
      this.page
        .getByRole("row")
        .filter({ hasText: /Active|Cancel|IMPORT|EXPORT|TRADE/i })
        .first(),
    ).toBeVisible({ timeout: 30000 });
  }

  async getFirstReportRow(): Promise<Locator> {
    const row = this.page
      .locator("tbody tr")
      .filter({ hasText: /Active|Cancel|IMPORT|EXPORT|TRADE/i })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    return row;
  }

  async openFirstReportForEdit(): Promise<void> {
    const row = await this.getFirstReportRow();

    const editAction = row
      .locator(".me-2.p-2, .action-icon-btn, a, button")
      .first();

    await expect(editAction).toBeVisible({ timeout: 10000 });
    await editAction.click();
  }

  async downloadFirstQrCode(): Promise<void> {
    const row = await this.getFirstReportRow();

    const downloadPromise = this.page.waitForEvent("download", {
      timeout: 15000,
    });

    const qrAction = row
      .locator(".tables-row a:nth-child(2), .action-icon-btn, a, button")
      .last();

    await expect(qrAction).toBeVisible({ timeout: 10000 });
    await qrAction.click();

    const download = await downloadPromise;

    const suggestedFileName = download.suggestedFilename();

    expect(suggestedFileName).toMatch(/\.png$|\.jpg$|\.jpeg$|qr/i);
  }

  async getReportRow(expectedText: string): Promise<Locator> {
    const row = this.page
      .locator("tbody tr")
      .filter({ hasText: expectedText })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    return row;
  }

  async expectReportVisible(expectedText: string): Promise<void> {
    await expect(this.page.getByText(expectedText).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async expectReportRowContains(
    expectedText: string,
    rowText: string | RegExp,
  ): Promise<void> {
    const row = await this.getReportRow(expectedText);
    await expect(row).toContainText(rowText);
  }

  async openReportForEdit(expectedText: string): Promise<void> {
    const row = await this.getReportRow(expectedText);

    const editAction = row
      .locator(".me-2.p-2, .action-icon-btn, a, button")
      .first();

    await expect(editAction).toBeVisible({ timeout: 10000 });
    await editAction.click();
  }

  async expectReportStatus(
    expectedText: string,
    status: string | RegExp,
  ): Promise<void> {
    const row = await this.getReportRow(expectedText);
    await expect(row).toContainText(status);
  }
}
