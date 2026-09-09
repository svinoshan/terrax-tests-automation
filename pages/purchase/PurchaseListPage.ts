import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class PurchaseListPage extends BasePage {
  constructor(page: Page) { super(page); }
  async open(): Promise<void> {
    await new AppShell(this.page).openPurchase();
    await this.expectLoaded();
  }
  async expectLoaded(): Promise<void> {
    await expect(this.page.getByRole('heading', { name: /purchase notes/i })).toBeVisible();
    for (const name of [/^type$/i, /farmer.*supplier/i, /goods received location/i, /^status$/i]) {
      await expect(this.page.getByRole('columnheader', { name })).toBeVisible();
    }
  }
  async clickAddNew(): Promise<void> {
    await this.page.getByRole('button', { name: /add new/i }).click();
  }
  async search(value: string): Promise<void> {
    const response = this.page.waitForResponse(r => r.request().method() === 'GET' &&
      new URL(r.url()).pathname.endsWith('/purchase/main/all') &&
      new URL(r.url()).searchParams.get('value') === value);
    await this.page.locator('[formcontrolname="filterValue"]').fill(value);
    expect((await response).ok(), 'Purchase search failed').toBeTruthy();
  }
  row(number: string): Locator {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('cell', { name: number, exact: true })
    });
  }
  async expectStatus(number: string, status: string): Promise<void> {
    await expect(this.row(number)).toHaveCount(1);
    await expect(this.row(number).locator('td').nth(8)).toHaveText(new RegExp('^' + status + '$', 'i'));
  }
  async clickEditForPurchase(number: string): Promise<void> {
    await this.row(number).locator('td').last().locator('a,button').first().click();
  }
  async clickFirstPurchaseAction(): Promise<void> {
    await this.page.locator('tbody tr').first().locator('td').last().locator('a,button').first().click();
  }
}
