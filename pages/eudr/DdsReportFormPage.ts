import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";

export type DdsActivityType =
  | "Import"
  | "Export"
  | "Trade"
  | "Domestic production";

export class DdsReportFormPage extends BasePage {
  readonly pageTitle: Locator;

  readonly operatorInput: Locator;
  readonly tradingCompanyInput: Locator;
  readonly ddsDateInput: Locator;
  readonly activityTypeInput: Locator;
  readonly countryOfActivityInput: Locator;
  readonly countryOfEntryInput: Locator;

  readonly addRowButton: Locator;
  readonly saveButton: Locator;
  readonly updateButton: Locator;
  readonly backButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole("heading", {
      name: /Create DDS Report|Update DDS Report|DDS Report/i,
    });

    this.operatorInput = page.getByRole("combobox").first();

    this.tradingCompanyInput = page.getByRole("textbox", {
      name: /Enter trading company/i,
    });

    this.ddsDateInput = page.getByRole("textbox", { name: 'Select date' });

    // DDS header combobox order:
    // 0 = Operator
    // 1 = Activity type
    // 2 = Country of activity
    // 3 = Country of entry
    //
    // Do not filter Activity type by visible text because it is empty before selection.
    this.activityTypeInput = page.getByRole("combobox").nth(1);

    this.countryOfActivityInput = page.getByRole("combobox").nth(2);

    this.countryOfEntryInput = page.getByRole("combobox").nth(3);

    this.addRowButton = page.getByRole("button", { name: /Add row/i });

    this.saveButton = page.getByRole("button", { name: /Save/i }).first();

    this.updateButton = page.getByRole("button", { name: /Update/i }).first();

    this.backButton = page.getByRole("button", { name: /Back/i }).first();

