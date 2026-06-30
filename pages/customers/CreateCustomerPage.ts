import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { CustomerTestData } from '@data/customers/create-customer.data';

export type CustomerRequiredField = 'customerName' | 'customerAddress';

export class CreateCustomerPage extends BasePage {
  readonly pageTitle: Locator;
  readonly customerNameInput: Locator;
  readonly customerTpInput: Locator;
  readonly customerAddressInput: Locator;
  readonly activeSwitch: Locator;
  readonly submitButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole('heading', {
      name: /create customer|update customer/i,
    });

    this.customerNameInput = page.locator('[formcontrolname="cusName"]');
    this.customerTpInput = page.locator('[formcontrolname="cusTP"]');
    this.customerAddressInput = page.locator('[formcontrolname="cusAddress"]');
    this.activeSwitch = page.locator('[formcontrolname="active"]');

    this.submitButton = page
      .getByRole('button', { name: /\+?\s*save|update/i })
      .or(page.locator('button').filter({ hasText: /save|update/i }))
      .first();

    this.backButton = page
      .getByRole('button', { name: /back/i })
      .or(page.locator('button').filter({ hasText: /back/i }))
      .first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
  }

  async expectCreateLoaded(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: /create customer/i }),
    ).toBeVisible({ timeout: 30000 });
  }

  async expectUpdateLoaded(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: /update customer/i }),
    ).toBeVisible({ timeout: 30000 });
  }

  async isLoaded(): Promise<boolean> {
    return await this.pageTitle.isVisible().catch(() => false);
  }

  async expectFormFieldsVisible(): Promise<void> {
    await expect(this.customerNameInput).toBeVisible();
    await expect(this.customerTpInput).toBeVisible();
    await expect(this.customerAddressInput).toBeVisible();
    await expect(this.activeSwitch).toBeVisible();
  }

  async expectButtonsVisible(): Promise<void> {
    await expect(this.submitButton).toBeVisible();
    await expect(this.backButton).toBeVisible();
  }

  async fillCustomerForm(data: CustomerTestData): Promise<void> {
    await this.customerNameInput.fill(data.customerName);
    await this.customerTpInput.fill(data.customerTp);
    await this.customerAddressInput.fill(data.customerAddress);

    await this.setActive(data.active);
  }

  async fillCustomerFormExcept(
    data: CustomerTestData,
    missingFields: CustomerRequiredField[],
  ): Promise<void> {
    if (!missingFields.includes('customerName')) {
      await this.customerNameInput.fill(data.customerName);
    }

    await this.customerTpInput.fill(data.customerTp);

    if (!missingFields.includes('customerAddress')) {
      await this.customerAddressInput.fill(data.customerAddress);
    }

    await this.setActive(data.active);
  }

  async updateCustomerAddress(customerAddress: string): Promise<void> {
    await this.customerAddressInput.click();
    await this.customerAddressInput.fill('');
    await this.customerAddressInput.fill(customerAddress);

    // Diagnostic assertion: confirms Playwright actually edited the field
    // before clicking Update.
    await expect(this.customerAddressInput).toHaveValue(customerAddress);
  }

  async expectCustomerAddressValue(customerAddress: string): Promise<void> {
    await expect(this.customerAddressInput).toHaveValue(customerAddress, {
      timeout: 10000,
    });
  }

  async updateCustomerForm(data: CustomerTestData): Promise<void> {
    await this.customerNameInput.fill(data.customerName);
    await this.customerTpInput.fill(data.customerTp);
    await this.customerAddressInput.fill(data.customerAddress);

    await expect(this.customerNameInput).toHaveValue(data.customerName);
    await expect(this.customerTpInput).toHaveValue(data.customerTp);
    await expect(this.customerAddressInput).toHaveValue(data.customerAddress);

    await this.setActive(data.active);
  }

  async setActive(active: boolean): Promise<void> {
    const isChecked = await this.activeSwitch.isChecked();

    if (active !== isChecked) {
      await this.activeSwitch.click();
    }
  }

  async save(): Promise<void> {
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  }

  async update(): Promise<void> {
    await this.submitButton.click();
    await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  }

  async back(): Promise<void> {
    await this.page
      .locator('.ngx-spinner-overlay')
      .waitFor({ state: 'hidden', timeout: 30000 })
      .catch(() => {});

    await this.backButton.click();
  }

  async expectRequiredControlsInvalid(): Promise<void> {
    await expect(this.customerNameInput).toHaveClass(/ng-invalid/);
    await expect(this.customerAddressInput).toHaveClass(/ng-invalid/);
  }

  async expectFieldInvalid(field: CustomerRequiredField): Promise<void> {
    const fieldLocatorMap: Record<CustomerRequiredField, Locator> = {
      customerName: this.customerNameInput,
      customerAddress: this.customerAddressInput,
    };

    await expect(fieldLocatorMap[field]).toHaveClass(/ng-invalid/);
  }

  async expectRequiredMessagesVisible(): Promise<void> {
    await expect(this.page.getByText(/Customer name Is required/i)).toBeVisible();
    await expect(this.page.getByText(/Customer address Is required/i)).toBeVisible();
  }

  async expectCustomerSavedToast(): Promise<void> {
    await expect(
      this.page.getByText(/Success|Customer Created|Created|success/i).first(),
    ).toBeVisible({ timeout: 10000 });
  }

  async expectCustomerUpdatedToast(): Promise<void> {
    await expect(
      this.page.getByText(/Success|Updated|update|success/i).first(),
    ).toBeVisible({ timeout: 10000 });
  }
}
