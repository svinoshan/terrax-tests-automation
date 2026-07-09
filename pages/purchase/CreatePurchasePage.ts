import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { PurchaseNoteTestData } from "@data/purchase/purchase.data";

export type PurchaseHeaderRequiredField =
  | "farmer"
  | "purchasingOfficer"
  | "plotCode"
  | "purchaseDate";

export type PurchaseLineRequiredField = "item" | "purchaseQty" | "unitPrice";

export class CreatePurchasePage extends BasePage {
  readonly pageTitle: Locator;

  readonly farmerInput: Locator;
  readonly purchasingOfficerInput: Locator;
  readonly plotCodeInput: Locator;
  readonly purchaseDateInput: Locator;
  readonly noteInput: Locator;

  readonly saveButton: Locator;
  readonly saveAndAuthorizedButton: Locator;
  readonly backButton: Locator;
  readonly addLineButton: Locator;

  readonly updateButton: Locator;
  readonly updateAndAuthorizedButton: Locator;
  readonly reportButton: Locator;

  readonly cancelButton: Locator;
  readonly confirmCancelButton: Locator;

  readonly addLineDialog: Locator;
  readonly itemInput: Locator;
  readonly purchaseQtyInput: Locator;
  readonly unitPriceInput: Locator;
  readonly modalSaveButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole("heading", {
      name: /create purchase note/i,
    });

    this.farmerInput = page.locator('[formcontrolname="farmer"]');
    this.purchasingOfficerInput = page
      .locator('input[placeholder="Select purchasing officer"]')
      .first();

    this.plotCodeInput = page
      .locator('input[placeholder="Select plot code"]')
      .first();

    this.purchaseDateInput = page.locator('[formcontrolname="date"]');
    this.noteInput = page.locator('[formcontrolname="note"]');

    //this.saveButton = page.getByRole("button", { name: /^Save$/i });

    this.saveButton = page
      .locator(".page-header button.btn-success")
      .filter({ hasText: /Save/i })
      .first();

    // this.saveAndAuthorizedButton = page.getByRole("button", {
    //   name: /save.*authorized/i,
    // });
    this.saveAndAuthorizedButton = page
      .locator(".page-header button.btn-primary")
      .filter({ hasText: /Save & Authorized/i })
      .first();

    this.updateButton = page
      .locator(".page-header button.btn-success")
      .filter({ hasText: /Update/i })
      .first();

    this.updateAndAuthorizedButton = page
      .locator(
        ".page-header button.btn-success, .page-header button.btn-primary",
      )
      .filter({ hasText: /Update & Authorized/i })
      .first();

    this.reportButton = page
      .locator(".page-header button")
      .filter({ hasText: /Report/i })
      .first();

    this.cancelButton = page
      .locator(".page-header button")
      .filter({ hasText: /Cancel/i })
      .first();

    this.confirmCancelButton = page.getByRole("button", {
      name: /Yes,\s*Cancel it!|Yes/i,
    });

    this.backButton = page.getByRole("button", { name: /back/i });

    this.addLineButton = page.getByRole("button", { name: /add line/i });

