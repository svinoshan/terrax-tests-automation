import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";

export class PurchaseListPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly addNewButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole("heading", { name: /purchase notes/i });
    this.addNewButton = page.getByRole("button", { name: /\+?\s*add new/i });
    this.searchInput = page
      .getByRole("searchbox")
      .or(page.locator('input[type="search"]').first());
  }

  async open(): Promise<void> {
    await this.appShell.openPurchase();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.addNewButton).toBeVisible({ timeout: 30000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Purchase date/i }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("columnheader", { name: /Purchase no/i }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("columnheader", { name: /Farmer code/i }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("columnheader", { name: /Farmer name/i }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("columnheader", { name: /Plot code/i }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("columnheader", { name: /Purchasing officer/i }),
    ).toBeVisible();
    await expect(
      this.page.getByRole("columnheader", { name: /Authorized/i }),
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
  }

  async getPurchaseRow(expectedText: string): Promise<Locator> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: expectedText })
      .first();
    await expect(row).toBeVisible({ timeout: 30000 });
    return row;
  }

  async expectPurchaseVisible(expectedText: string): Promise<void> {
    await expect(this.page.getByText(expectedText).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async expectPurchaseRowContains(
    expectedText: string,
    rowText: string | RegExp,
  ): Promise<void> {
    const row = await this.getPurchaseRow(expectedText);
    await expect(row).toContainText(rowText);
  }

  async clickEditForPurchase(expectedText: string): Promise<void> {
    const row = await this.getPurchaseRow(expectedText);

    await row.locator(".me-2.p-2, a, button").first().click();
  }

  async expectPurchaseAuthorizedStatus(
    expectedText: string,
    authorizedStatus: string | RegExp,
  ): Promise<void> {
    const row = await this.getPurchaseRow(expectedText);
    await expect(row).toContainText(authorizedStatus);
  }

  async expectPurchaseCancelled(expectedText: string): Promise<void> {
    const row = await this.getPurchaseRow(expectedText);

    // Most TerraX cancelled rows use a class containing "cancel".
    await expect(row).toHaveClass(/cancel/i, { timeout: 10000 });
  }

  async clickFirstPurchaseAction(): Promise<void> {
    await this.expectLoaded();

    const firstAction = this.page
      .locator("tbody tr .me-2.p-2, tbody tr a, tbody tr button")
      .first();

    await expect(firstAction).toBeVisible({ timeout: 10000 });
    await firstAction.click();
  }
}
