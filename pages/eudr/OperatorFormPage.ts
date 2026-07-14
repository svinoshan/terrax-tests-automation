import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { OperatorTestData } from "@data/eudr/operator.data";

export type OperatorRequiredField =
  | "name"
  | "fullAddress"
  | "country"
  | "street"
  | "city"
  | "postalCode"
  | "eoriNumber"
  | "contactEmail"
  | "phoneNumber";

export class OperatorFormPage extends BasePage {
  readonly formTitle: Locator;

  readonly nameInput: Locator;
  readonly fullAddressInput: Locator;
  readonly countryInput: Locator;
  readonly streetInput: Locator;
  readonly cityInput: Locator;
  readonly postalCodeInput: Locator;
  readonly eoriNumberInput: Locator;
  readonly contactEmailInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly activeCheckbox: Locator;

  readonly saveButton: Locator;
  readonly updateButton: Locator;
  readonly cancelButton: Locator;
  readonly closeButton: Locator;

  constructor(page: Page) {
    super(page);

    this.formTitle = page.getByRole("heading", {
      name: /Create operator|Update operator|Edit operator/i,
    });

    this.nameInput = page.getByRole("textbox", { name: /Enter name/i });
    this.fullAddressInput = page.getByRole("textbox", {
      name: /Enter full address/i,
    });

    this.countryInput = page.getByRole("combobox", {
      name: /Select country/i,
    });

    this.streetInput = page.getByRole("textbox", { name: /Enter street/i });
    this.cityInput = page.getByRole("textbox", { name: /Select city/i });
    this.postalCodeInput = page.getByRole("textbox", {
      name: /Enter postal code/i,
    });

    this.eoriNumberInput = page.getByRole("textbox", {
      name: /Enter number/i,
    });

    this.contactEmailInput = page.getByRole("textbox", {
      name: /Enter contact email/i,
    });

    this.phoneNumberInput = page.getByRole("textbox", {
      name: /Enter phone number/i,
    });

    this.activeCheckbox = page.getByRole("checkbox").last();

    this.saveButton = page.getByRole("button", { name: /Save/i }).first();
    this.updateButton = page.getByRole("button", { name: /Update/i }).first();
    this.cancelButton = page.getByRole("button", { name: /Cancel/i }).first();
    this.closeButton = page
      .getByRole("button")
      .filter({ hasText: /×/ })
      .first();
  }

  async expectCreateLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /Create operator/i }),
    ).toBeVisible({ timeout: 30000 });

    await expect(this.nameInput).toBeVisible({ timeout: 10000 });
    await expect(this.fullAddressInput).toBeVisible({ timeout: 10000 });
    await expect(this.countryInput).toBeVisible({ timeout: 10000 });
    await expect(this.streetInput).toBeVisible({ timeout: 10000 });
    await expect(this.cityInput).toBeVisible({ timeout: 10000 });
    await expect(this.postalCodeInput).toBeVisible({ timeout: 10000 });
    await expect(this.eoriNumberInput).toBeVisible({ timeout: 10000 });
    await expect(this.contactEmailInput).toBeVisible({ timeout: 10000 });
    await expect(this.phoneNumberInput).toBeVisible({ timeout: 10000 });
  }

  async expectUpdateLoaded(): Promise<void> {
    await expect(this.formTitle).toBeVisible({ timeout: 30000 });
    await expect(this.nameInput).toBeVisible({ timeout: 10000 });
    await expect(this.updateButton).toBeVisible({ timeout: 10000 });
  }

  async selectCountry(country: string): Promise<void> {
    await this.countryInput.click();

    const option = this.page
      .getByRole("option")
      .filter({ hasText: country })
      .first();

    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();
  }

  async fillForm(data: OperatorTestData): Promise<void> {
    await this.nameInput.fill(data.name);
    await this.fullAddressInput.fill(data.fullAddress);
    await this.selectCountry(data.country);
    await this.streetInput.fill(data.street);
    await this.cityInput.fill(data.city);
    await this.postalCodeInput.fill(data.postalCode);
    await this.eoriNumberInput.fill(data.eoriNumber);
    await this.contactEmailInput.fill(data.contactEmail);
    await this.phoneNumberInput.fill(data.phoneNumber);

    if (data.isActive) {
      await this.activeCheckbox.check();
    } else {
      await this.activeCheckbox.uncheck().catch(() => {});
    }

    await expect(this.nameInput).toHaveValue(data.name);
    await expect(this.eoriNumberInput).toHaveValue(data.eoriNumber);
    await expect(this.contactEmailInput).toHaveValue(data.contactEmail);
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

  async expectSavedToast(): Promise<void> {
    await expect(this.page.getByText(/Success|success/i).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async close(): Promise<void> {
    await this.cancelButton.click().catch(async () => {
      await this.closeButton.click();
    });
  }

  async fillFormExcept(
    data: OperatorTestData,
    missingFields: OperatorRequiredField[],
  ): Promise<void> {
    if (!missingFields.includes("name")) {
      await this.nameInput.fill(data.name);
    }

    if (!missingFields.includes("fullAddress")) {
      await this.fullAddressInput.fill(data.fullAddress);
    }

    if (!missingFields.includes("country")) {
      await this.selectCountry(data.country);
    }

    if (!missingFields.includes("street")) {
      await this.streetInput.fill(data.street);
    }

    if (!missingFields.includes("city")) {
      await this.cityInput.fill(data.city);
    }

    if (!missingFields.includes("postalCode")) {
      await this.postalCodeInput.fill(data.postalCode);
    }

    if (!missingFields.includes("eoriNumber")) {
      await this.eoriNumberInput.fill(data.eoriNumber);
    }

    if (!missingFields.includes("contactEmail")) {
      await this.contactEmailInput.fill(data.contactEmail);
    }

    if (!missingFields.includes("phoneNumber")) {
      await this.phoneNumberInput.fill(data.phoneNumber);
    }

    if (data.isActive) {
      await this.activeCheckbox.check();
    }
  }

  async clickSaveExpectValidation(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();

    await this.page.waitForTimeout(500);
  }

  async expectValidationMessage(field: OperatorRequiredField): Promise<void> {
    const messageMap: Record<OperatorRequiredField, RegExp> = {
      name: /Name Is required|Name is required|Name.*required/i,
      fullAddress:
        /Full address Is required|Full address is required|Full address.*required/i,
      country:
        /CountryIs required or not selected from the list|Country is required|Country.*required|not selected from the list/i,
      street: /Street Is required|Street is required|Street.*required/i,
      city: /City Is required|City is required|City.*required/i,
      postalCode:
        /Postal code Is required|Postal code is required|Postal code.*required/i,
      eoriNumber:
        /EORI Number Is required|EORI Number is required|EORI.*required/i,
      contactEmail:
        /Contact email Is required|Contact email is required|Contact email.*required|Email.*required/i,
      phoneNumber:
        /Phone number Is required|Phone number is required|Phone.*required/i,
    };

    await expect(this.page.getByText(messageMap[field]).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async updateName(name: string): Promise<void> {
    await this.nameInput.click();
    await this.nameInput.press(
      process.platform === "darwin" ? "Meta+A" : "Control+A",
    );
    await this.nameInput.press("Backspace");
    await this.nameInput.fill(name);

    await expect(this.nameInput).toHaveValue(name, { timeout: 10000 });
  }

  async setActiveStatus(isActive: boolean): Promise<void> {
    if (isActive) {
      await this.activeCheckbox.check();
    } else {
      await this.activeCheckbox.uncheck();
    }
  }
}
