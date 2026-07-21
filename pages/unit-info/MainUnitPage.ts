import { BasePage } from "../common/BasePage";
import { expect, Locator, Page } from "@playwright/test";
import { AppShell } from "../common/AppShell";
import { MainUnitTestData } from "@data/unit-info/unit-info.data";

export class MainUnitPage extends BasePage {
  private readonly appShell: AppShell;

  readonly title: Locator;
  readonly createNewButton: Locator;
  readonly codeInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;
  readonly updateButton: Locator;
  readonly backButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.title = page
      .locator("h4")
      .filter({ hasText: /Create main unit/i })
      .first();

    this.createNewButton = page
      .getByRole("button", { name: /Create new/i })
      .or(page.locator("button").filter({ hasText: /Create new/i }))
      .first();

    this.codeInput = page.locator('[formcontrolname="code"]:visible').first();

    this.descriptionInput = page
      .locator('[formcontrolname="description"]:visible')
      .first();

    this.saveButton = page.getByRole("button", { name: /save/i }).first();

    this.updateButton = page.getByRole("button", { name: /update/i }).first();

    this.backButton = page
      .getByRole("button", { name: /back|cancel/i })
      .or(page.locator("button").filter({ hasText: /back|cancel/i }))
      .first();

    this.searchInput = page
      .getByRole("searchbox")
      .or(
        page
          .locator('input[type="search"], input[placeholder*="Search"]')
          .first(),
      );
  }

  async open(): Promise<void> {
    await this.appShell.openMainUnit();
    await this.expectListLoaded();
  }

  async expectLoaded(): Promise<void> {
    await this.expectListLoaded();
  }

  async expectListLoaded(): Promise<void> {
    await expect(this.title).toBeVisible({ timeout: 30000 });

    await expect(this.createNewButton).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Main unit code/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Description/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Action/i }),
    ).toBeVisible({ timeout: 15000 });
  }

  async openCreateForm(): Promise<void> {
    await this.open();

    await this.createNewButton.click();

    await this.expectFormLoaded();
  }

  async expectFormLoaded(): Promise<void> {
    await expect(this.codeInput).toBeVisible({ timeout: 15000 });

    await expect(this.descriptionInput).toBeVisible({ timeout: 15000 });

    await expect(this.page.getByText(/Main unit code/i).first()).toBeVisible({
      timeout: 15000,
    });

    await expect(this.saveButton).toBeVisible({ timeout: 15000 });
  }

  async fillForm(data: MainUnitTestData): Promise<void> {
    await expect(this.codeInput).toBeVisible({ timeout: 15000 });
    await expect(this.descriptionInput).toBeVisible({ timeout: 15000 });

    await this.codeInput.fill(data.mainUnitCode);
    await this.descriptionInput.fill(data.description);

    await expect(this.codeInput).toHaveValue(data.mainUnitCode);
    await expect(this.descriptionInput).toHaveValue(data.description);
  }

  async save(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 15000 });
    await this.saveButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async update(): Promise<void> {
    await expect(this.updateButton).toBeVisible({ timeout: 15000 });
    await this.updateButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async search(value: string): Promise<void> {
    await this.expectListLoaded();

    await this.searchInput.fill("");
    await this.searchInput.fill(value);

    await this.page.waitForTimeout(500);
  }

  async getRow(mainUnitCode: string): Promise<Locator> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: mainUnitCode })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    return row;
  }

  async expectMainUnitVisible(mainUnitCode: string): Promise<void> {
    await expect(this.page.getByText(mainUnitCode).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async expectRowContains(
    mainUnitCode: string,
    expectedText: string | RegExp,
  ): Promise<void> {
    const row = await this.getRow(mainUnitCode);

    await expect(row).toContainText(expectedText);
  }

  async clickEdit(mainUnitCode: string): Promise<void> {
    const row = await this.getRow(mainUnitCode);

    const actionCell = row.getByRole("cell").last();

    const action = actionCell
      .locator("a, button, .mat-mdc-tooltip-trigger, .me-2.p-2")
      .first();

    if (await action.isVisible({ timeout: 3000 }).catch(() => false)) {
      await action.click();
      return;
    }

    await actionCell.click();
  }

  async updateDescription(description: string): Promise<void> {
    await expect(this.descriptionInput).toBeVisible({ timeout: 15000 });

    await this.descriptionInput.fill(description);

    await expect(this.descriptionInput).toHaveValue(description);
  }

  async back(): Promise<void> {
    await expect(this.backButton).toBeVisible({ timeout: 15000 });

    await this.backButton.scrollIntoViewIfNeeded();

    try {
      await this.backButton.click({ timeout: 5000 });
    } catch {
      await this.backButton.click({ force: true });
    }
  }

  async expectSuccessToast(): Promise<void> {
    await expect(
      this.page.getByText(/Success|success|Created|Updated/i).first(),
    ).toBeVisible({
      timeout: 10000,
    });
  }
}
