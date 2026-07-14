import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AuditTestData } from "@data/audit/audit.data";

export type AuditRequiredField =
  | "fieldOfficer"
  | "planDate"
  | "auditNumber"
  | "farmerRows";

export class CreateAuditPage extends BasePage {
  readonly pageTitle: Locator;

  readonly fieldOfficerInput: Locator;
  readonly planDateInput: Locator;
  readonly auditNumberInput: Locator;
  readonly saveButton: Locator;
  readonly clearButton: Locator;
  readonly closeButton: Locator;
  readonly updateButton: Locator;
  readonly cancelButton: Locator;
  readonly confirmCancelButton: Locator;

  readonly farmerSearchInput: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole("heading", { name: /Create Audit/i });

    this.fieldOfficerInput = page
      .getByRole("combobox", { name: /Field officer|Farmer/i })
      .first();

    this.planDateInput = page.getByRole("textbox", { name: /Enter date/i });

    this.auditNumberInput = page.getByRole("textbox", {
      name: /Enter audit number/i,
    });

    this.saveButton = page.getByRole("button", { name: /Save/i }).first();
    this.clearButton = page.getByRole("button", { name: /Clear/i }).first();
    this.closeButton = page.getByRole("button", { name: /Close/i }).first();

    this.updateButton = page.getByRole("button", { name: /Update/i }).first();

    this.cancelButton = page.getByRole("button", { name: /Cancel/i }).first();

    this.confirmCancelButton = page.getByRole("button", {
      name: /Yes,\s*Cancel it!/i,
    });

