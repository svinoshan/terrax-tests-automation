import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import {
  DispatchLineValueOptions,
  DispatchTestData,
  defaultDispatchLineValueOptions,
} from "@data/dispatch/dispatch.data";

export type DispatchHeaderRequiredField =
  | "dispatchTo"
  | "dispatchDate"
  | "vehicleNo"
  | "dispatchBy";

export class CreateDispatchPage extends BasePage {
  readonly pageTitle: Locator;

  readonly dispatchToInput: Locator;
  readonly dispatchDateInput: Locator;
  readonly dispatchByInput: Locator;
  readonly vehicleNoInput: Locator;
  readonly noteInput: Locator;

  readonly addLineButton: Locator;
  readonly saveButton: Locator;
  readonly saveAndAuthorizedButton: Locator;
  readonly backButton: Locator;
  readonly updateButton: Locator;
  readonly updateAndAuthorizedButton: Locator;
  readonly cancelButton: Locator;
  readonly confirmCancelButton: Locator;

  readonly purchaseDetailsDialog: Locator;
  readonly addItemsButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole("heading", { name: /create dispatch/i });

    this.dispatchToInput = page
      .locator('input[placeholder="Dispatch to"]')
      .first();
    this.dispatchDateInput = page
      .locator('input[placeholder="Dispatch date"]')
      .first();
    this.dispatchByInput = page
      .locator('input[placeholder="Enter dispatch by"]')
      .first();
    this.vehicleNoInput = page
      .locator('input[placeholder="Enter vehicle no"]')
      .first();
    this.noteInput = page
      .locator(
        'textarea[placeholder="Enter note"], input[placeholder="Enter note"]',
      )
      .first();

    this.addLineButton = page.getByRole("button", { name: /add line/i });

    // this.saveButton = page
    //   .locator('.page-header button.btn-success')
    //   .filter({ hasText: /Save/i })
    //   .nth(1);

    // this.saveAndAuthorizedButton = page
    //   .locator('.page-header button.btn-success')
    //   .filter({ hasText: /Save & Authorized/i })
    //   .first();

    this.saveButton = page.getByRole("button", { name: /Save$/i });

    this.saveAndAuthorizedButton = page.getByRole("button", {
      name: /Save\s*&\s*Authorized/i,
    });

    this.backButton = page.getByRole("button", { name: /back/i });

    this.updateButton = page.getByRole("button", { name: /Update$/i });

    this.updateAndAuthorizedButton = page.getByRole("button", {
      name: /Update\s*&\s*Authorized/i,
    });

    this.cancelButton = page.getByRole("button", { name: /Cancel/i });

    this.confirmCancelButton = page.getByRole("button", {
      name: /Yes,\s*Cancel it!/i,
    });

    this.purchaseDetailsDialog = page
      .locator(".modal, .cdk-overlay-pane, .mat-mdc-dialog-container")
      .filter({ hasText: /Farmer purchase details|Purchase details/i })
      .first();

