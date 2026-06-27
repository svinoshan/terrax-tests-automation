import { expect, Locator, Page } from '@playwright/test';

export class ModalComponent {
  readonly dialog: Locator;

  constructor(private readonly page: Page) {
    this.dialog = this.page.locator('[role="dialog"], .modal, .mat-mdc-dialog-container').first();
  }

  async expectOpen(): Promise<void> {
    await expect(this.dialog).toBeVisible();
  }

  async confirm(): Promise<void> {
    await this.page.getByRole('button', { name: /yes|confirm|ok|submit/i }).click();
  }

  async cancel(): Promise<void> {
    await this.page.getByRole('button', { name: /no|cancel|close/i }).click();
  }
}