    this.farmerSearchInput = page
      .getByRole("searchbox")
      .or(page.getByPlaceholder("Search"))
      .first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.fieldOfficerInput).toBeVisible({ timeout: 10000 });
    await expect(this.planDateInput).toBeVisible({ timeout: 10000 });
    await expect(this.auditNumberInput).toBeVisible({ timeout: 10000 });
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Plot code/i }),
    ).toBeVisible();
  }

  async selectFieldOfficer(fieldOfficer: string): Promise<void> {
    await this.fieldOfficerInput.click();
    await this.fieldOfficerInput.fill(fieldOfficer).catch(() => {});

    const option = this.page
      .getByRole("option")
      .filter({ hasText: fieldOfficer })
      .first();

    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();

    await expect
      .poll(async () => (await this.fieldOfficerInput.inputValue()).trim(), {
        timeout: 10000,
        message: "Expected Field officer input to contain selected officer",
      })
      .toContain(fieldOfficer);
  }

  async setPlanDate(planDate: string): Promise<void> {
    await this.planDateInput.fill(planDate);
    await this.planDateInput.blur();

    await expect(this.planDateInput).toHaveValue(planDate, {
      timeout: 10000,
    });
  }

  async fillAuditNumber(auditNumber: string): Promise<void> {
    await this.auditNumberInput.fill(auditNumber);
    await expect(this.auditNumberInput).toHaveValue(auditNumber);
  }

  async selectFarmerRows(count: number): Promise<void> {
    // Farmer list appears after selecting Field officer.
    await expect
      .poll(
        async () =>
          await this.page
            .getByRole("row")
            .filter({ has: this.page.getByRole("checkbox") })
            .count(),
        {
          timeout: 30000,
          message: "Expected farmer rows to load after selecting Field officer",
        },
      )
      .toBeGreaterThan(1);

    const checkboxes = this.page
      .getByRole("row")
      .filter({ hasText: /\d/ })
      .getByRole("checkbox");

    const checkboxCount = await checkboxes.count();

    let selectedCount = 0;

    for (let index = 0; index < checkboxCount; index += 1) {
      const checkbox = checkboxes.nth(index);

      const isVisible = await checkbox.isVisible().catch(() => false);
      const isEnabled = await checkbox.isEnabled().catch(() => false);

      if (!isVisible || !isEnabled) {
        continue;
      }

      await checkbox.check();

      selectedCount += 1;

      if (selectedCount >= count) {
        break;
      }
    }

    if (selectedCount < count) {
      throw new Error(
        `Expected to select ${count} farmer rows, but selected ${selectedCount}.`,
      );
    }

    await expect(
      this.page.getByText(new RegExp(`Select count\\s*:\\s*${count}`)),
    ).toBeVisible({
      timeout: 10000,
    });
  }

  async getFarmerRowCount(): Promise<number> {
    return await this.page
      .getByRole("row")
      .filter({ has: this.page.getByRole("checkbox") })
      .count();
  }

  async waitForFarmerRowsToLoad(): Promise<boolean> {
    try {
      await expect
        .poll(
          async () => {
            const rows = this.page
              .getByRole("row")
              .filter({ has: this.page.getByRole("checkbox") });

            const count = await rows.count();

            // One checkbox row may be the header row. We need at least one data row.
            return count;
          },
          {
            timeout: 10000,
            message:
              "Expected farmer rows to load after selecting Field officer",
          },
        )
        .toBeGreaterThan(1);

      return true;
    } catch {
      return false;
    }
  }

  async openFieldOfficerOptions(searchText?: string): Promise<Locator[]> {
    await this.fieldOfficerInput.click();

    if (searchText) {
      await this.fieldOfficerInput.fill(searchText).catch(() => {});
    }

    const options = this.page.getByRole("option");

    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionCount = await options.count();
    const optionLocators: Locator[] = [];

    for (let index = 0; index < optionCount; index += 1) {
      optionLocators.push(options.nth(index));
    }

    return optionLocators;
  }

  async selectFieldOfficerByOptionText(optionText: string): Promise<void> {
    await this.fieldOfficerInput.click();

    const option = this.page
      .getByRole("option")
      .filter({ hasText: optionText })
      .first();

    await expect(option).toBeVisible({ timeout: 10000 });
    await option.click();

    await expect
      .poll(async () => (await this.fieldOfficerInput.inputValue()).trim(), {
        timeout: 10000,
        message: "Expected Field officer input to contain selected officer",
      })
      .not.toBe("");
  }

  async selectFieldOfficerWithFarmerRows(
    preferredFieldOfficer?: string,
  ): Promise<string> {
    const triedOfficers = new Set<string>();

    // 1. Try configured/preferred officer first, if provided.
    if (preferredFieldOfficer) {
      try {
        await this.selectFieldOfficerByOptionText(preferredFieldOfficer);

        if (await this.waitForFarmerRowsToLoad()) {
          return preferredFieldOfficer;
        }

        triedOfficers.add(preferredFieldOfficer);
      } catch {
        triedOfficers.add(preferredFieldOfficer);
      }
    }

    // 2. Try available dropdown options one by one.
    await this.fieldOfficerInput.click();

    const options = this.page.getByRole("option");
    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .filter((text) => !triedOfficers.has(text));

    // Close/open per option because Angular overlays often detach after selection.
    await this.page.keyboard.press("Escape").catch(() => {});

    for (const officerName of optionTexts) {
      await this.selectFieldOfficerByOptionText(officerName);

      if (await this.waitForFarmerRowsToLoad()) {
        return officerName;
      }

      triedOfficers.add(officerName);
    }

    throw new Error(
      `No field officer option loaded farmer rows. Tried: ${Array.from(
        triedOfficers,
      ).join(", ")}`,
    );
  }

  //   async fillForm(data: AuditTestData): Promise<void> {
  //     await this.selectFieldOfficer(data.fieldOfficer);
  //     await this.setPlanDate(data.planDate);
  //     await this.fillAuditNumber(data.auditNumber);
  //     await this.selectFarmerRows(data.farmerRowsToSelect);
  //   }
  async fillForm(data: AuditTestData): Promise<{
    selectedFieldOfficer: string;
  }> {
    const selectedFieldOfficer = await this.selectFieldOfficerWithFarmerRows(
      data.fieldOfficer,
    );

    await this.setPlanDate(data.planDate);
    await this.fillAuditNumber(data.auditNumber);
    await this.selectFarmerRows(data.farmerRowsToSelect);

    return {
      selectedFieldOfficer,
    };
  }

  async save(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectAuditSavedToast(): Promise<void> {
    await expect(this.page.getByText(/Success|success/i).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async fillFormExcept(
    data: AuditTestData,
    missingFields: AuditRequiredField[],
  ): Promise<{
    selectedFieldOfficer?: string;
  }> {
    let selectedFieldOfficer: string | undefined;

    if (!missingFields.includes("fieldOfficer")) {
      selectedFieldOfficer = await this.selectFieldOfficerWithFarmerRows(
        data.fieldOfficer,
      );
    }

    if (!missingFields.includes("planDate")) {
      await this.setPlanDate(data.planDate);
    }

    if (!missingFields.includes("auditNumber")) {
      await this.fillAuditNumber(data.auditNumber);
    }

    if (
      !missingFields.includes("farmerRows") &&
      !missingFields.includes("fieldOfficer")
    ) {
      await this.selectFarmerRows(data.farmerRowsToSelect);
    }

    return {
      selectedFieldOfficer,
    };
  }

  async clickSaveExpectValidation(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();

    await this.page.waitForTimeout(500);
  }

  async expectValidationMessage(field: AuditRequiredField): Promise<void> {
    const messageMap: Record<AuditRequiredField, RegExp> = {
      fieldOfficer:
        /Field officer Is required|Field officer is required|Field officer.*required/i,
      planDate: /Plan date Is required|Plan date is required|Date is required/i,
      auditNumber:
        /Audit number Is required|Audit number is required|Audit number.*required/i,
      farmerRows:
        /Select at least one farmer|Farmer.*required|Please select.*farmer|Select farmer/i,
    };

    await expect(this.page.getByText(messageMap[field]).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async expectUpdateLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /Create Audit|Update Audit/i }),
    ).toBeVisible({ timeout: 30000 });

    await expect(this.auditNumberInput).toBeVisible({ timeout: 10000 });
    await expect(this.planDateInput).toBeVisible({ timeout: 10000 });
  }

  async updateAuditNumber(auditNumber: string): Promise<void> {
    await this.auditNumberInput.click();
    await this.auditNumberInput.press(
      process.platform === "darwin" ? "Meta+A" : "Control+A",
    );
    await this.auditNumberInput.press("Backspace");
    await this.auditNumberInput.fill(auditNumber);

    await expect(this.auditNumberInput).toHaveValue(auditNumber, {
      timeout: 10000,
    });
  }

  async updatePlanDate(planDate: string): Promise<void> {
    await this.planDateInput.click();
    await this.planDateInput.press(
      process.platform === "darwin" ? "Meta+A" : "Control+A",
    );
    await this.planDateInput.press("Backspace");
    await this.planDateInput.fill(planDate);
    await this.planDateInput.blur();

    await expect(this.planDateInput).toHaveValue(planDate, {
      timeout: 10000,
    });
  }

  async update(): Promise<void> {
    await expect(this.updateButton).toBeVisible({ timeout: 10000 });
    await this.updateButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async cancelAudit(): Promise<void> {
    await expect(this.cancelButton).toBeVisible({ timeout: 10000 });
    await this.cancelButton.click();

    await expect(this.confirmCancelButton).toBeVisible({ timeout: 10000 });
    await this.confirmCancelButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }
}
