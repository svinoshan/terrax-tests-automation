import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { CropTestData } from '@data/crops/create-crop.data';

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
  readonly saveButton: Locator;
  readonly resetButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole('heading', { name: /create crop/i });

    this.cropNameInput = page.locator('[formcontrolname="cropName"]');
    this.scientificNameInput = page.locator('[formcontrolname="scientificName"]');
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

    this.saveButton = page.locator('button[type="submit"]').filter({ hasText: /save/i });
    this.resetButton = page.locator('button').filter({ hasText: /reset/i });
    this.backButton = page.locator('button').filter({ hasText: /back/i });
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
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
    await expect(this.saveButton).toBeVisible();
    await expect(this.resetButton).toBeVisible();
    await expect(this.backButton).toBeVisible();
  }

  async fillTextFieldsOnly(data: Pick<CropTestData, 'cropName' | 'scientificName' | 'description' | 'category' | 'motherCrop' | 'hsCode'>): Promise<void> {
    await this.cropNameInput.fill(data.cropName);
    await this.scientificNameInput.fill(data.scientificName);
    await this.descriptionInput.fill(data.description);
    await this.categoryInput.fill(data.category);
    await this.motherCropInput.fill(data.motherCrop);
    await this.hsCodeInput.fill(data.hsCode);
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async reset(): Promise<void> {
    await this.resetButton.click();
  }

  async back(): Promise<void> {
    await this.backButton.click();
  }

  async expectTextFieldsCleared(): Promise<void> {
    await expect(this.cropNameInput).toHaveValue('');
    await expect(this.scientificNameInput).toHaveValue('');
    await expect(this.descriptionInput).toHaveValue('');
    await expect(this.categoryInput).toHaveValue('');
    await expect(this.hsCodeInput).toHaveValue('');
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
}
