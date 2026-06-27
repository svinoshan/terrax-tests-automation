import { expect, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class FarmerProfilePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page.getByText(/Farmer profile/i).first()).toBeVisible();
    await expect(this.page.getByText(/Full name/i).first()).toBeVisible();
  }

  async save(): Promise<void> {
    await this.page.getByRole('button', { name: /save/i })
      .or(this.page.getByText(/Save/i))
      .first()
      .click();
  }
}
