import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";

export class UserManagementListPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly addNewButton: Locator;
  readonly searchInput: Locator;
  readonly excelButton: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole("heading", {
      name: /User management/i,
    });

    //this.addNewButton = page.getByRole('button', { name: /Add new/i }).first();
    this.addNewButton = page
      .getByRole("link", { name: /Add new/i })
      .or(page.locator("a.btn-added").filter({ hasText: /Add new/i }))
      .first();

    this.searchInput = page
      .getByRole("searchbox", { name: /Search/i })
      .or(page.getByPlaceholder(/Search/i))
      .first();

    this.excelButton = page.getByRole("button", { name: /Excel/i }).first();
  }

  async open(): Promise<void> {
    await this.appShell.openUserManagement();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await this.dismissEmailAlreadyExistsPopupIfVisible();
    
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.addNewButton).toBeVisible({ timeout: 30000 });
    await expect(this.searchInput).toBeVisible({ timeout: 10000 });
    //await expect(this.excelButton).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Email/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Full name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Address/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Status/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Action/i }),
    ).toBeVisible();
  }

  async clickAddNew(): Promise<void> {
    await expect(this.addNewButton).toBeVisible({ timeout: 10000 });
    await this.addNewButton.click();
  }

  async search(value: string): Promise<void> {
    await this.expectLoaded();

    await this.searchInput.fill("");
    await this.searchInput.fill(value);

    await this.page.waitForTimeout(500);
  }

  async getUserRow(expectedText: string): Promise<Locator> {
    const row = this.page
      .locator("tbody tr")
      .filter({ hasText: expectedText })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    return row;
  }

  async expectUserVisible(expectedText: string): Promise<void> {
    await expect(this.page.getByText(expectedText).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async expectUserHidden(expectedText: string): Promise<void> {
    await expect(this.page.getByText(expectedText).first()).toBeHidden({
      timeout: 10000,
    });
  }

  async expectUserRowContains(
    expectedText: string,
    rowText: string | RegExp,
  ): Promise<void> {
    const row = await this.getUserRow(expectedText);

    await expect(row).toContainText(rowText);
  }

  async openEditForUser(expectedText: string): Promise<void> {
    const row = await this.getUserRow(expectedText);

    const editAction = row
      .locator(".action-icon-btn, .me-2.p-2, a, button")
      .last();

    await expect(editAction).toBeVisible({ timeout: 10000 });
    await editAction.click();
  }

  async deleteUser(expectedText: string): Promise<void> {
    const row = await this.getUserRow(expectedText);

    const deleteAction = row
      .locator(".text-danger, .action-icon-btn.text-danger, a, button")
      .nth(1);

    await expect(deleteAction).toBeVisible({ timeout: 10000 });
    await deleteAction.click();

    const confirmButton = this.page.getByRole("button", {
      name: /Yes,\s*delete it!/i,
    });

    await expect(confirmButton).toBeVisible({ timeout: 10000 });
    await confirmButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async dismissEmailAlreadyExistsPopupIfVisible(): Promise<void> {
    const popup = this.page
      .getByText(/Email already exist|email already exists|email.*already/i)
      .first();

    const isVisible = await popup
      .isVisible({ timeout: 1500 })
      .catch(() => false);

    if (!isVisible) {
      return;
    }

    const okButton = this.page.getByRole("button", { name: /^Ok$/i }).first();

    await expect(okButton).toBeVisible({ timeout: 5000 });
    await okButton.click();

    await expect(okButton)
      .toBeHidden({ timeout: 5000 })
      .catch(() => {});
  }
}
