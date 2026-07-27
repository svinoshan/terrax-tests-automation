import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";
import { RiskAnalysisTemplateTestData } from "@data/farmer/risk-analysis-template.data";

export class RiskAnalysisTemplatePage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly addNewButton: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole("heading", {
      name: /Risk analysis template/i,
    });

    this.addNewButton = page
      .getByRole("button", { name: /\+?\s*Add new/i })
      .or(page.getByText(/^Add new$/i))
      .first();
  }

  async open(): Promise<void> {
    await this.appShell.openFarmerRiskAnalysisTemplate();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });

    await expect(this.addNewButton).toBeVisible({ timeout: 30000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Risk factor/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Description/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Status/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Action/i }),
    ).toBeVisible({ timeout: 15000 });
  }

  private riskFactorInput(): Locator {
    return this.page.locator('input[type="text"]:visible').first();
  }

  private descriptionInput(): Locator {
    return this.page
      .getByRole("textbox", { name: /Enter additional evidence/i })
      .or(this.page.locator("textarea:visible"))
      .first();
  }

  private addButton(): Locator {
    return this.page.getByRole("button", { name: /^\+?\s*Add$/i }).last();
  }

  private updateButton(): Locator {
    return this.page.getByRole("button", { name: /Update/i }).last();
  }

  private cancelButton(): Locator {
    return this.page.getByRole("button", { name: /Cancel/i }).last();
  }

  private closeButton(): Locator {
    return this.page
      .getByRole("button", { name: /close/i })
      .or(this.page.locator("button").filter({ hasText: /^×$/ }))
      .first();
  }

  async openCreatePanel(): Promise<void> {
    await expect(this.addNewButton).toBeVisible({ timeout: 15000 });
    await this.addNewButton.click();

    await expect(
      this.page.getByRole("heading", { name: /Create template/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(this.riskFactorInput()).toBeVisible({ timeout: 15000 });
    await expect(this.descriptionInput()).toBeVisible({ timeout: 15000 });
  }

  async expectCreatePanelLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /Create template/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(this.riskFactorInput()).toBeVisible({ timeout: 15000 });
    await expect(this.descriptionInput()).toBeVisible({ timeout: 15000 });

    await expect(this.addButton()).toBeVisible({ timeout: 15000 });
    await expect(this.cancelButton()).toBeVisible({ timeout: 15000 });
  }

  async closePanel(): Promise<void> {
    const close = this.closeButton();

    if (await close.isVisible({ timeout: 3000 }).catch(() => false)) {
      await close.click();
      return;
    }

    await this.cancelButton().click();
  }

  async fillTemplate(data: RiskAnalysisTemplateTestData): Promise<void> {
    await expect(this.riskFactorInput()).toBeVisible({ timeout: 15000 });
    await this.riskFactorInput().fill(data.riskFactor);

    await expect(this.descriptionInput()).toBeVisible({ timeout: 15000 });
    await this.descriptionInput().fill(data.description);

    await expect(this.riskFactorInput()).toHaveValue(data.riskFactor);
    await expect(this.descriptionInput()).toHaveValue(data.description);
  }

  async addTemplate(): Promise<void> {
    await expect(this.addButton()).toBeVisible({ timeout: 15000 });
    await this.addButton().click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async submitEmptyTemplateExpectValidation(): Promise<void> {
    await expect(this.addButton()).toBeVisible({ timeout: 15000 });
    await this.addButton().click();

    await expect(
      this.page.getByText(/Risk factor Is required/i).first(),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByText(/Description Is required/i).first(),
    ).toBeVisible({ timeout: 15000 });
  }

  async searchByText(value: string): Promise<void> {
    const searchInput = this.page
      .getByRole("searchbox")
      .or(
        this.page
          .locator('input[type="search"], input[placeholder*="Search"]')
          .first(),
      );

    if (await searchInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await searchInput.fill("");
      await searchInput.fill(value);
      await this.page.waitForTimeout(500);
    }
  }

  async getTemplateRow(riskFactor: string): Promise<Locator> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: riskFactor })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    return row;
  }

  async expectTemplateVisible(riskFactor: string): Promise<void> {
    await expect(this.page.getByText(riskFactor).first()).toBeVisible({
      timeout: 30000,
    });
  }

  async expectTemplateRowContains(
    riskFactor: string,
    expectedText: string | RegExp,
  ): Promise<void> {
    const row = await this.getTemplateRow(riskFactor);

    await expect(row).toContainText(expectedText);
  }

  async clickEdit(riskFactor: string): Promise<void> {
    const row = await this.getTemplateRow(riskFactor);
    const actionCell = row.getByRole("cell").last();

    const editAction = actionCell
      .locator("button, a, .me-2.p-2, .mat-mdc-tooltip-trigger")
      .first();

    if (await editAction.isVisible({ timeout: 3000 }).catch(() => false)) {
      await editAction.click();
    } else {
      await actionCell.click();
    }

    await expect(
      this.page.getByRole("heading", { name: /Update template/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(this.riskFactorInput()).toBeVisible({ timeout: 15000 });
    await expect(this.descriptionInput()).toBeVisible({ timeout: 15000 });
  }

  async updateDescription(updatedDescription: string): Promise<void> {
    await expect(this.descriptionInput()).toBeVisible({ timeout: 15000 });

    await this.descriptionInput().fill(updatedDescription);

    await expect(this.descriptionInput()).toHaveValue(updatedDescription);
  }

  async updateTemplate(): Promise<void> {
    await expect(this.updateButton()).toBeVisible({ timeout: 15000 });
    await this.updateButton().click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectSuccessToastIfVisible(): Promise<void> {
    await expect(
      this.page.getByText(/Success|success|Created|Updated/i).first(),
    ).toBeVisible({ timeout: 10000 });
  }

  async expectTemplateStatus(
    riskFactor: string,
    expectedStatus: string | RegExp,
  ): Promise<void> {
    const row = await this.getTemplateRow(riskFactor);

    // Columns:
    // 0 Risk factor
    // 1 Description
    // 2 Status
    // 3 Action
    const statusCell = row.getByRole("cell").nth(2);

    await expect(statusCell).toContainText(expectedStatus, {
      timeout: 15000,
    });
  }

  async clickDelete(riskFactor: string): Promise<void> {
    const row = await this.getTemplateRow(riskFactor);

    const actionCell = row.getByRole("cell").last();

    // Delete icon appears as red/trash action.
    const deleteAction = actionCell
      .locator(
        'button, a, .mat-mdc-tooltip-trigger, [class*="trash"], [class*="delete"]',
      )
      .last();

    if (await deleteAction.isVisible({ timeout: 3000 }).catch(() => false)) {
      await deleteAction.click();
      return;
    }

    // Fallback: click last action cell if icon does not expose stable role/class.
    await actionCell.click();
  }

  async confirmDeleteIfVisible(): Promise<void> {
    const confirmButton = this.page
      .getByRole("button", {
        name: /Yes|Delete|Confirm|Deactivate/i,
      })
      .first();

    if (await confirmButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await confirmButton.click();

      await this.page
        .waitForLoadState("networkidle", { timeout: 30000 })
        .catch(() => {});
    }
  }

  async deactivateTemplate(riskFactor: string): Promise<void> {
    await this.clickDelete(riskFactor);

    await this.confirmDeleteIfVisible();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }
}
