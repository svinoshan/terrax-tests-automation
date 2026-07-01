import { BasePage } from '../common/BasePage';
import { expect, Locator, Page } from '@playwright/test';
import { AppShell } from '../common/AppShell';
import { MainUnitTestData } from '@data/unit-info/unit-info.data';

export class MainUnitPage extends BasePage {
  private readonly appShell: AppShell;

  readonly title: Locator;
  readonly codeInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;
  readonly updateButton: Locator;
  readonly backButton: Locator;
  readonly searchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);

    this.title = page.getByRole('heading', { name: /create main unit/i });
    this.codeInput = page.locator('[formcontrolname="code"]');
    this.descriptionInput = page.locator('[formcontrolname="description"]');

    this.saveButton = page.getByRole('button', { name: /\+?\s*save/i }).first();
    this.updateButton = page.getByRole('button', { name: /update/i }).first();
    this.backButton = page.getByRole('button', { name: /back/i }).first();

    this.searchInput = page
      .getByRole('searchbox')
      .or(page.locator('input[type="search"], input[placeholder*="Search"]').first());
  }

  async open(): Promise<void> {
    await this.appShell.openMainUnit();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible({ timeout: 30000 });
    await expect(this.codeInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.page.getByText(/Main unit code/i).first()).toBeVisible();
  }

  async fillForm(data: MainUnitTestData): Promise<void> {
    await this.codeInput.fill(data.mainUnitCode);
    await this.descriptionInput.fill(data.description);
    await expect(this.codeInput).toHaveValue(data.mainUnitCode);
    await expect(this.descriptionInput).toHaveValue(data.description);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  }

  async update(): Promise<void> {
    await this.updateButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  }

  async search(value: string): Promise<void> {
    await this.searchInput.fill('');
    await this.searchInput.fill(value);
  }

  async getRow(mainUnitCode: string): Promise<Locator> {
    const row = this.page.getByRole('row').filter({ hasText: mainUnitCode }).first();
    await expect(row).toBeVisible({ timeout: 30000 });
    return row;
  }

  async expectMainUnitVisible(mainUnitCode: string): Promise<void> {
    await expect(this.page.getByText(mainUnitCode).first()).toBeVisible({ timeout: 30000 });
  }

  async expectRowContains(mainUnitCode: string, expectedText: string | RegExp): Promise<void> {
    const row = await this.getRow(mainUnitCode);
    await expect(row).toContainText(expectedText);
  }

  async clickEdit(mainUnitCode: string): Promise<void> {
    const row = await this.getRow(mainUnitCode);
    await row.locator('td').last().locator('a').first().click();
  }

  async updateDescription(description: string): Promise<void> {
    await this.descriptionInput.fill(description);
    await expect(this.descriptionInput).toHaveValue(description);
  }

  async expectSuccessToast(): Promise<void> {
    await expect(this.page.getByText(/Success|success|Created|Updated/i).first()).toBeVisible({
      timeout: 10000,
    });
  }
}
