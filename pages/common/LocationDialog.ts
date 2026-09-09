import { expect, Locator, Page } from '@playwright/test';
import { LocationFormData } from '@data/locations/location.data';

export class LocationDialog {
  readonly dialog: Locator;

  constructor(private readonly page: Page) {
    this.dialog = page.locator('mat-dialog-container').last();
  }

  async expectVisible(): Promise<void> {
    await expect(this.dialog).toBeVisible({ timeout: 15_000 });
  }

  field(name: string): Locator {
    return this.dialog.locator(`[formcontrolname="${name}"]`);
  }

  async fill(data: LocationFormData): Promise<void> {
    await this.expectVisible();
    await this.field('facilityName').fill(data.facilityName);
    if (data.locationType) {
      await this.field('locationType').click();
      await this.page.getByRole('option', { name: data.locationType.replaceAll('_', ' '), exact: true })
        .or(this.page.getByRole('option', { name: data.locationType, exact: true }))
        .click();
    }
    await this.field('phoneNumber').fill(data.phoneNumber);
    await this.field('address').fill(data.address);
    await this.field('coordinates').fill(data.coordinates || '');
    if (typeof data.status === 'boolean') await this.setSwitch(this.field('status'), data.status);
  }

  async save(): Promise<void> {
    await this.dialog.getByRole('button', { name: /^save$/i }).click();
  }

  async cancel(): Promise<void> {
    await this.dialog.getByRole('button', { name: /^cancel$/i }).click();
  }

  async expectMessage(message: string | RegExp): Promise<void> {
    await expect(this.dialog.getByText(message).first()).toBeVisible();
  }

  async expectCoordinatesMoveMarker(coordinates: string): Promise<void> {
    await this.field('coordinates').fill(coordinates);
    await expect(this.dialog.locator('map-advanced-marker')).toBeVisible({ timeout: 10_000 });
  }

  async clickMapAndExpectCoordinatesChanged(): Promise<void> {
    const input = this.field('coordinates');
    const before = await input.inputValue();
    const map = this.dialog.locator('google-map .map-container').first();
    await expect(map).toBeVisible();
    const box = await map.boundingBox();
    if (!box) throw new Error('Google map has no clickable bounds');
    await map.click({ position: { x: box.width * 0.65, y: box.height * 0.45 } });
    await expect.poll(() => input.inputValue()).not.toBe(before);
    await expect(input).toHaveValue(/^-?\d+\.\d{6}, -?\d+\.\d{6}$/);
  }

  private async setSwitch(locator: Locator, expected: boolean): Promise<void> {
    if ((await locator.isChecked()) !== expected) await locator.click();
  }
}
