import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { CropTestData } from "@data/crops/create-crop.data";
import { CreateCropRequiredField } from "@data/crops/create-crop-validation.data";

export class CreateCropPage extends BasePage {
  readonly pageTitle: Locator;
  readonly cropNameInput: Locator;
  readonly scientificNameInput: Locator;
  readonly productFormSelect: Locator;
  readonly descriptionInput: Locator;
  readonly purchaseUomSelect: Locator;
  readonly typeOfCropSelect: Locator;
  readonly categoryInput: Locator;
  readonly plantedUomSelect: Locator;
  readonly motherCropInput: Locator;
  readonly hsCodeInput: Locator;
  readonly outTurnInput: Locator;
  readonly activeSwitch: Locator;
  readonly submitButton: Locator;
  readonly resetButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole("heading", { name: /create crop/i });

    this.cropNameInput = page.locator('[formcontrolname="cropName"]');
    this.scientificNameInput = page.locator(
      '[formcontrolname="scientificName"]',
    );
    this.productFormSelect = page.locator('[formcontrolname="productForm"]');
    this.descriptionInput = page.locator('[formcontrolname="description"]');
    this.purchaseUomSelect = page.locator('[formcontrolname="purchaseUom"]');
    this.typeOfCropSelect = page.locator('[formcontrolname="typeOfCrop"]');
    this.categoryInput = page.locator('[formcontrolname="category"]');
    this.plantedUomSelect = page.locator('[formcontrolname="plant"]');
    this.motherCropInput = page.locator('[formcontrolname="motherCrop"]');
    this.hsCodeInput = page.locator('[formcontrolname="hsCode"]');
    this.outTurnInput = page.locator('[formcontrolname="outTurn"]');
    this.activeSwitch = page.locator('[formcontrolname="active"]');