    this.addLineDialog = page.locator("app-purchase-note-add");
    this.itemInput = this.addLineDialog.locator(
      'input[placeholder="Select item"]',
    );
    this.purchaseQtyInput = this.addLineDialog.locator(
      '[formcontrolname="purchaseQTY"]',
    );
    this.unitPriceInput = this.addLineDialog.locator(
      '[formcontrolname="unitPrice"]',
    );
    this.modalSaveButton = this.addLineDialog.getByRole("button", {
      name: /^Save$/i,
    });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.farmerInput).toBeVisible();
    await expect(this.plotCodeInput).toBeVisible();
    await expect(this.purchaseDateInput).toBeVisible();
    await expect(this.addLineButton).toBeVisible();
  }
  // async selectAutocomplete(input: Locator, value: string): Promise<void> {
  //   await input.click();
  //   await input.fill(value);

  //   const exactOption = this.page.getByText(value, { exact: true }).first();

  //   if (await exactOption.isVisible({ timeout: 3000 }).catch(() => false)) {
  //     await exactOption.click();
  //     return;
  //   }

  //   const containsOption = this.page.getByText(value).first();

  //   try {
  //     await containsOption.waitFor({ state: 'visible', timeout: 10000 });
  //     await containsOption.click();
  //   } catch {
  //     await input.press('Enter').catch(() => {});
  //   }
  // }

  async selectAutocomplete(input: Locator, value: string): Promise<void> {
    await input.click();
    await input.fill(value);

    const option = this.page
      .getByRole("option")
      .filter({ hasText: value })
      .first();

    await expect(
      option,
      `Expected autocomplete option containing "${value}" to appear`,
    ).toBeVisible({ timeout: 15000 });

    await option.click();

    await expect
      .poll(async () => (await input.inputValue()).trim(), {
        timeout: 10000,
        message: `Expected autocomplete input to contain "${value}" after selection`,
      })
      .toContain(value);
  }

  async selectFirstAutocompleteOption(
    input: Locator,
    searchText: string,
  ): Promise<void> {
    await input.click();
    await input.fill("");
    await input.fill(searchText);

    const firstOption = this.page.getByRole("option").first();

    await expect(firstOption).toBeVisible({
      timeout: 15000,
    });

    const selectedText = (await firstOption.innerText()).trim();

    await firstOption.click();

    await expect
      .poll(async () => (await input.inputValue()).trim(), {
        timeout: 10000,
        message: `Expected autocomplete input to contain selected value`,
      })
      .not.toBe("");

    //console.log(`Selected purchasing officer: ${selectedText}`);
  }

  async fillHeader(
    //farmerCode: string,
    farmerSearchText: string,
    plotCode: string,
    data: PurchaseNoteTestData,
  ): Promise<void> {
    await this.selectAutocomplete(this.farmerInput, farmerSearchText);

    // Purchasing officer is required before Add line can open.
    await this.selectFirstAutocompleteOption(this.purchasingOfficerInput, "a");

    await this.selectAutocomplete(this.plotCodeInput, plotCode);

    await this.purchaseDateInput.fill(data.purchaseDate);
    await this.purchaseDateInput.blur();

    await this.noteInput.fill(data.note);
  }

  async openAddLineDialog(): Promise<void> {
    await this.addLineButton.click();
    await expect(this.addLineDialog).toBeVisible({ timeout: 10000 });
  }

  async addPurchaseLine(data: PurchaseNoteTestData): Promise<void> {
    await this.openAddLineDialog();

    // After farmer and plot code selection, item dropdown should contain available crop/items.
    await this.itemInput.click();

    const firstOption = this.page.getByRole("option").first();

    if (await firstOption.isVisible({ timeout: 10000 }).catch(() => false)) {
      await firstOption.click();
    } else {
      // Some builds may auto-populate item or not require explicit item selection.
      await this.itemInput.press("Enter").catch(() => {});
    }

    await this.purchaseQtyInput.fill(data.purchaseQty);
    await this.unitPriceInput.fill(data.unitPrice);

    await this.modalSaveButton.click();

    await expect(this.addLineDialog).toBeHidden({ timeout: 10000 });
  }

  async save(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectPurchaseSavedToast(): Promise<void> {
    await expect(this.page.getByText(/Success|success/i).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async fillHeaderExcept(
    farmerSearchText: string,
    plotCode: string,
    data: PurchaseNoteTestData,
    missingFields: PurchaseHeaderRequiredField[],
  ): Promise<void> {
    if (!missingFields.includes("farmer")) {
      await this.selectAutocomplete(this.farmerInput, farmerSearchText);
    }

    if (!missingFields.includes("purchasingOfficer")) {
      await this.selectFirstAutocompleteOption(
        this.purchasingOfficerInput,
        "a",
      );
    }

    if (
      !missingFields.includes("plotCode") &&
      !missingFields.includes("farmer")
    ) {
      await this.selectAutocomplete(this.plotCodeInput, plotCode);
    }

    if (!missingFields.includes("purchaseDate")) {
      await this.purchaseDateInput.fill(data.purchaseDate);
      await this.purchaseDateInput.blur();
    }

    await this.noteInput.fill(data.note);
  }

  async clickSaveExpectValidation(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();

    // Let Angular validation messages render.
    await this.page.waitForTimeout(500);
  }

  async expectHeaderValidationMessage(
    field: PurchaseHeaderRequiredField,
  ): Promise<void> {
    const messageMap: Record<PurchaseHeaderRequiredField, RegExp> = {
      farmer:
        /Farmer Is required|Farmer is required|not selected from the list/i,
      purchasingOfficer:
        /Purchasing officer Is required|Purchasing officer is required/i,
      plotCode: /Plot code Is required|Plot code is required/i,
      purchaseDate:
        /Date is required|Purchase date Is required|Purchase date is required/i,
    };

    await expect(this.page.getByText(messageMap[field]).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async openAddLineDialogAfterValidHeader(): Promise<void> {
    await this.openAddLineDialog();
    await expect(this.addLineDialog).toBeVisible({ timeout: 10000 });
  }

  async selectFirstPurchaseItem(): Promise<void> {
    await this.itemInput.click();

    const firstOption = this.page.getByRole("option").first();

    await expect(firstOption).toBeVisible({ timeout: 10000 });
    await firstOption.click();

    await expect
      .poll(async () => (await this.itemInput.inputValue()).trim(), {
        timeout: 10000,
        message: "Expected item input to have selected value",
      })
      .not.toBe("");
  }

  async fillPurchaseLineExcept(
    data: PurchaseNoteTestData,
    missingFields: PurchaseLineRequiredField[],
  ): Promise<void> {
    if (!missingFields.includes("item")) {
      await this.selectFirstPurchaseItem();
    }

    if (!missingFields.includes("purchaseQty")) {
      await this.purchaseQtyInput.fill(data.purchaseQty);
    }

    if (!missingFields.includes("unitPrice")) {
      await this.unitPriceInput.fill(data.unitPrice);
    }
  }

  async clickModalSaveExpectValidation(): Promise<void> {
    await this.modalSaveButton.click();
    await this.page.waitForTimeout(500);
  }

  async expectLineValidationMessage(
    field: PurchaseLineRequiredField,
  ): Promise<void> {
    const messageMap: Record<PurchaseLineRequiredField, RegExp> = {
      item: /Item Is required|Item is required|not selected from the list/i,
      purchaseQty: /Purchase qty Is required|Purchase qty is required/i,
      unitPrice: /Unit price Is required|Unit price is required/i,
    };

    await expect(
      this.addLineDialog.getByText(messageMap[field]).first(),
    ).toBeVisible({
      timeout: 10000,
    });
  }

  async expectUpdateLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /update purchase note/i }),
    ).toBeVisible({ timeout: 30000 });

    await expect(this.noteInput).toBeVisible();
  }

  async updateNote(note: string): Promise<void> {
    await this.noteInput.fill(note);
    await expect(this.noteInput).toHaveValue(note);
  }

  async editFirstPurchaseLine(
    purchaseQty: string,
    unitPrice: string,
  ): Promise<void> {
    const firstLineRow = this.page
      .getByRole("row")
      .filter({ hasText: /Banana|Pepper Green|Kg/i })
      .first();

    await firstLineRow.locator(".me-2.p-2, a, button").first().click();

    await expect(this.addLineDialog).toBeVisible({ timeout: 10000 });

    await this.purchaseQtyInput.fill(purchaseQty);
    await this.unitPriceInput.fill(unitPrice);

    await this.modalSaveButton.click();

    await expect(this.addLineDialog).toBeHidden({ timeout: 10000 });
  }

  async update(): Promise<void> {
    await expect(this.updateButton).toBeVisible({ timeout: 10000 });
    await this.updateButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async updateAndAuthorize(): Promise<void> {
    await expect(this.updateAndAuthorizedButton).toBeVisible({
      timeout: 10000,
    });
    await this.updateAndAuthorizedButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectViewLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", {
        name: /view purchase note|formMode\.VIEW purchase note/i,
      }),
    ).toBeVisible({ timeout: 30000 });

    await expect(this.reportButton).toBeVisible({ timeout: 10000 });
    await expect(this.backButton).toBeVisible({ timeout: 10000 });
  }

  async expectNoUpdateActionsVisible(): Promise<void> {
    await expect(this.updateButton).toBeHidden({ timeout: 10000 });
    await expect(this.updateAndAuthorizedButton).toBeHidden({ timeout: 10000 });
  }

  async expectUpdatedPurchaseValues(
    expectedNote: string,
    expectedQty: string,
    expectedUnitPrice: string,
  ): Promise<void> {
    await expect(this.noteInput).toHaveValue(expectedNote, {
      timeout: 10000,
    });

    await expect(
      this.page.getByRole("row").filter({ hasText: expectedQty }).first(),
    ).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByRole("row").filter({ hasText: expectedUnitPrice }).first(),
    ).toBeVisible({ timeout: 10000 });
  }

  async cancelPurchase(): Promise<void> {
    await expect(this.cancelButton).toBeVisible({ timeout: 10000 });
    await this.cancelButton.click();

    await expect(this.confirmCancelButton).toBeVisible({ timeout: 10000 });
    await this.confirmCancelButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }
}
