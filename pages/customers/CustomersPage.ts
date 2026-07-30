import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";

export class CustomersPage extends BasePage {
  private readonly appShell: AppShell;
  readonly addNewButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);

    this.addNewButton = this.page
      .getByRole("button", { name: /\+?\s*add new/i })
      .or(this.page.getByText(/\+?\s*Add new/i))
      .first();

    this.searchInput = this.page
      .getByRole("searchbox")
      .or(
        this.page
          .locator(
            'input[type="search"], input[placeholder*="Search"], input[placeholder*="search"]',
          )
          .first(),
      );
  }

  async open(): Promise<void> {
    await this.appShell.openCustomers();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/home\/customers\/all/i, {
      timeout: 30000,
    });
    await expect(
      this.page.getByRole("heading", { name: /Customers/i }),
    ).toBeVisible({
      timeout: 30000,
    });
    await expect(this.addNewButton).toBeVisible({ timeout: 30000 });
    await expect(this.page.getByText(/Customer name/i).first()).toBeVisible();
    await expect(
      this.page.getByText(/Customer address/i).first(),
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

  async expectCustomerVisible(customerName: string): Promise<void> {
    await expect(this.page.getByText(customerName).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async expectCustomerNotVisible(customerName: string): Promise<void> {
    await expect(this.page.getByText(customerName).first()).toBeHidden({
      timeout: 30000,
    });
  }

  async getCustomerRow(customerName: string): Promise<Locator> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: customerName })
      .first();
    await expect(row).toBeVisible({ timeout: 30000 });
    return row;
  }

  async expectCustomerStatus(
    customerName: string,
    expectedStatus: string | RegExp,
  ): Promise<void> {
    const row = await this.getCustomerRow(customerName);
    // Columns visible in screenshot:
    // 0 Customer name
    // 1 Customer address
    // 2 Customer telephone
    // 3 Last update by
    // 4 Status
    // 5 Action
    const statusCell = row.getByRole("cell").nth(4);
    await expect(statusCell).toContainText(expectedStatus, {
      timeout: 15000,
    });
  }
  async expectDeleteDisabledForCustomer(customerName: string): Promise<void> {
    const row = await this.getCustomerRow(customerName);
    const actionCell = row.getByRole("cell").last();
    const deleteAction = actionCell
      .locator(".p-2.text-danger, button:has(i), a:has(i), button, a")
      .last();
    await expect(deleteAction).toBeVisible({ timeout: 10000 });
    const isButtonDisabled = await deleteAction.isDisabled().catch(() => false);
    const ariaDisabled = await deleteAction
      .getAttribute("aria-disabled")
      .catch(() => null);
    const className = await deleteAction.getAttribute("class").catch(() => "");
    const pointerEvents = await deleteAction
      .evaluate((element) => window.getComputedStyle(element).pointerEvents)
      .catch(() => "");
    expect(
      isButtonDisabled ||
        ariaDisabled === "true" ||
        /disabled|inactive/i.test(className ?? "") ||
        pointerEvents === "none",
    ).toBeTruthy();
  }

  async expectCustomerRowContains(
    customerName: string,
    expectedText: string | RegExp,
  ): Promise<void> {
    const row = await this.getCustomerRow(customerName);
    await expect(row).toContainText(expectedText);
  }

  async clickEditForCustomer(customerName: string): Promise<void> {
    const row = await this.getCustomerRow(customerName);

    // Action cell has two links: first = edit, second = delete.
    await row.locator("td").last().locator("a").nth(0).click();
  }

  async clickDeleteForCustomer(customerName: string): Promise<void> {
    const row = await this.getCustomerRow(customerName);

    // Action cell has two links: first = edit, second = delete.
    await row.locator("td").last().locator("a").nth(1).click();
  }

  async confirmDelete(): Promise<void> {
    await this.page.getByRole("button", { name: /Yes, delete it!/i }).click();
    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectSuccessToast(): Promise<void> {
    await expect(
      this.page.getByText(/Success|success|deleted|Delete/i).first(),
    ).toBeVisible({
      timeout: 10000,
    });
  }
}
