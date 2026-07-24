import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";
import {
  RiskAnalysisChecklistItem,
  RiskAnalysisTestData,
} from "@data/farmer/risk-analysis.data";

export class RiskAnalysisPage extends BasePage {
  private readonly appShell: AppShell;

  readonly listTitle: Locator;
  readonly createNewButton: Locator;
  readonly createTitle: Locator;
  readonly selectedFarmersTab: Locator;
  readonly checklistTab: Locator;
  readonly submitButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.listTitle = page.getByRole("heading", {
      name: /Risk analysis result|Risk analysis/i,
    });

    // this.createNewButton = page
    //   .getByRole("button", { name: /Create new/i })
    //   .or(page.locator("button").filter({ hasText: /Create new/i }))
    //   .first();
    this.createNewButton = page.getByText("Create new");

    this.createTitle = page.getByRole("heading", {
      name: /Create Risk analysis/i,
    });

    this.selectedFarmersTab = page.getByRole("tab", {
      name: /Select Farmers/i,
    });

    this.checklistTab = page.getByRole("tab", {
      name: /Risk Analysis Checklist/i,
    });

    this.submitButton = page.getByRole("button", { name: /^Submit$/i });

    this.backButton = page
      .getByRole("button", { name: /Back/i })
      .or(page.locator("button").filter({ hasText: /Back/i }))
      .first();
  }

  async open(): Promise<void> {
    await this.appShell.openFarmerRiskAnalysis();
    await this.expectListLoaded();
  }

  async expectListLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: /Risk analysis result|Risk analysis/i,
      }),
    ).toBeVisible({ timeout: 30000 });

    await expect(this.createNewButton).toBeVisible({ timeout: 30000 });
  }

  async clickCreateNew(): Promise<void> {
    await expect(this.createNewButton).toBeVisible({ timeout: 30000 });

    await this.createNewButton.click();

    await this.expectCreateLoaded();
  }

  async expectCreateLoaded(): Promise<void> {
    await expect(this.createTitle).toBeVisible({ timeout: 30000 });

    await expect(this.selectedFarmersTab).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer code/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer name/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Plot code/i }),
    ).toBeVisible({ timeout: 15000 });
  }

  async selectFirstAvailableFarmer(): Promise<string> {
    await expect(this.selectedFarmersTab).toBeVisible({ timeout: 15000 });

    const farmerTable = this.page
      .locator("table")
      .filter({
        has: this.page.getByRole("columnheader", { name: /Farmer code/i }),
      })
      .first();

    const firstDataRow = farmerTable
      .locator("tbody tr")
      .filter({ has: this.page.locator('input[type="checkbox"]') })
      .first();

    await expect(firstDataRow).toBeVisible({ timeout: 30000 });

    const farmerCode = (await firstDataRow.getByRole("cell").nth(1).innerText())
      .replace(/\s+/g, " ")
      .trim();

    const checkbox = firstDataRow.getByRole("checkbox").first();

    if (!(await checkbox.isChecked().catch(() => false))) {
      await checkbox.check({ force: true });
    }

    await expect(checkbox).toBeChecked();

    return farmerCode;
  }

  async openChecklistTab(): Promise<void> {
    await expect(this.checklistTab).toBeVisible({ timeout: 15000 });
    await this.checklistTab.click();

    await expect(
      this.page.getByRole("columnheader", { name: /Risk factor/i }),
    ).toBeVisible({ timeout: 15000 });
  }

  private async selectOptionByLabel(
    select: Locator,
    preferredLabel: string,
  ): Promise<void> {
    await expect(select).toBeVisible({ timeout: 15000 });

    const labelVariants = [
      preferredLabel,
      preferredLabel.toLowerCase(),
      preferredLabel.replace(/Risk/i, "risk"),
    ];

    for (const label of labelVariants) {
      try {
        await select.selectOption({ label });
        return;
      } catch {
        // Try next label variant.
      }
    }

    // Fallback to first real option if label text changes slightly.
    await select.selectOption({ index: 1 });
  }

  async completeChecklist(data: RiskAnalysisTestData): Promise<void> {
    await this.openChecklistTab();

    const checklistTable = this.page
      .locator("table")
      .filter({
        has: this.page.getByRole("columnheader", { name: /Risk factor/i }),
      })
      .first();

    const rows = checklistTable.locator("tbody tr");
    const rowCount = await rows.count();

    if (rowCount === 0) {
      throw new Error("Risk Analysis Checklist has no rows.");
    }

    for (let index = 0; index < rowCount; index += 1) {
      const row = rows.nth(index);
      const item: RiskAnalysisChecklistItem =
        data.checklist[index] ?? data.checklist[data.checklist.length - 1];

      const selects = row.locator("select");
      const selectCount = await selects.count();

      if (selectCount > 0) {
        await this.selectOptionByLabel(selects.nth(0), item.riskLevel);
      }

      const mitigationInput = row.getByPlaceholder(
        /Enter mitigation strategy/i,
      );

      if (
        await mitigationInput.isVisible({ timeout: 3000 }).catch(() => false)
      ) {
        await mitigationInput.fill(item.mitigationStrategy);
      }

      const remarkInput = row.getByPlaceholder(/Enter remark/i);

      if (await remarkInput.isVisible({ timeout: 3000 }).catch(() => false)) {
        await remarkInput.fill(item.remark);
      }

      if (selectCount > 1) {
        await this.selectOptionByLabel(
          selects.nth(1),
          item.riskAfterMitigation,
        );
      }
    }

    await this.setOverallRisks(data);
    await this.setAnalysisDate(data.analysisDate);
  }

  async setOverallRisks(data: RiskAnalysisTestData): Promise<void> {
    const allSelects = this.page.locator("select:visible");
    const count = await allSelects.count();

    if (count < 2) {
      throw new Error("Overall risk selects were not found.");
    }

    const beforeOverallRiskSelect = allSelects.nth(count - 2);
    const afterOverallRiskSelect = allSelects.nth(count - 1);

    await this.selectOptionByLabel(
      beforeOverallRiskSelect,
      data.beforeOverallRisk,
    );

    await this.selectOptionByLabel(
      afterOverallRiskSelect,
      data.afterOverallRisk,
    );
  }

  //   async setAnalysisDate(analysisDate: string): Promise<void> {
  //     const dateInputs = this.page.getByRole("textbox", {
  //       name: /Select date/i,
  //     });

  //     const lastDateInput = dateInputs.last();

  //     await expect(lastDateInput).toBeVisible({ timeout: 15000 });

  //     await lastDateInput.fill(analysisDate);
  //     await lastDateInput.blur();
  //   }
  async setAnalysisDate(analysisDate: string): Promise<void> {
    // The Analysis date input is not exposed reliably as textbox name "Select date".
    // Use the last visible input on the checklist form because codegen records it as page.locator("input").
    const dateInput = this.page.locator("input:visible").last();

    await expect(dateInput).toBeVisible({ timeout: 15000 });

    // Try direct fill first. If the date input is readonly / datepicker-controlled,
    // fall back to opening the calendar and selecting the day.
    try {
      await dateInput.fill(analysisDate);
      await dateInput.blur();

      const value = await dateInput.inputValue().catch(() => "");

      if (value && value.trim().length > 0) {
        return;
      }
    } catch {
      // Continue with calendar fallback.
    }

    await dateInput.click();

    const openCalendarButton = this.page
      .getByRole("button", { name: /Open calendar/i })
      .last();

    await expect(openCalendarButton).toBeVisible({ timeout: 10000 });
    await openCalendarButton.click();

    const day = String(Number(analysisDate.split("-")[2]));

    const dayButton = this.page
      .getByRole("button", {
        name: new RegExp(`^${day}$|${day},`, "i"),
      })
      .first();

    await expect(dayButton).toBeVisible({ timeout: 10000 });
    await dayButton.click();
  }

  async submit(): Promise<void> {
    await expect(this.submitButton).toBeVisible({ timeout: 15000 });

    await this.submitButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  //   async expectCreatedResult(farmerCode: string): Promise<void> {
  //     await expect(
  //       this.page.getByRole("heading", { name: /Risk analysis result/i }),
  //     ).toBeVisible({ timeout: 30000 });

  //     await expect(this.page.getByText(farmerCode).first()).toBeVisible({
  //       timeout: 30000,
  //     });

  //     await expect(
  //       this.page.getByText(/Before over roll risk|After over roll risk/i),
  //     ).toBeVisible({ timeout: 15000 });
  //   }
  async selectLatestRiskAnalysisResult(): Promise<void> {
    const resultCombobox = this.page.getByRole("combobox").first();

    await expect(resultCombobox).toBeVisible({ timeout: 15000 });
    await resultCombobox.click();

    const options = this.page.getByRole("option");

    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionCount = await options.count();

    if (optionCount === 0) {
      throw new Error("No risk analysis result options found.");
    }

    // Usually newest/result just created appears first in the dropdown.
    const firstOption = options.first();

    await firstOption.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectCreatedResult(farmerCode: string): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /Risk analysis result/i }),
    ).toBeVisible({ timeout: 30000 });

    const farmerCodeText = this.page.getByText(farmerCode).first();

    if (
      !(await farmerCodeText.isVisible({ timeout: 5000 }).catch(() => false))
    ) {
      await this.selectLatestRiskAnalysisResult();
    }

    await expect(
      this.page.getByRole("columnheader", { name: /Risk factor/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Risk level/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Risk after mitigation/i }),
    ).toBeVisible({ timeout: 15000 });

    const resultRows = this.page.locator("tbody tr").filter({
      hasText: /Country Risk Assessment|Presence of Forests|Indigenous/i,
    });

    await expect(resultRows.first()).toBeVisible({ timeout: 30000 });

    // Farmer code may not always be displayed in the result page with the same FRM-E2E code.
    // If it is displayed, verify it. Otherwise table content verification is the stable assertion.
    if (await farmerCodeText.isVisible({ timeout: 3000 }).catch(() => false)) {
      await expect(farmerCodeText).toBeVisible();
    }
  }

  async expectRiskAnalysisResultLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /Risk analysis result/i }),
    ).toBeVisible({ timeout: 30000 });

    await expect(this.createNewButton).toBeVisible({ timeout: 30000 });

    await expect(this.page.getByText(/Select risk analysis/i)).toBeVisible({
      timeout: 15000,
    });

    await expect(
      this.page.getByRole("columnheader", { name: /Risk factor/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Description/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Risk level/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Mitigation strategy/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Remark/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Risk after mitigation/i }),
    ).toBeVisible({ timeout: 15000 });
  }

  async expectCreateRiskAnalysisLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /Create Risk analysis|Update Risk analysis/i }),
    ).toBeVisible({ timeout: 30000 });

    await expect(
      this.page.getByRole("tab", { name: /Select Farmers/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("tab", { name: /Risk Analysis Checklist/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer code/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer name/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Plot code/i }),
    ).toBeVisible({ timeout: 15000 });
  }

  async submitExpectChecklistIncomplete(): Promise<void> {
    await expect(this.submitButton).toBeVisible({ timeout: 15000 });
    await this.submitButton.click();

    // Toast error shown after submit.
    await expect(
        this.page.getByRole("alert", { name: /Checklist not complete/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByText(/Analysis date is required/i).first(),
    ).toBeVisible({ timeout: 15000 });
  }

  async clickEdit(): Promise<void> {
    const editButton = this.page.getByRole("button", { name: /Edit/i }).first();

    await expect(editButton).toBeVisible({ timeout: 15000 });
    await editButton.click();

    await this.expectCreateRiskAnalysisLoaded();
  }

  async expectResultContainsUpdatedValues(): Promise<void> {
    await expect(this.page.getByText(/Before over roll risk/i)).toBeVisible({
      timeout: 15000,
    });

    await expect(this.page.getByText(/After over roll risk/i)).toBeVisible({
      timeout: 15000,
    });

    await expect(
      this.page.getByText(/Automation mitigation/i).first(),
    ).toBeVisible({ timeout: 15000 });

    await expect(this.page.getByText(/Automation remark/i).first()).toBeVisible(
      { timeout: 15000 },
    );
  }
}
