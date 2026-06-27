import { expect, Locator, Page } from '@playwright/test';

export class TableComponent {
  readonly searchInput: Locator;
  readonly rows: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = this.page.getByPlaceholder(/search/i);
    this.rows = this.page.locator('table tbody tr');
  }

  async search(value: string): Promise<void> {
    await this.searchInput.fill(value);
  }

  async expectColumnTextVisible(text: string | RegExp): Promise<void> {
    await expect(this.page.getByText(text).first()).toBeVisible();
  }

  async expectAtLeastOneRow(): Promise<void> {
    await expect(this.rows.first()).toBeVisible();
  }
}
