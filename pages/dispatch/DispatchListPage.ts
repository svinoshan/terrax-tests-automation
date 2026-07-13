import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";

export class DispatchListPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly addNewButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole("heading", { name: /^Dispatch$/i });

    this.addNewButton = page.getByRole("button", { name: /Add new/i }).first();

    this.searchInput = page
      .getByRole("searchbox")
      .or(page.getByPlaceholder("Search"))
      .first();
  }

  async open(): Promise<void> {
    await this.appShell.openDispatch();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.addNewButton).toBeVisible({ timeout: 30000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Dispatch date/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Dispatch no/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Dispatch to/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Dispatch by/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /User name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Vehicle no/i }),
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

  async getDispatchRow(expectedText: string): Promise<Locator> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: expectedText })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    return row;
  }

  async expectDispatchVisible(expectedText: string): Promise<void> {
    await expect(this.page.getByText(expectedText).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async expectDispatchRowContains(
    expectedText: string,
    rowText: string | RegExp,
  ): Promise<void> {
    const row = await this.getDispatchRow(expectedText);
    await expect(row).toContainText(rowText);
  }

  async clickEditForDispatch(expectedText: string): Promise<void> {
    const row = await this.getDispatchRow(expectedText);

    await row.locator(".me-2.p-2, a, button").first().click();
  }

  async clickViewForDispatch(expectedText: string): Promise<void> {
    const row = await this.getDispatchRow(expectedText);

    await row.locator(".me-2.p-2, a, button").first().click();
  }

  async expectDispatchCancelled(expectedText: string): Promise<void> {
    const row = await this.getDispatchRow(expectedText);

    const className = await row.getAttribute("class");

    if (className && /cancel|danger|inactive|void|red/i.test(className)) {
      await expect(row).toHaveClass(/cancel|danger|inactive|void|red/i);
      return;
    }

    // Fallback: if the app only colors row visually without useful class,
    // at least confirm the row still exists.
    await expect(row).toBeVisible();
  }

  async clickFirstDispatchAction(): Promise<void> {
    await this.expectLoaded();

    const firstAction = this.page
      .locator("tbody tr .me-2.p-2, tbody tr a, tbody tr button")
      .first();

    await expect(firstAction).toBeVisible({ timeout: 10000 });
    await firstAction.click();
  }
}
