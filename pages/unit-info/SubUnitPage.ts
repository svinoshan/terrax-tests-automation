import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';
import { SubUnitTestData } from '@data/unit-info/unit-info.data';

export class SubUnitPage extends BasePage {
  private readonly appShell: AppShell;

  readonly title: Locator;
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

    this.title = page.getByRole('heading', { name: /create sub unit/i });
    this.mainUnitInput = page.locator('[formcontrolname="unitF"]');
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
    await this.appShell.openSubUnit();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.title).toBeVisible({ timeout: 30000 });
    await expect(this.mainUnitInput).toBeVisible();
    await expect(this.codeInput).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.page.getByText(/Sub unit code/i).first()).toBeVisible();
  }

  async selectMainUnit(mainUnitCode: string, mainUnitDescription: string): Promise<void> {
    await this.mainUnitInput.click();
    await this.mainUnitInput.fill(mainUnitCode);

    const optionText = new RegExp(`${mainUnitCode}\\s*\\|\\s*${mainUnitDescription}`, 'i');
    const option = this.page.getByText(optionText).first();

    try {
      await option.waitFor({ state: 'visible', timeout: 5000 });
      await option.click();
    } catch {
      await this.mainUnitInput.press('Enter');
    }
  }

  async fillForm(data: SubUnitTestData): Promise<void> {
    await this.selectMainUnit(data.mainUnitCode, data.mainUnitDescription);
    await this.codeInput.fill(data.subUnitCode);
    await this.descriptionInput.fill(data.description);

    await expect(this.codeInput).toHaveValue(data.subUnitCode);
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

  async getRow(subUnitCode: string): Promise<Locator> {
    const row = this.page.getByRole('row').filter({ hasText: subUnitCode }).first();
    await expect(row).toBeVisible({ timeout: 30000 });
    return row;
  }

  async expectSubUnitVisible(subUnitCode: string): Promise<void> {
    await expect(this.page.getByText(subUnitCode).first()).toBeVisible({ timeout: 30000 });
  }

  async expectRowContains(subUnitCode: string, expectedText: string | RegExp): Promise<void> {
    const row = await this.getRow(subUnitCode);
    await expect(row).toContainText(expectedText);
  }

  async clickEdit(subUnitCode: string): Promise<void> {
    const row = await this.getRow(subUnitCode);
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