    this.submitButton = page
      .locator('button[type="submit"]')
      .filter({ hasText: /save|update/i });
    this.resetButton = page.locator("button").filter({ hasText: /reset/i });
    this.backButton = page.locator("button").filter({ hasText: /back/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
  }

  async expectUpdateLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /update crop/i }),
    ).toBeVisible({
      timeout: 30000,
    });
  }

  async isLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible().catch(() => false);
  }

  async expectFormFieldsVisible(): Promise<void> {
    await expect(this.cropNameInput).toBeVisible();
    await expect(this.scientificNameInput).toBeVisible();
    await expect(this.productFormSelect).toBeVisible();
    await expect(this.descriptionInput).toBeVisible();
    await expect(this.purchaseUomSelect).toBeVisible();
    await expect(this.typeOfCropSelect).toBeVisible();
    await expect(this.categoryInput).toBeVisible();
    await expect(this.plantedUomSelect).toBeVisible();
    await expect(this.motherCropInput).toBeVisible();
    await expect(this.hsCodeInput).toBeVisible();
    await expect(this.outTurnInput).toBeVisible();
    await expect(this.activeSwitch).toBeVisible();
  }

  async expectButtonsVisible(): Promise<void> {
    await expect(this.submitButton).toBeVisible();
    await expect(this.resetButton).toBeVisible();
    await expect(this.backButton).toBeVisible();
  }

  async selectMatOption(
    selectControl: Locator,
    optionName: string,
  ): Promise<void> {
    await selectControl.click();

    const option = this.page.getByRole("option", {
      name: optionName,
      exact: true,
    });
    await expect(option).toBeVisible({ timeout: 10000 });
    await option.click();
  }

  async fillAutocomplete(input: Locator, value: string): Promise<void> {
    await input.fill(value);

    const option = this.page.getByRole("option", { name: value, exact: true });

    try {
      await option.waitFor({ state: "visible", timeout: 3000 });
      await option.click();
    } catch {
      await input.press("Enter").catch(() => {});
    }
  }

  async fillTextFieldsOnly(
    data: Pick<
      CropTestData,
      | "cropName"
      | "scientificName"
      | "description"
      | "category"
      | "motherCrop"
      | "hsCode"
    >,
  ): Promise<void> {
    await this.cropNameInput.fill(data.cropName);
    await this.scientificNameInput.fill(data.scientificName);
    await this.descriptionInput.fill(data.description);
    await this.categoryInput.fill(data.category);
    await this.motherCropInput.fill(data.motherCrop);
    await this.hsCodeInput.fill(data.hsCode);
  }

  async fillCreateCropForm(data: CropTestData): Promise<void> {
    await this.fillCreateCropFormExcept(data, []);
  }

  async fillCreateCropFormExcept(
    data: CropTestData,
    missingFields: CreateCropRequiredField[],
  ): Promise<void> {
    const isMissing = (field: CreateCropRequiredField): boolean =>
      missingFields.includes(field);

    if (!isMissing("cropName")) {
      await this.cropNameInput.fill(data.cropName);
    }

    if (!isMissing("scientificName")) {
      await this.scientificNameInput.fill(data.scientificName);
    }

    if (!isMissing("description")) {
      await this.descriptionInput.fill(data.description);
    }

    if (!isMissing("productForm")) {
      await this.selectMatOption(this.productFormSelect, data.productForm);
    }

    if (!isMissing("purchaseUom")) {
      await this.selectMatOption(this.purchaseUomSelect, data.purchaseUom);
    }

    if (!isMissing("typeOfCrop")) {
      await this.selectMatOption(this.typeOfCropSelect, data.typeOfCrop);
    }

    if (!isMissing("plantedUom")) {
      await this.selectMatOption(this.plantedUomSelect, data.plantedUom);
    }

    if (!isMissing("category")) {
      await this.fillAutocomplete(this.categoryInput, data.category);
    }

    if (data.motherCrop && data.motherCrop !== "Default") {
      await this.fillAutocomplete(this.motherCropInput, data.motherCrop);
    }

    if (!isMissing("hsCode")) {
      await this.hsCodeInput.fill(data.hsCode);
    }

    if (data.outTurn) {
      await this.fillOutTurnIfEnabled(data.outTurn);
    }

    const isChecked = await this.activeSwitch.isChecked();

    if (data.active !== isChecked) {
      await this.activeSwitch.click();
    }
  }

  async fillUpdateCropFormSkippingCategoryAndMotherCrop(
    data: CropTestData,
  ): Promise<void> {
    await this.cropNameInput.fill(data.cropName);
    await this.scientificNameInput.fill(data.scientificName);
    await this.hsCodeInput.fill(data.hsCode);

    await this.selectMatOption(this.productFormSelect, data.productForm);
    await this.selectMatOption(this.purchaseUomSelect, data.purchaseUom);
    await this.selectMatOption(this.typeOfCropSelect, data.typeOfCrop);
    await this.selectMatOption(this.plantedUomSelect, data.plantedUom);

    // Skipped for now due to known issue in update mode:
    // await this.fillAutocomplete(this.categoryInput, data.category);
    // await this.fillAutocomplete(this.motherCropInput, data.motherCrop);

    if (data.outTurn) {
      await this.fillOutTurnIfEnabled(data.outTurn);
    }

    // Fill description near the end.
    // Some Angular forms can re-patch values after dropdown changes.
    await this.descriptionInput.fill(data.description);
    await expect(this.descriptionInput).toHaveValue(data.description);

    const isChecked = await this.activeSwitch.isChecked();

    if (data.active !== isChecked) {
      await this.activeSwitch.click();
    }
  }

  async fillOutTurnIfEnabled(outTurn: string): Promise<void> {
    try {
      await expect(this.outTurnInput).toBeEnabled({ timeout: 5000 });
      await this.outTurnInput.fill(outTurn);
    } catch {
      console.warn(
        `Out turn field was not enabled. Skipped filling outTurn=${outTurn}`,
      );
    }
  }

  async save(): Promise<void> {
    await this.submitButton.click();
    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async update(): Promise<void> {
    await this.submitButton.click();
    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectCropCreatedToast(): Promise<void> {
    await expect(
      this.page
        .getByText(/Crop Created/i)
        .or(this.page.getByText(/Success/i))
        .first(),
    ).toBeVisible({ timeout: 10000 });
  }

  async expectCropUpdatedToast(): Promise<void> {
    await expect(
      this.page.getByText(/Crop Updated|Crop update|Updated|Success/i).first(),
    ).toBeVisible({ timeout: 10000 });
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }

  async back(): Promise<void> {
    await this.page
      .locator(".ngx-spinner-overlay")
      .waitFor({ state: "hidden", timeout: 30000 })
      .catch(() => {});

    await this.backButton.click();
  }

  async expectTextFieldsCleared(): Promise<void> {
    await expect(this.cropNameInput).toHaveValue("");
    await expect(this.scientificNameInput).toHaveValue("");
    await expect(this.descriptionInput).toHaveValue("");
    await expect(this.categoryInput).toHaveValue("");
    await expect(this.hsCodeInput).toHaveValue("");
  }

  async expectRequiredControlsInvalid(): Promise<void> {
    await expect(this.cropNameInput).toHaveClass(/ng-invalid/);
    await expect(this.scientificNameInput).toHaveClass(/ng-invalid/);
    await expect(this.productFormSelect).toHaveClass(/ng-invalid/);
    await expect(this.descriptionInput).toHaveClass(/ng-invalid/);
    await expect(this.purchaseUomSelect).toHaveClass(/ng-invalid/);
    await expect(this.typeOfCropSelect).toHaveClass(/ng-invalid/);
    await expect(this.categoryInput).toHaveClass(/ng-invalid/);
    await expect(this.plantedUomSelect).toHaveClass(/ng-invalid/);
    await expect(this.hsCodeInput).toHaveClass(/ng-invalid/);
  }

  async expectFieldInvalid(field: CreateCropRequiredField): Promise<void> {
    const fieldLocatorMap: Record<CreateCropRequiredField, Locator> = {
      cropName: this.cropNameInput,
      scientificName: this.scientificNameInput,
      productForm: this.productFormSelect,
      description: this.descriptionInput,
      purchaseUom: this.purchaseUomSelect,
      typeOfCrop: this.typeOfCropSelect,
      category: this.categoryInput,
      plantedUom: this.plantedUomSelect,
      hsCode: this.hsCodeInput,
    };

    await expect(fieldLocatorMap[field]).toHaveClass(/ng-invalid/);
  }
}
