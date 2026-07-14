import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";

export class OperatorsListPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly addNewButton: Locator;
  readonly searchInput: Locator;
  readonly inactiveToggle: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole("heading", { name: /^Operators$/i });

    this.addNewButton = page.getByRole("button", { name: /Add new/i }).first();

    this.searchInput = page
      .getByRole("searchbox", { name: /Search/i })
      .or(page.getByPlaceholder("Search"))
      .first();

    this.inactiveToggle = page.getByText(/Inactive/i).first();
  }

  async open(): Promise<void> {
    await this.appShell.openEudrOperators();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.addNewButton).toBeVisible({ timeout: 30000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Contact email/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /EORI number/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Country/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Address/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Last update by/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Active/i }),
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

  async getOperatorRow(expectedText: string): Promise<Locator> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: expectedText })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    return row;
  }

  async expectOperatorVisible(expectedText: string): Promise<void> {
    await expect(this.page.getByText(expectedText).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async expectOperatorRowContains(
    expectedText: string,
    rowText: string | RegExp,
  ): Promise<void> {
    const row = await this.getOperatorRow(expectedText);
    await expect(row).toContainText(rowText);
  }

  async clickEditForOperator(expectedText: string): Promise<void> {
    const row = await this.getOperatorRow(expectedText);

    await row.locator(".me-2.p-2, .action-icon-btn, a, button").first().click();
  }

  async expectOperatorHidden(expectedText: string): Promise<void> {
    await expect(this.page.getByText(expectedText).first()).toBeHidden({
      timeout: 10000,
    });
  }

  async clickDeleteForOperator(expectedText: string): Promise<void> {
    const row = await this.getOperatorRow(expectedText);

    const deleteAction = row
      .locator(".text-danger, .action-icon-btn.text-danger, a, button")
      .last();

    await expect(deleteAction).toBeVisible({ timeout: 10000 });
    await deleteAction.click();
  }

  async confirmDeleteOperator(): Promise<void> {
    const confirmButton = this.page.getByRole("button", {
      name: /Yes,\s*delete it!/i,
    });

    await expect(confirmButton).toBeVisible({ timeout: 10000 });
    await confirmButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async deleteOperator(expectedText: string): Promise<void> {
    await this.clickDeleteForOperator(expectedText);
    await this.confirmDeleteOperator();
  }

  async expectOperatorInactive(expectedText: string): Promise<void> {
    const row = await this.getOperatorRow(expectedText);

    await expect(row).toContainText(/InActive|Inactive/i);
  }
}
