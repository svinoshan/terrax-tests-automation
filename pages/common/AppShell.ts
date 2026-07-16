import { expect, Locator, Page } from "@playwright/test";

export class AppShell {
  readonly dashboardLink: Locator;
  readonly farmerMenu: Locator;
  readonly cropsInfoMenu: Locator;
  readonly purchaseMenu: Locator;
  readonly dispatchMenu: Locator;
  readonly auditMenu: Locator;
  readonly customersMenu: Locator;
  readonly unitInfoMenu: Locator;
  readonly locationAccessOkButton: Locator;

  constructor(private readonly page: Page) {
    this.dashboardLink = this.page.getByText(/Dashboard/i).first();
    this.farmerMenu = this.page.getByText(/^Farmer$/i).first();
    this.cropsInfoMenu = this.page.getByText(/^Crops Info$/i).first();
    this.purchaseMenu = this.page.getByText(/^Purchase$/i).first();
    this.dispatchMenu = this.page.getByText(/^Dispatch$/i).first();
    this.auditMenu = this.page.getByText(/^Audit$/i).first();
    this.customersMenu = this.page.getByText(/^Customers$/i).first();
    this.unitInfoMenu = this.page.getByText(/^Unit Info$/i).first();

    this.locationAccessOkButton = this.page
      .getByRole("button", { name: /^ok$/i })
      .or(this.page.locator("button").filter({ hasText: /^ok$/i }));
  }

  async expectLoaded(): Promise<void> {
    await expect(this.dashboardLink).toBeVisible();
  }

  async dismissLocationAccessPopupIfVisible(): Promise<void> {
    const popupText = this.page.getByText(
      /To enable location access, go to your browser settings and allow location for this site/i,
    );

    try {
      await popupText.waitFor({ state: "visible", timeout: 3000 });
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
    await this.page
      .getByText(/^Profile$/i)
      .first()
      .click();
  }

  async openCropsInfo(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();
    await this.cropsInfoMenu.click();
  }

  async openCustomers(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();
    await this.customersMenu.click();
  }

  async openMainUnit(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();
    await this.unitInfoMenu.click();
    await this.page.getByRole("link", { name: /Main Unit/i }).click();
    await this.dismissLocationAccessPopupIfVisible();
  }

  // async openSubUnit(): Promise<void> {
  //   await this.dismissLocationAccessPopupIfVisible();
  //   await this.unitInfoMenu.click();
  //   await this.page.getByRole('link', { name: /Sub Unit/i }).click();
  //   await this.dismissLocationAccessPopupIfVisible();
  // }
  async openSubUnit(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();

    await this.unitInfoMenu.click();

    const subUnitLink = this.page.getByRole("link", { name: /Sub Unit/i });

    if (!(await subUnitLink.isVisible().catch(() => false))) {
      await this.unitInfoMenu.hover();
      await this.unitInfoMenu.click();
    }

    await subUnitLink.click();
    await this.dismissLocationAccessPopupIfVisible();
  }

  async openPurchase(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();
    await this.purchaseMenu.click();
  }

  async openDispatch(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();
    await this.dispatchMenu.click();
  }

  async openAudit(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();
    await this.page.getByRole("link", { name: /Audit/i }).click();
  }

  async openCreateAudit(): Promise<void> {
    await this.openAudit();
    await this.page.getByRole("link", { name: /Create Audit/i }).click();
  }

  // async openAuditMenu(): Promise<void> {
  //   await this.dismissLocationAccessPopupIfVisible();

  //   const auditMenu = this.page.getByRole("link", { name: /Audit/i }).first();

  //   await auditMenu.click();
  // }

  async openAuditCheckList(): Promise<void> {
    await this.openAudit();

    await this.page.getByRole("link", { name: /Check List/i }).click();
  }

  async openAuditResult(): Promise<void> {
    await this.openAudit();

    await this.page.getByRole("link", { name: /^Audit Result$/i }).click();
  }

  async openAuditResultSummary(): Promise<void> {
    await this.openAudit();

    await this.page
      .getByRole("link", { name: /Audit Result Summary/i })
      .click();
  }

  async openEudrMenu(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();

    const eudrMenu = this.page.getByRole("link", { name: /EUDR/i }).first();

    await eudrMenu.click();
  }

  async openEudrOperators(): Promise<void> {
    await this.openEudrMenu();

    await this.page.getByRole("link", { name: /Operators/i }).click();
  }

  async openEudrDeforestationAnalysis(): Promise<void> {
    await this.openEudrMenu();

    await this.page
      .getByRole("link", { name: /Deforestation Analysis/i })
      .click();
  }

  async openEudrDdsReports(): Promise<void> {
    await this.openEudrMenu();

    await this.page.getByRole("link", { name: /DDS Reports/i }).click();
  }

  async openReportsMenu(): Promise<void> {
    await this.dismissLocationAccessPopupIfVisible();

    await this.page.getByRole("link", { name: /Reports/i }).click();
  }

  async openStockReport(): Promise<void> {
    await this.openReportsMenu();

    await this.page.getByRole("link", { name: /Stock report/i }).click();
  }

  async openMassBalanceReport(): Promise<void> {
    await this.openReportsMenu();

    await this.page.getByRole("link", { name: /Mass balance/i }).click();
  }

  async openPurchaseSummaryReport(): Promise<void> {
    await this.openReportsMenu();

    await this.page.getByRole("link", { name: /Purchase Summary/i }).click();
  }

  async openDispatchSummaryReport(): Promise<void> {
    await this.openReportsMenu();

    await this.page.getByRole("link", { name: /Dispatch Summary/i }).click();
  }
}
