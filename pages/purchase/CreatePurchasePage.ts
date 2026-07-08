import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { PurchaseNoteTestData } from "@data/purchase/purchase.data";

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
}
