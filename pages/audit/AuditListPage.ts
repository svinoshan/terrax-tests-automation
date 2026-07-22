import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";

export class AuditListPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly addNewButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole("heading", { name: /All audit/i });

    //this.addNewButton = page.getByRole("button", { name: /Add new/i }).first();
    this.addNewButton = page.getByText('Add new');
    
    this.searchInput = page
      .getByRole("searchbox")
      .or(page.getByPlaceholder("Search"))
      .first();
  }

  async open(): Promise<void> {
    await this.appShell.openCreateAudit();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.addNewButton).toBeVisible({ timeout: 30000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Field officer/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Plan by/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Audit number/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Plan date/i }),
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

  async getAuditRow(expectedText: string): Promise<Locator> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: expectedText })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    return row;
  }

  async expectAuditVisible(expectedText: string): Promise<void> {
    await expect(this.page.getByText(expectedText).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async expectAuditRowContains(
    expectedText: string,
    rowText: string | RegExp,
  ): Promise<void> {
    const row = await this.getAuditRow(expectedText);
    await expect(row).toContainText(rowText);
  }

  async clickEditForAudit(expectedText: string): Promise<void> {
    const row = await this.getAuditRow(expectedText);

    await row.locator(".me-2.p-2, a, button").first().click();
  }

  async clickFirstAuditAction(): Promise<void> {
    await this.expectLoaded();

    const firstAction = this.page
      .locator("tbody tr .me-2.p-2, tbody tr a, tbody tr button")
      .first();

    await expect(firstAction).toBeVisible({ timeout: 10000 });
    await firstAction.click();
  }

  async clickCancelForAudit(expectedText: string): Promise<void> {
    const row = await this.getAuditRow(expectedText);

    const cancelAction = row
      .locator(
        '.p-2.action-icon-btn.text-danger, .text-danger, button:has-text("×"), button:has-text("x")',
      )
      .first();

    await expect(cancelAction).toBeVisible({ timeout: 10000 });
    await cancelAction.click();
  }

  async confirmCancelAudit(): Promise<void> {
    const confirmButton = this.page.getByRole("button", {
      name: /Yes,\s*Cancel it!/i,
    });

    await expect(confirmButton).toBeVisible({ timeout: 10000 });
    await confirmButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async cancelAuditFromList(expectedText: string): Promise<void> {
    await this.clickCancelForAudit(expectedText);
    await this.confirmCancelAudit();
  }

  async expectAuditCancelled(expectedText: string): Promise<void> {
    const row = await this.getAuditRow(expectedText);
    await expect(row).toContainText(/Cancel/i);
  }
}