    this.addItemsButton = page.getByRole("button", { name: /Add items/i });
  }

  private parseNumber(value: string): number {
    return Number(value.replace(/,/g, "").trim());
  }

  private formatNumber(value: number, decimals: number): string {
    return value.toFixed(decimals).replace(/\.?0+$/, "");
  }

  private calculateSafeDispatchQty(
    balanceQty: number,
    options?: DispatchLineValueOptions,
  ): string {
    const config = {
      ...defaultDispatchLineValueOptions,
      ...options,
    };

    if (!Number.isFinite(balanceQty) || balanceQty <= 0) {
      throw new Error(
        `Cannot set dispatch quantity because balance quantity is "${balanceQty}".`,
      );
    }

    const cappedQty = Math.min(config.maxDispatchQty, balanceQty);

    const factor = 10 ** config.quantityDecimals;
    const roundedDownQty = Math.floor(cappedQty * factor) / factor;

    if (roundedDownQty <= 0) {
      throw new Error(
        `Cannot set dispatch quantity because safe quantity calculated as "${roundedDownQty}". Balance was "${balanceQty}".`,
      );
    }

    return this.formatNumber(roundedDownQty, config.quantityDecimals);
  }

  private calculateSafeDispatchPrice(
    purchasePrice: number,
    options?: DispatchLineValueOptions,
  ): string {
    const config = {
      ...defaultDispatchLineValueOptions,
      ...options,
    };

    const basePrice = Number.isFinite(purchasePrice)
      ? purchasePrice + config.priceMarkup
      : config.fallbackDispatchPrice;

    const safePrice = Math.min(basePrice, config.maxDispatchPrice);

    if (!Number.isFinite(safePrice) || safePrice <= 0) {
      throw new Error(
        `Cannot set dispatch price. Purchase price was "${purchasePrice}", calculated price was "${safePrice}".`,
      );
    }

    return this.formatNumber(safePrice, 2);
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.dispatchToInput).toBeVisible();
    await expect(this.dispatchDateInput).toBeVisible();
    await expect(this.dispatchByInput).toBeVisible();
    await expect(this.vehicleNoInput).toBeVisible();
    await expect(this.addLineButton).toBeVisible();
  }

  async selectFirstAutocompleteOption(
    input: Locator,
    searchText: string,
  ): Promise<string> {
    await input.click();
    await input.fill("");
    await input.fill(searchText);

    const firstOption = this.page.getByRole("option").first();

    await expect(firstOption).toBeVisible({ timeout: 15000 });

    const selectedText = (await firstOption.innerText())
      .replace(/\s+/g, " ")
      .trim();

    await firstOption.click();

    await expect
      .poll(async () => (await input.inputValue()).trim(), {
        timeout: 10000,
        message: "Expected autocomplete input to have selected value",
      })
      .not.toBe("");

    return selectedText;
  }

  async fillHeader(data: DispatchTestData): Promise<string> {
    const selectedDispatchTo = await this.selectFirstAutocompleteOption(
      this.dispatchToInput,
      data.dispatchToSearch,
    );

    await this.dispatchDateInput.fill(data.dispatchDate);
    await this.dispatchDateInput.blur();

    await this.dispatchByInput.fill(data.dispatchBy);
    await this.vehicleNoInput.fill(data.vehicleNo);
    await this.noteInput.fill(data.note);

    await expect(this.dispatchByInput).toHaveValue(data.dispatchBy);
    await expect(this.vehicleNoInput).toHaveValue(data.vehicleNo);

    return selectedDispatchTo;
  }

  async openPurchaseDetailsDialog(): Promise<void> {
    await this.addLineButton.click();

    await expect(
      this.page.getByText(/Farmer purchase details|Purchase details/i).first(),
    ).toBeVisible({ timeout: 15000 });
  }

  async addFirstAvailablePurchaseDetail(): Promise<void> {
    await this.openPurchaseDetailsDialog();

    const checkbox = this.page.getByRole("checkbox").nth(1);

    await expect(checkbox).toBeVisible({ timeout: 15000 });
    await checkbox.check();

    await expect(this.addItemsButton).toBeVisible({ timeout: 10000 });
    await this.addItemsButton.click();

    await expect(
      this.page
        .getByRole("row")
        .filter({
          hasText: /REC\/|Kg|Coconut|Banana|Ginger|Cinnamon|Red Onion/i,
        })
        .first(),
    ).toBeVisible({ timeout: 15000 });
  }

  async save(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async saveAndAuthorize(): Promise<void> {
    await expect(this.saveAndAuthorizedButton).toBeVisible({ timeout: 10000 });
    await this.saveAndAuthorizedButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectDispatchSavedToast(): Promise<void> {
    await expect(this.page.getByText(/Success|success/i).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async fillHeaderExcept(
    data: DispatchTestData,
    missingFields: DispatchHeaderRequiredField[],
  ): Promise<void> {
    if (!missingFields.includes("dispatchTo")) {
      await this.selectFirstAutocompleteOption(
        this.dispatchToInput,
        data.dispatchToSearch,
      );
    }

    if (!missingFields.includes("dispatchDate")) {
      await this.dispatchDateInput.fill(data.dispatchDate);
      await this.dispatchDateInput.blur();
    }

    if (!missingFields.includes("dispatchBy")) {
      await this.dispatchByInput.fill(data.dispatchBy);
    }

    if (!missingFields.includes("vehicleNo")) {
      await this.vehicleNoInput.fill(data.vehicleNo);
    }

    await this.noteInput.fill(data.note);
  }

  async clickSaveExpectValidation(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();

    await this.page.waitForTimeout(500);
  }

  async expectHeaderValidationMessage(
    field: DispatchHeaderRequiredField,
  ): Promise<void> {
    const messageMap: Record<DispatchHeaderRequiredField, RegExp> = {
      dispatchTo: /Dispatch to Is required|Dispatch to is required/i,
      dispatchDate:
        /Dispatch date Is required|Dispatch date is required|Date is required/i,
      vehicleNo: /Vehicle no Is required|Vehicle no is required/i,
      dispatchBy: /Dispatch by Is required|Dispatch by is required/i,
    };

    await expect(this.page.getByText(messageMap[field]).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async expectUpdateLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /update dispatch/i }),
    ).toBeVisible({ timeout: 30000 });

    await expect(this.noteInput).toBeVisible({ timeout: 10000 });
  }

  // async updateNote(note: string): Promise<void> {
  //   await this.noteInput.fill(note);
  //   await expect(this.noteInput).toHaveValue(note);
  // }
  async updateNote(note: string): Promise<void> {
    await expect(this.noteInput).toBeVisible({ timeout: 10000 });

    await this.noteInput.click();
    await this.noteInput.press(
      process.platform === "darwin" ? "Meta+A" : "Control+A",
    );
    await this.noteInput.press("Backspace");
    await this.noteInput.fill(note);

    await expect(this.noteInput).toHaveValue(note, {
      timeout: 10000,
    });
  }

  async updateFirstDispatchLine(
    dispatchQty: string,
    dispatchPrice: string,
  ): Promise<void> {
    const dispatchQtyInput = this.page.getByRole("spinbutton").first();
    const dispatchPriceInput = this.page.getByRole("spinbutton").nth(1);

    await expect(dispatchQtyInput).toBeVisible({ timeout: 10000 });
    await dispatchQtyInput.fill(dispatchQty);

    await expect(dispatchPriceInput).toBeVisible({ timeout: 10000 });
    await dispatchPriceInput.fill(dispatchPrice);

    await expect(dispatchQtyInput).toHaveValue(dispatchQty);
    await expect(dispatchPriceInput).toHaveValue(dispatchPrice);
  }

  async update(): Promise<void> {
    await expect(this.updateButton).toBeVisible({ timeout: 10000 });
    await this.updateButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectUpdatedDispatchValues(
    expectedNote: string,
    expectedDispatchQty: string,
    expectedDispatchPrice: string,
  ): Promise<void> {
    await expect(this.noteInput).toHaveValue(expectedNote, {
      timeout: 10000,
    });

    await expect(this.page.getByRole("spinbutton").first()).toHaveValue(
      expectedDispatchQty,
    );

    await expect(this.page.getByRole("spinbutton").nth(1)).toHaveValue(
      expectedDispatchPrice,
    );
  }

  // async updateFirstDispatchLineWithinAvailable(
  //   dispatchPrice: string,
  // ): Promise<string> {
  //   const firstItemRow = this.page
  //     .getByRole("row")
  //     .filter({ has: this.page.getByRole("spinbutton").first() })
  //     .first();

  //   await expect(firstItemRow).toBeVisible({ timeout: 10000 });

  //   const balanceText = await firstItemRow.locator("td").nth(6).innerText();
  //   const balanceQty = Number(balanceText.replace(/,/g, "").trim());

  //   const safeQty = Math.max(1, Math.floor(balanceQty / 2)).toString();

  //   const dispatchQtyInput = firstItemRow.getByRole("spinbutton").first();
  //   const dispatchPriceInput = firstItemRow.getByRole("spinbutton").nth(1);

  //   await dispatchQtyInput.fill(safeQty);
  //   await dispatchPriceInput.fill(dispatchPrice);

  //   await expect(dispatchQtyInput).toHaveValue(safeQty);
  //   await expect(dispatchPriceInput).toHaveValue(dispatchPrice);

  //   return safeQty;
  // }

  // async updateFirstDispatchLineWithinAvailable(): Promise<{
  //   dispatchQty: string;
  //   dispatchPrice: string;
  // }> {
  //   const firstItemRow = this.page
  //     .getByRole("row")
  //     .filter({ has: this.page.getByRole("spinbutton").first() })
  //     .first();

  //   await expect(firstItemRow).toBeVisible({ timeout: 10000 });

  //   const purchasePriceText = await firstItemRow
  //     .locator("td")
  //     .nth(7)
  //     .innerText();
  //   const purchasePrice = Number(purchasePriceText.replace(/,/g, "").trim());

  //   // Use a deliberately small quantity to avoid stock/balance validation errors.
  //   const dispatchQty = "1";

  //   // Make dispatch price dynamic but different from purchase price.
  //   const dispatchPrice = (purchasePrice + 10).toFixed(2);

  //   const dispatchQtyInput = firstItemRow.getByRole("spinbutton").first();
  //   const dispatchPriceInput = firstItemRow.getByRole("spinbutton").nth(1);

  //   await dispatchQtyInput.fill(dispatchQty);
  //   await dispatchPriceInput.fill(dispatchPrice);

  //   await expect(dispatchQtyInput).toHaveValue(dispatchQty);
  //   await expect(dispatchPriceInput).toHaveValue(dispatchPrice);

  //   return {
  //     dispatchQty,
  //     dispatchPrice,
  //   };
  // }

  // async setFirstDispatchLineValuesWithinAvailable(): Promise<{
  //   dispatchQty: string;
  //   dispatchPrice: string;
  // }> {
  //   const firstItemRow = this.page
  //     .getByRole("row")
  //     .filter({ has: this.page.getByRole("spinbutton").first() })
  //     .first();

  //   await expect(firstItemRow).toBeVisible({ timeout: 10000 });

  //   const balanceText = await firstItemRow.locator("td").nth(6).innerText();
  //   const balanceQty = Number(balanceText.replace(/,/g, "").trim());

  //   if (!Number.isFinite(balanceQty) || balanceQty <= 0) {
  //     throw new Error(
  //       `Cannot set dispatch quantity because balance quantity is "${balanceText}".`,
  //     );
  //   }

  //   const purchasePriceText = await firstItemRow
  //     .locator("td")
  //     .nth(7)
  //     .innerText();
  //   const purchasePrice = Number(purchasePriceText.replace(/,/g, "").trim());

  //   //const safeQty = Math.min(100, Math.floor(balanceQty)).toString();

  //   const safeQty = Math.min(
  //     dispatchConfig.maxDispatchQty,
  //     Math.floor(balanceQty),
  //   ).toString();

  //   // const safePrice = Number.isFinite(purchasePrice)
  //   //   ? (purchasePrice + 10).toFixed(2)
  //   //   : "45.00";

  //   const safePrice = Number.isFinite(purchasePrice)
  //     ? (purchasePrice + dispatchConfig.dispatchPriceMarkup).toFixed(2)
  //     : dispatchConfig.dispatchPriceMarkup.toFixed(2);

  //   const dispatchQtyInput = firstItemRow.getByRole("spinbutton").first();
  //   const dispatchPriceInput = firstItemRow.getByRole("spinbutton").nth(1);

  //   await dispatchQtyInput.fill(safeQty);
  //   await dispatchPriceInput.fill(safePrice);

  //   await expect(dispatchQtyInput).toHaveValue(safeQty);
  //   await expect(dispatchPriceInput).toHaveValue(safePrice);

  //   return {
  //     dispatchQty: safeQty,
  //     dispatchPrice: safePrice,
  //   };
  // }
  async setFirstDispatchLineValuesWithinAvailable(
    options?: DispatchLineValueOptions,
  ): Promise<{
    dispatchQty: string;
    dispatchPrice: string;
  }> {
    const firstItemRow = this.page
      .getByRole("row")
      .filter({ has: this.page.getByRole("spinbutton").first() })
      .first();

    await expect(firstItemRow).toBeVisible({ timeout: 10000 });

    const balanceText = await firstItemRow.locator("td").nth(6).innerText();
    const balanceQty = this.parseNumber(balanceText);

    const purchasePriceText = await firstItemRow
      .locator("td")
      .nth(7)
      .innerText();
    const purchasePrice = this.parseNumber(purchasePriceText);

    const safeQty = this.calculateSafeDispatchQty(balanceQty, options);
    const safePrice = this.calculateSafeDispatchPrice(purchasePrice, options);

    const dispatchQtyInput = firstItemRow.getByRole("spinbutton").first();
    const dispatchPriceInput = firstItemRow.getByRole("spinbutton").nth(1);

    await dispatchQtyInput.fill(safeQty);
    await dispatchPriceInput.fill(safePrice);

    await expect(dispatchQtyInput).toHaveValue(safeQty);
    await expect(dispatchPriceInput).toHaveValue(safePrice);

    return {
      dispatchQty: safeQty,
      dispatchPrice: safePrice,
    };
  }

  // async updateFirstDispatchLineWithinAvailable(): Promise<{
  //   dispatchQty: string;
  //   dispatchPrice: string;
  // }> {
  //   const firstItemRow = this.page
  //     .getByRole("row")
  //     .filter({ has: this.page.getByRole("spinbutton").first() })
  //     .first();

  //   await expect(firstItemRow).toBeVisible({ timeout: 10000 });

  //   const dispatchQtyInput = firstItemRow.getByRole("spinbutton").first();
  //   const dispatchPriceInput = firstItemRow.getByRole("spinbutton").nth(1);

  //   const currentDispatchQtyText = await dispatchQtyInput.inputValue();
  //   const currentDispatchQty = Number(
  //     currentDispatchQtyText.replace(/,/g, "").trim(),
  //   );

  //   if (!Number.isFinite(currentDispatchQty) || currentDispatchQty <= 0) {
  //     throw new Error(
  //       `Cannot update dispatch quantity because current dispatch qty is "${currentDispatchQtyText}".`,
  //     );
  //   }

  //   const safeQty = Math.max(1, Math.floor(currentDispatchQty / 2)).toString();

  //   const purchasePriceText = await firstItemRow
  //     .locator("td")
  //     .nth(7)
  //     .innerText();
  //   const purchasePrice = Number(purchasePriceText.replace(/,/g, "").trim());

  //   const safePrice = Number.isFinite(purchasePrice)
  //     ? (purchasePrice + 10).toFixed(2)
  //     : "20.00";

  //   await dispatchQtyInput.fill(safeQty);
  //   await dispatchPriceInput.fill(safePrice);

  //   await expect(dispatchQtyInput).toHaveValue(safeQty);
  //   await expect(dispatchPriceInput).toHaveValue(safePrice);

  //   return {
  //     dispatchQty: safeQty,
  //     dispatchPrice: safePrice,
  //   };
  // }

  // async updateFirstDispatchLineSafely(): Promise<{
  //   dispatchQty: string | null;
  //   dispatchPrice: string | null;
  // }> {
  //   const firstItemRow = this.page
  //     .getByRole("row")
  //     .filter({ has: this.page.getByRole("spinbutton").first() })
  //     .first();

  //   await expect(firstItemRow).toBeVisible({ timeout: 10000 });

  //   const dispatchQtyInput = firstItemRow.getByRole("spinbutton").first();
  //   const dispatchPriceInput = firstItemRow.getByRole("spinbutton").nth(1);

  //   const currentDispatchQtyText = await dispatchQtyInput.inputValue();
  //   const currentDispatchQty = Number(
  //     currentDispatchQtyText.replace(/,/g, "").trim(),
  //   );

  //   if (!Number.isFinite(currentDispatchQty) || currentDispatchQty <= 0) {
  //     // Fallback: do not change line qty/price.
  //     // Caller can still update note only.
  //     return {
  //       dispatchQty: null,
  //       dispatchPrice: null,
  //     };
  //   }

  //   const safeQty = Math.max(1, Math.floor(currentDispatchQty / 2)).toString();

  //   const purchasePriceText = await firstItemRow
  //     .locator("td")
  //     .nth(7)
  //     .innerText();
  //   const purchasePrice = Number(purchasePriceText.replace(/,/g, "").trim());

  //   const safePrice = Number.isFinite(purchasePrice)
  //     ? (purchasePrice + 10).toFixed(2)
  //     : "45.00";

  //   await dispatchQtyInput.fill(safeQty);
  //   await dispatchPriceInput.fill(safePrice);

  //   await expect(dispatchQtyInput).toHaveValue(safeQty);
  //   await expect(dispatchPriceInput).toHaveValue(safePrice);

  //   return {
  //     dispatchQty: safeQty,
  //     dispatchPrice: safePrice,
  //   };
  // }
  async updateFirstDispatchLineSafely(
    options?: DispatchLineValueOptions,
  ): Promise<{
    dispatchQty: string | null;
    dispatchPrice: string | null;
  }> {
    const firstItemRow = this.page
      .getByRole("row")
      .filter({ has: this.page.getByRole("spinbutton").first() })
      .first();

    await expect(firstItemRow).toBeVisible({ timeout: 10000 });

    const dispatchQtyInput = firstItemRow.getByRole("spinbutton").first();
    const dispatchPriceInput = firstItemRow.getByRole("spinbutton").nth(1);

    const currentDispatchQtyText = await dispatchQtyInput.inputValue();
    const currentDispatchQty = this.parseNumber(currentDispatchQtyText);

    if (!Number.isFinite(currentDispatchQty) || currentDispatchQty <= 0) {
      return {
        dispatchQty: null,
        dispatchPrice: null,
      };
    }

    const nextQty = Math.max(1, Math.floor(currentDispatchQty / 2));

    const purchasePriceText = await firstItemRow
      .locator("td")
      .nth(7)
      .innerText();
    const purchasePrice = this.parseNumber(purchasePriceText);

    const safePrice = this.calculateSafeDispatchPrice(purchasePrice, options);
    const safeQty = this.formatNumber(nextQty, 2);

    await dispatchQtyInput.fill(safeQty);
    await dispatchPriceInput.fill(safePrice);

    await expect(dispatchQtyInput).toHaveValue(safeQty);
    await expect(dispatchPriceInput).toHaveValue(safePrice);

    return {
      dispatchQty: safeQty,
      dispatchPrice: safePrice,
    };
  }

  async updateAndAuthorize(): Promise<void> {
    await expect(this.updateAndAuthorizedButton).toBeVisible({
      timeout: 10000,
    });
    await this.updateAndAuthorizedButton.click();

    await this.page
      .getByRole("button", { name: /^Ok$/i })
      .click({ timeout: 10000 })
      .catch(() => {
        // Some builds may show toast only, not an Ok dialog.
      });

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectDispatchNoteValue(expectedNote: string): Promise<void> {
    await expect(this.noteInput).toHaveValue(expectedNote, {
      timeout: 15000,
    });
  }

  async cancelDispatch(): Promise<void> {
    await expect(this.cancelButton).toBeVisible({ timeout: 10000 });
    await this.cancelButton.click();

    await expect(this.confirmCancelButton).toBeVisible({ timeout: 10000 });
    await this.confirmCancelButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectNoUpdateActionsVisible(): Promise<void> {
    await expect(this.updateButton).toBeHidden({ timeout: 10000 });
    await expect(this.updateAndAuthorizedButton).toBeHidden({ timeout: 10000 });
  }

  async getFirstDispatchLineNumbers(): Promise<{
    grnNo: string;
    balanceQty: number;
    dispatchQty: number;
    dispatchPrice: number;
  }> {
    const firstItemRow = this.page
      .getByRole("row")
      .filter({ has: this.page.getByRole("spinbutton").first() })
      .first();

    await expect(firstItemRow).toBeVisible({ timeout: 10000 });

    const cells = firstItemRow.locator("td");

    const parseNumber = (value: string): number =>
      Number(value.replace(/,/g, "").trim());

    const grnNo = (await cells.nth(4).innerText()).trim();
    const balanceQty = parseNumber(await cells.nth(6).innerText());

    const dispatchQty = parseNumber(
      await firstItemRow.getByRole("spinbutton").first().inputValue(),
    );

    const dispatchPrice = parseNumber(
      await firstItemRow.getByRole("spinbutton").nth(1).inputValue(),
    );

    return {
      grnNo,
      balanceQty,
      dispatchQty,
      dispatchPrice,
    };
  }

  async expectFirstDispatchLineBalance(expectedBalance: number): Promise<void> {
    const line = await this.getFirstDispatchLineNumbers();

    expect(line.balanceQty).toBeCloseTo(expectedBalance, 2);
  }

  // async getAvailablePurchaseDetailBalanceByGrn(grnNo: string): Promise<number> {
  //   await this.openPurchaseDetailsDialog();

  //   const row = this.page.getByRole("row").filter({ hasText: grnNo }).first();

  //   await expect(row).toBeVisible({ timeout: 15000 });

  //   const cells = await row.locator("td").allInnerTexts();

  //   const numericValues = cells
  //     .map((cell) => Number(cell.replace(/,/g, "").trim()))
  //     .filter((value) => Number.isFinite(value));

  //   if (numericValues.length === 0) {
  //     throw new Error(
  //       `Could not find numeric balance values for GRN "${grnNo}".`,
  //     );
  //   }

  //   // In the Add line table, balance qty is normally one of the visible numeric cells.
  //   // Use the largest positive quantity-like number as the available balance.
  //   const balanceQty = Math.max(...numericValues);

  //   await this.page.getByRole("button", { name: /^Cancel$/i }).click();

  //   return balanceQty;
  // }
  async getAvailablePurchaseDetailBalanceByGrn(grnNo: string): Promise<number> {
    await this.openPurchaseDetailsDialog();

    const table = this.page
      .getByRole("table")
      .filter({ hasText: grnNo })
      .first();

    await expect(table).toBeVisible({ timeout: 15000 });

    const headers = table.getByRole("columnheader");
    const headerCount = await headers.count();

    let balanceColumnIndex = -1;

    for (let index = 0; index < headerCount; index += 1) {
      const headerText = (await headers.nth(index).innerText())
        .replace(/\s+/g, " ")
        .trim();

      if (/Balance qty/i.test(headerText)) {
        balanceColumnIndex = index;
        break;
      }
    }

    if (balanceColumnIndex === -1) {
      throw new Error(`Could not find Balance qty column for GRN "${grnNo}".`);
    }

    const row = table.getByRole("row").filter({ hasText: grnNo }).first();

    await expect(row).toBeVisible({ timeout: 15000 });

    const balanceText = await row
      .locator("td")
      .nth(balanceColumnIndex)
      .innerText();

    const balanceQty = Number(balanceText.replace(/,/g, "").trim());

    if (!Number.isFinite(balanceQty)) {
      throw new Error(
        `Could not parse Balance qty "${balanceText}" for GRN "${grnNo}".`,
      );
    }

    await this.page
      .getByRole("button", { name: /^Cancel$/i })
      .click()
      .catch(() => {});

    return balanceQty;
  }

  async updateFirstDispatchLineToSpecificQty(dispatchQty: string): Promise<{
    dispatchQty: string;
    dispatchPrice: string;
  }> {
    const firstItemRow = this.page
      .getByRole("row")
      .filter({ has: this.page.getByRole("spinbutton").first() })
      .first();

    await expect(firstItemRow).toBeVisible({ timeout: 10000 });

    const dispatchQtyInput = firstItemRow.getByRole("spinbutton").first();
    const dispatchPriceInput = firstItemRow.getByRole("spinbutton").nth(1);

    const currentDispatchPrice = await dispatchPriceInput.inputValue();

    await dispatchQtyInput.fill(dispatchQty);

    await expect(dispatchQtyInput).toHaveValue(dispatchQty);
    await expect(dispatchPriceInput).toHaveValue(currentDispatchPrice);

    return {
      dispatchQty,
      dispatchPrice: currentDispatchPrice,
    };
  }

  async expectAtLeastOneDispatchLine(): Promise<void> {
    await expect(
      this.page
        .getByRole("row")
        .filter({
          has: this.page.getByRole("spinbutton").first(),
        })
        .first(),
    ).toBeVisible({ timeout: 10000 });
  }

  async expectNoDispatchLines(): Promise<void> {
    await expect(
      this.page.getByRole("row").filter({
        has: this.page.getByRole("spinbutton"),
      }),
    ).toHaveCount(0, { timeout: 10000 });
  }

  async deleteFirstDispatchLine(): Promise<void> {
    const firstItemRow = this.page
      .getByRole("row")
      .filter({ has: this.page.getByRole("spinbutton").first() })
      .first();

    await expect(firstItemRow).toBeVisible({ timeout: 10000 });

    await firstItemRow
      .locator("td")
      .last()
      .locator("button, a, .me-2")
      .first()
      .click();

    await this.page
      .getByRole("button", { name: /Yes,\s*delete it!/i })
      .click({ timeout: 10000 });

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});

    await this.expectNoDispatchLines();
  }
}
