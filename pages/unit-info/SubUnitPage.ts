import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";
import { SubUnitTestData } from "@data/unit-info/unit-info.data";

export class SubUnitPage extends BasePage {
  private readonly appShell: AppShell;

  readonly title: Locator;
  readonly createNewButton: Locator;
  readonly mainUnitInput: Locator;
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
      .filter({ hasText: /Create sub unit|Sub unit/i })
      .first();

    this.createNewButton = page
      .getByRole("button", { name: /Create new/i })
      .or(page.locator("button").filter({ hasText: /Create new/i }))
      .first();

    this.mainUnitInput = page
      .locator('[formcontrolname="unitF"]:visible')
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
    await this.appShell.openSubUnit();
    await this.expectListLoaded();
  }

  async expectLoaded(): Promise<void> {
    await this.expectListLoaded();
  }

  async expectListLoaded(): Promise<void> {
    await expect(this.title).toBeVisible({ timeout: 30000 });

    await expect(this.createNewButton).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /^Main unit code$/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /^Sub unit code$/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /^Description$/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /^Action$/i }),
    ).toBeVisible({ timeout: 15000 });
  }

  async openCreateForm(): Promise<void> {
    await this.open();

    await this.createNewButton.click();

    await this.expectFormLoaded();
  }

  async expectFormLoaded(): Promise<void> {
    await expect(this.mainUnitInput).toBeVisible({ timeout: 15000 });

    await expect(this.codeInput).toBeVisible({ timeout: 15000 });

    await expect(this.descriptionInput).toBeVisible({ timeout: 15000 });

    await expect(this.page.getByText(/Sub unit code/i).first()).toBeVisible({
      timeout: 15000,
    });

    await expect(this.saveButton).toBeVisible({ timeout: 15000 });
  }

  async selectMainUnit(
    mainUnitCode: string,
    mainUnitDescription: string,
  ): Promise<void> {
    await expect(this.mainUnitInput).toBeVisible({ timeout: 15000 });

    await this.mainUnitInput.click();
    await this.mainUnitInput.fill(mainUnitCode);

    const optionText = new RegExp(
      `${mainUnitCode}\\s*\\|\\s*${mainUnitDescription}`,
      "i",
    );

    const exactOption = this.page.getByText(optionText).first();

    const exactVisible = await exactOption
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (exactVisible) {
      await exactOption.click();
      return;
    }

    const codeOption = this.page
      .getByRole("option")
      .filter({ hasText: mainUnitCode })
      .first();

    const codeVisible = await codeOption
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (codeVisible) {
      await codeOption.click();
      return;
    }

    await this.mainUnitInput.press("Enter").catch(() => {});
  }

  async fillForm(data: SubUnitTestData): Promise<void> {
    await this.expectFormLoaded();

    await this.selectMainUnit(data.mainUnitCode, data.mainUnitDescription);

    await this.codeInput.fill(data.subUnitCode);
    await this.descriptionInput.fill(data.description);

    await expect(this.codeInput).toHaveValue(data.subUnitCode);
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

  async getRow(subUnitCode: string): Promise<Locator> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: subUnitCode })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    return row;
  }

  async expectSubUnitVisible(subUnitCode: string): Promise<void> {
    await expect(this.page.getByText(subUnitCode).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async expectRowContains(
    subUnitCode: string,
    expectedText: string | RegExp,
  ): Promise<void> {
    const row = await this.getRow(subUnitCode);

    await expect(row).toContainText(expectedText);
  }

  async clickEdit(subUnitCode: string): Promise<void> {
    const row = await this.getRow(subUnitCode);

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
