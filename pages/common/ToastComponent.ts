import { expect, Locator, Page } from '@playwright/test';

export class ToastComponent {
  readonly toast: Locator;

  constructor(private readonly page: Page) {
    this.toast = this.page
      .locator('.toast, .toast-message, .mat-mdc-snack-bar-label, .snackbar, [role="alert"]')
      .first();
  }

  async expectSuccess(message?: string | RegExp): Promise<void> {
    await expect(this.toast).toBeVisible();

    if (message) {
      await expect(this.toast).toContainText(message);
    }
  }

  async expectError(message?: string | RegExp): Promise<void> {
    await expect(this.toast).toBeVisible();

    if (message) {
      await expect(this.toast).toContainText(message);
    }
  }
}
