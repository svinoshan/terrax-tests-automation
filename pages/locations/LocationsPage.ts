import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/common/BasePage';
import { AppShell } from '@pages/common/AppShell';
import { LocationFormData } from '@data/locations/location.data';

export class LocationsPage extends BasePage {
  private readonly shell: AppShell;
  constructor(page: Page) { super(page); this.shell = new AppShell(page); }
  async open(): Promise<void> { await this.shell.openLocations(); await expect(this.page).toHaveURL(/\/home\/customers\/all/); await expect(this.page.getByRole('heading', { name: /^locations$/i })).toBeVisible(); }
  async openCreate(): Promise<void> { await this.page.getByText(/add new/i).first().click(); await expect(this.panel()).toBeVisible(); }
  panel(): Locator {
    return this.page
      .locator('app-locations-form .side-panel-wrapper.show-panel')
      .last();
  }
  field(name: string): Locator { return this.panel().locator(`[formcontrolname="${name}"]`); }
  async fill(data: LocationFormData): Promise<void> {
    await this.field('facilityName').fill(data.facilityName);
    if (data.locationType) { await this.field('locationType').click(); await this.page.getByRole('option', { name: data.locationType, exact: true }).click(); }
    await this.field('phoneNumber').fill(data.phoneNumber); await this.field('address').fill(data.address);
    if (typeof data.status === 'boolean') await this.setSwitch(this.field('status'), data.status);
  }
  async save(): Promise<void> { await this.panel().locator('.side-panel-footer button.btn-success').click(); }
  async update(): Promise<void> { await this.panel().locator('.side-panel-footer button.btn-success').click(); }
  async search(value: string): Promise<void> { await this.page.locator('[formcontrolname="filterValue"]').fill(value); await this.page.waitForTimeout(900); }
  async row(name: string): Promise<Locator> { const row=this.page.getByRole('row').filter({hasText:name}).first(); await expect(row).toBeVisible({timeout:20_000}); return row; }
  async edit(name: string): Promise<void> { const row=await this.row(name); await row.locator('td').last().locator('a').first().click(); await expect(this.panel()).toBeVisible(); await expect(this.field('facilityName')).toHaveValue(name, { timeout: 15_000 }); }
  async expectRowContains(name: string, value: string): Promise<void> { await expect(await this.row(name)).toContainText(value); }
  async setStatus(status: boolean): Promise<void> { await this.setSwitch(this.field('status'), status); }
  async delete(name: string): Promise<void> { const row=await this.row(name); await row.locator('td').last().locator('a').last().click(); await this.page.getByRole('button',{name:/yes, delete it!/i}).click(); }
  async expectStatus(name: string, status: 'Active'|'Inactive'): Promise<void> { await expect((await this.row(name)).getByRole('cell').nth(4)).toContainText(status); }
  async expectInline(message: string): Promise<void> { await expect(this.panel().getByText(message).first()).toBeVisible(); }
  private async setSwitch(locator: Locator, expected: boolean): Promise<void> { if ((await locator.isChecked()) !== expected) await locator.click(); }
}