    this.cancelButton = page.getByRole("button", { name: /Cancel/i }).first();
  }

  async expectCreateLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /Create DDS Report/i }),
    ).toBeVisible({ timeout: 30000 });

    await expect(this.operatorInput).toBeVisible({ timeout: 10000 });
    await expect(this.tradingCompanyInput).toBeVisible({ timeout: 10000 });
    await expect(this.ddsDateInput).toBeVisible({ timeout: 10000 });
    await expect(this.addRowButton).toBeVisible({ timeout: 10000 });

    await this.expectCommodityColumnsVisible();
  }

  async expectUpdateLoaded(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'Update DDS Report' }),
    ).toBeVisible({ timeout: 30000 });

    await expect(this.operatorInput).toBeVisible({ timeout: 10000 });
    await expect(this.tradingCompanyInput).toBeVisible({ timeout: 10000 });
    await expect(this.ddsDateInput).toBeVisible({ timeout: 10000 });
    await expect(this.addRowButton).toBeVisible({ timeout: 10000 });
    await expect(this.updateButton).toBeVisible({ timeout: 10000 });

    await this.expectCommodityColumnsVisible();
  }

  async expectCommodityColumnsVisible(): Promise<void> {
    await expect(
      this.page.getByRole("columnheader", { name: /^Crop$/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /HS Code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Scientific name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Country of production/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Production date/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Net mass/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /UOM/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Farmers/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Geometry/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Action/i }),
    ).toBeVisible();
  }

  async selectOperatorWithFallback(
    preferredOperator?: string,
  ): Promise<string> {
    const tried = new Set<string>();

    if (preferredOperator) {
      try {
        await this.operatorInput.click();
        await this.operatorInput.fill(preferredOperator).catch(() => {});

        const preferredOption = this.page
          .getByRole("option")
          .filter({ hasText: preferredOperator })
          .first();

        await expect(preferredOption).toBeVisible({ timeout: 5000 });

        const selectedText = (await preferredOption.innerText())
          .replace(/\s+/g, " ")
          .trim();

        await preferredOption.click();

        return selectedText;
      } catch {
        tried.add(preferredOperator);
        await this.page.keyboard.press("Escape").catch(() => {});
      }
    }

    await this.operatorInput.click();

    const options = this.page.getByRole("option");
    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .filter((text) => !tried.has(text));

    if (optionTexts.length === 0) {
      throw new Error("No DDS operator options found.");
    }

    const selectedText = optionTexts[0];

    await this.page
      .getByRole("option")
      .filter({ hasText: selectedText })
      .first()
      .click();

    return selectedText;
  }

  async setTradingCompany(value: string): Promise<void> {
    await this.tradingCompanyInput.fill(value);
    await expect(this.tradingCompanyInput).toHaveValue(value);
  }

  async setDdsDate(value: string): Promise<void> {
    await this.ddsDateInput.fill(value);
    await expect(this.ddsDateInput).toHaveValue(value);
  }

  async selectActivityType(activityType: DdsActivityType): Promise<void> {
    await expect(this.activityTypeInput).toBeVisible({ timeout: 10000 });
    await this.activityTypeInput.click();

    const option = this.page
      .getByRole("option")
      .filter({ hasText: activityType })
      .first();

    await expect(option).toBeVisible({ timeout: 10000 });
    await option.click();

    await expect(this.activityTypeInput).toContainText(
      new RegExp(activityType.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"),
      { timeout: 10000 },
    );
  }

  async selectCountryOfActivityWithFallback(
    preferredCountry?: string,
  ): Promise<string> {
    await expect(this.countryOfActivityInput).toBeEnabled({ timeout: 10000 });

    return await this.selectOptionFromCombobox(
      this.countryOfActivityInput,
      preferredCountry ?? "Spain",
      "countryOfActivity",
    );
  }

  async selectCountryOfEntryWithFallback(
    preferredCountry?: string,
  ): Promise<string> {
    await expect(this.countryOfEntryInput).toBeEnabled({ timeout: 10000 });

    return await this.selectOptionFromCombobox(
      this.countryOfEntryInput,
      preferredCountry ?? "Spain",
      "countryOfEntry",
    );
  }

  private async selectOptionFromCombobox(
    combobox: Locator,
    preferredText: string,
    fieldName: string,
  ): Promise<string> {
    const tried = new Set<string>();

    try {
      await combobox.click();

      const preferredOption = this.page
        .getByRole("option")
        .filter({ hasText: preferredText })
        .first();

      await expect(preferredOption).toBeVisible({ timeout: 5000 });

      const selectedText = (await preferredOption.innerText())
        .replace(/\s+/g, " ")
        .trim();

      await preferredOption.click();

      return selectedText;
    } catch {
      tried.add(preferredText);
      await this.page.keyboard.press("Escape").catch(() => {});
    }

    await combobox.click();

    const options = this.page.getByRole("option");
    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .filter((text) => !tried.has(text));

    if (optionTexts.length === 0) {
      throw new Error(`No options found for ${fieldName}.`);
    }

    const selectedText = optionTexts[0];

    await this.page
      .getByRole("option")
      .filter({ hasText: selectedText })
      .first()
      .click();

    return selectedText;
  }

  async expectActivityCountryState(
    activityType: DdsActivityType,
  ): Promise<void> {
    if (activityType === "Import") {
      await expect(this.countryOfActivityInput).toBeEnabled({
        timeout: 10000,
      });
      await expect(this.countryOfEntryInput).toBeEnabled({ timeout: 10000 });
      return;
    }

    if (activityType === "Export") {
      await expect(this.countryOfActivityInput).toBeDisabled({
        timeout: 10000,
      });
      await expect(this.countryOfEntryInput).toBeDisabled({ timeout: 10000 });
      return;
    }

    await expect(this.countryOfActivityInput).toBeEnabled({ timeout: 10000 });
    await expect(this.countryOfEntryInput).toBeDisabled({ timeout: 10000 });
  }

  async addCommodityRow(): Promise<void> {
    await expect(this.addRowButton).toBeVisible({ timeout: 10000 });
    await this.addRowButton.click();

    await expect(
      this.page
        .getByRole("row")
        .filter({ hasText: /Select product|No Geometry|Select Farmers/i })
        .last(),
    ).toBeVisible({ timeout: 10000 });
  }

  async fillFirstCommodityRow(options?: {
    productionDate?: string;
    netMass?: string;
  }): Promise<void> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: /Select product|No Geometry|Select Farmers/i })
      .last();

    await expect(row).toBeVisible({ timeout: 10000 });

    await row.getByRole("combobox").first().selectOption({ index: 1 });

    await row.getByRole("combobox").nth(1).selectOption({ index: 0 });

    const productionDateInput = row.locator('input[type="date"]').first();
    await productionDateInput.fill(
      options?.productionDate ?? new Date().toISOString().slice(0, 10),
    );

    const netMassInput = row.getByRole("spinbutton").first();
    await netMassInput.fill(options?.netMass ?? "12");

    await row.getByRole("combobox").last().selectOption({ index: 0 });
  }

  async deleteLastCommodityRow(): Promise<void> {
    const row = this.page
      .locator("tbody tr")
      .filter({ hasText: /Select product|No Geometry|Select Farmers/i })
      .last();

    await expect(row).toBeVisible({ timeout: 10000 });

    const deleteAction = row
      .locator(".text-danger, .action-set, button, a")
      .last();

    await expect(deleteAction).toBeVisible({ timeout: 10000 });
    await deleteAction.click();

    const confirmButton = this.page.getByRole("button", {
      name: /Yes,\s*delete it!/i,
    });

    await expect(confirmButton).toBeVisible({ timeout: 10000 });
    await confirmButton.click();
  }

  async openSelectFarmersModal(): Promise<void> {
    await this.page
      .getByText(/Select Farmers/i)
      .first()
      .click();

    await expect(this.page.getByText(/Select farmer lands/i)).toBeVisible({
      timeout: 15000,
    });
    await expect(
      this.page.getByRole("columnheader", { name: /farmer name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Plot code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Land name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Risk analysis/i }),
    ).toBeVisible();
  }

  async selectFirstAvailableFarmerLand(): Promise<void> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: /Polygon|Point|Not found|Risk/i })
      .first();

    await expect(row).toBeVisible({ timeout: 15000 });

    const checkbox = row.getByRole("checkbox").first();

    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.check();

    await expect(checkbox).toBeChecked();
  }
  // async confirmFarmerSelection():Promise<void> {
  //   const selectButton = this.page.getByRole('button', { name: /Select/i });

  //   await expect(selectButton).toBeVisible({ timeout: 10000 });
  //   await selectButton.click();
  // }
  async confirmFarmerSelection(): Promise<void> {
    // The modal also has "Select all completed (No Risk)".
    // This locator matches the footer button whose name ends with "Select".
    const selectButton = this.page
      .getByRole("button", { name: /(^|\s)Select$/i })
      .last();

    await expect(selectButton).toBeVisible({ timeout: 10000 });
    await selectButton.click();

    await expect(this.page.getByText(/Select farmer lands/i)).toBeHidden({
      timeout: 10000,
    });
  }

  async closeSelectFarmersModal(): Promise<void> {
    await this.page.getByRole("button", { name: /^Close$/i }).click();
  }

  async save(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async update(): Promise<void> {
    await expect(this.updateButton).toBeVisible({ timeout: 10000 });
    await this.updateButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async goBack(): Promise<void> {
    await expect(this.backButton).toBeVisible({ timeout: 10000 });
    await this.backButton.click();
  }

  async updateTradingCompany(value: string): Promise<void> {
    await this.tradingCompanyInput.click();

    await this.tradingCompanyInput.press(
      process.platform === "darwin" ? "Meta+A" : "Control+A",
    );

    await this.tradingCompanyInput.press("Backspace");
    await this.tradingCompanyInput.fill(value);

    await expect(this.tradingCompanyInput).toHaveValue(value, {
      timeout: 10000,
    });
  }

  async cancelDdsReport(): Promise<void> {
    await expect(this.cancelButton).toBeVisible({ timeout: 10000 });
    await this.cancelButton.click();

    const confirmButton = this.page
      .getByRole("button", { name: /Yes, Cancel it!/i })
      .first();

    const hasConfirm = await confirmButton
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (hasConfirm) {
      await confirmButton.click();
    }

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async selectActivityTypeWithFallback(
    preferredActivityType: DdsActivityType,
  ): Promise<DdsActivityType> {
    const allowedValues: DdsActivityType[] = [
      "Import",
      "Export",
      "Trade",
      "Domestic production",
    ];

    await expect(this.activityTypeInput).toBeVisible({ timeout: 10000 });
    await this.activityTypeInput.click();

    const options = this.page.getByRole("option");

    await expect(options.first()).toBeVisible({ timeout: 10000 });

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const preferredOption = optionTexts.find((text) =>
      text.toLowerCase().includes(preferredActivityType.toLowerCase()),
    );

    const firstAllowedOption = optionTexts.find((text) =>
      allowedValues.some((allowedValue) =>
        text.toLowerCase().includes(allowedValue.toLowerCase()),
      ),
    );

    const selectedOptionText = preferredOption ?? firstAllowedOption;

    if (!selectedOptionText) {
      throw new Error(
        `No valid DDS Activity type option found. Options: ${optionTexts.join(
          ", ",
        )}`,
      );
    }

    await this.page
      .getByRole("option")
      .filter({ hasText: selectedOptionText })
      .first()
      .click();

    const selectedActivityType = allowedValues.find((allowedValue) =>
      selectedOptionText.toLowerCase().includes(allowedValue.toLowerCase()),
    );

    if (!selectedActivityType) {
      throw new Error(
        `Could not map selected DDS Activity type: ${selectedOptionText}`,
      );
    }

    await expect(this.activityTypeInput).toContainText(
      new RegExp(selectedActivityType, "i"),
      { timeout: 10000 },
    );

    return selectedActivityType;
  }
}
