import { expect, Locator, Page } from '@playwright/test';

export class AppShell {
  readonly dashboardLink: Locator;
  readonly farmerMenu: Locator;
  readonly cropsInfoMenu: Locator;
  readonly purchaseMenu: Locator;
  readonly dispatchMenu: Locator;
  readonly auditMenu: Locator;
  readonly customersMenu: Locator;
  readonly locationAccessOkButton: Locator;

  constructor(private readonly page: Page) {
    this.dashboardLink = this.page.getByText(/Dashboard/i).first();
    this.farmerMenu = this.page.getByText(/^Farmer$/i).first();
    this.cropsInfoMenu = this.page.getByText(/^Crops Info$/i).first();
    this.purchaseMenu = this.page.getByText(/^Purchase$/i).first();
    this.dispatchMenu = this.page.getByText(/^Dispatch$/i).first();
    this.auditMenu = this.page.getByText(/^Audit$/i).first();
    this.customersMenu = this.page.getByText(/^Customers$/i).first();

    this.locationAccessOkButton = this.page
      .getByRole('button', { name: /^ok$/i })
      .or(this.page.locator('button').filter({ hasText: /^ok$/i }));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.dashboardLink).toBeVisible();
  }

  async dismissLocationAccessPopupIfVisible(): Promise<void> {
    const popupText = this.page.getByText(
      /To enable location access, go to your browser settings and allow location for this site/i
    );

    try {
      await popupText.waitFor({ state: 'visible', timeout: 3000 });
      await this.locationAccessOkButton.click();
      await expect(popupText).toBeHidden({ timeout: 5000 });
    } catch {
      // Popup did not appear. Continue test.
    }
  }

  async openDashboard(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();
    await this.dashboardLink.click();
  }

  async openFarmerProfile(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();
    await this.farmerMenu.click();
    await this.page.getByText(/^Profile$/i).first().click();
  }

  async openCropsInfo(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();
    await this.cropsInfoMenu.click();
  }

  async openCustomers(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();
    await this.customersMenu.click();
  }
}
