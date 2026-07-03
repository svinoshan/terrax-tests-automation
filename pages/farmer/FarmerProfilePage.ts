import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import {
  FarmerOrganizationalTestData,
  FarmerProfileTestData,
} from "@data/farmer/farmer-profile.data";

export type FarmerCommonRequiredField =
  | "nameWithInitials"
  | "fullName"
  | "address"
  | "country"
  | "city"
  | "fieldOfficer"
  | "supplierType";

export type FarmerOrganizationalRequiredField =
  | "mainUnit"
  | "subUnit"
  | "farmerCodeEUJAS"
  | "riskStatus";

export class FarmerProfilePage extends BasePage {
  readonly pageTitle: Locator;

  readonly nameWithInitialsInput: Locator;
  readonly fullNameInput: Locator;
  readonly fixedPhoneInput: Locator;
  readonly mobilePhoneInput: Locator;
  readonly nicInput: Locator;
  readonly addressInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly fieldOfficerInput: Locator;
  readonly genderSelect: Locator;
  readonly contactPersonInput: Locator;
  readonly contactPersonPhoneInput: Locator;
  readonly supplierTypeSelect: Locator;

  readonly organizationalTab: Locator;
  readonly landTab: Locator;
  readonly cropsTab: Locator;
  readonly euNopJasTab: Locator;

  readonly mainUnitInput: Locator;
  readonly subUnitInput: Locator;
  readonly farmerCodeEUJASInput: Locator;
  readonly farmerCodeNOPInput: Locator;
  readonly cbRefNoInput: Locator;
  readonly remarkInput: Locator;
  readonly riskStatusSelect: Locator;

  readonly saveButton: Locator;
  readonly backButton: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole("heading", { name: /farmer profile/i });

    this.nameWithInitialsInput = page.locator(
      '[formcontrolname="nameWtInitials"]',
    );
    this.fullNameInput = page.locator('[formcontrolname="fullName"]');
    this.fixedPhoneInput = page.locator('[formcontrolname="fixedPhone"]');
    this.mobilePhoneInput = page.locator('[formcontrolname="mobilePhone"]');
    this.nicInput = page.locator('[formcontrolname="nic"]');
    this.addressInput = page.locator('[formcontrolname="address"]');
    this.countryInput = page.locator('[formcontrolname="country"]');
    this.cityInput = page.locator('[formcontrolname="city"]');
    this.fieldOfficerInput = page.locator('[formcontrolname="fieldOfficer"]');
    this.genderSelect = page.locator('[formcontrolname="gender"]');
    this.contactPersonInput = page.locator('[formcontrolname="contactPerson"]');
    this.contactPersonPhoneInput = page.locator(
      '[formcontrolname="contactPersonTp"]',
    );
    this.supplierTypeSelect = page.locator('[formcontrolname="supplierType"]');

    this.organizationalTab = page.getByRole("tab", { name: /organizational/i });
    this.landTab = page.getByRole("tab", { name: /land/i });
    this.cropsTab = page.getByRole("tab", { name: /crops/i });
    this.euNopJasTab = page.getByRole("tab", { name: /eu\/nop\/jas/i });

    this.mainUnitInput = page.locator('[formcontrolname="fUnit"]');
    this.subUnitInput = page.locator('[formcontrolname="bUnit"]');
    this.farmerCodeEUJASInput = page.locator(
      '[formcontrolname="farmerCodeEUJAS"]',
    );
    this.farmerCodeNOPInput = page.locator('[formcontrolname="farmerCodeNOP"]');
    this.cbRefNoInput = page.locator('[formcontrolname="cuRefId"]');
    this.remarkInput = page.locator('[formcontrolname="remark"]');
    this.riskStatusSelect = page.locator('[formcontrolname="riskStatus"]');

    this.saveButton = page
      .locator("button")
      .filter({ hasText: /save/i })
      .first();
    this.backButton = page
      .locator("button")
      .filter({ hasText: /back/i })
      .first();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
  }

  async expectCommonInfoFieldsVisible(): Promise<void> {
    await expect(this.nameWithInitialsInput).toBeVisible();
    await expect(this.fullNameInput).toBeVisible();
    await expect(this.fixedPhoneInput).toBeVisible();
    await expect(this.mobilePhoneInput).toBeVisible();
    await expect(this.nicInput).toBeVisible();
    await expect(this.addressInput).toBeVisible();
    await expect(this.countryInput).toBeVisible();
    await expect(this.cityInput).toBeVisible();
    await expect(this.fieldOfficerInput).toBeVisible();
    await expect(this.genderSelect).toBeVisible();
    await expect(this.contactPersonInput).toBeVisible();
    await expect(this.contactPersonPhoneInput).toBeVisible();
    await expect(this.supplierTypeSelect).toBeVisible();
  }

  async expectTabsVisible(): Promise<void> {
    await expect(this.organizationalTab).toBeVisible();
    await expect(this.landTab).toBeVisible();
    await expect(this.cropsTab).toBeVisible();
    await expect(this.euNopJasTab).toBeVisible();
  }

  async expectOrganizationalFieldsVisible(): Promise<void> {
    await this.organizationalTab.click();

    await expect(this.mainUnitInput).toBeVisible();
    await expect(this.subUnitInput).toBeVisible();
    await expect(this.farmerCodeEUJASInput).toBeVisible();
    await expect(this.farmerCodeNOPInput).toBeVisible();
    await expect(this.cbRefNoInput).toBeVisible();
    await expect(this.remarkInput).toBeVisible();
    await expect(this.riskStatusSelect).toBeVisible();
  }

  async selectAutocomplete(input: Locator, value: string): Promise<void> {
    await input.click();
    await input.fill(value);

    const option = this.page.getByText(value, { exact: true }).first();

    try {
      await option.waitFor({ state: "visible", timeout: 5000 });
      await option.click();
    } catch {
      await input.press("Enter").catch(() => {});
    }
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

  async fillCommonInfo(data: FarmerProfileTestData): Promise<void> {
    await this.fillCommonInfoExcept(data, []);
  }

  async fillCommonInfoExcept(
    data: FarmerProfileTestData,
    missingFields: FarmerCommonRequiredField[],
  ): Promise<void> {
    if (!missingFields.includes("nameWithInitials")) {
      await this.nameWithInitialsInput.fill(data.nameWithInitials);
    }

    if (!missingFields.includes("fullName")) {
      await this.fullNameInput.fill(data.fullName);
    }

    await this.fixedPhoneInput.fill(data.fixedPhone);
    await this.mobilePhoneInput.fill(data.mobilePhone);
    await this.nicInput.fill(data.nic);

    if (!missingFields.includes("address")) {
      await this.addressInput.fill(data.address);
    }

    if (!missingFields.includes("country")) {
      await this.selectAutocomplete(this.countryInput, data.country);
    }

    if (!missingFields.includes("city")) {
      await this.selectAutocomplete(this.cityInput, data.city);
    }

    if (!missingFields.includes("fieldOfficer")) {
      await this.selectAutocomplete(this.fieldOfficerInput, data.fieldOfficer);
    }

    await this.selectMatOption(this.genderSelect, data.gender);

    await this.contactPersonInput.fill(data.contactPerson);
    await this.contactPersonPhoneInput.fill(data.contactPersonPhone);

    if (!missingFields.includes("supplierType")) {
      await this.selectMatOption(this.supplierTypeSelect, data.supplierType);
    }
  }

  async fillOrganizationalInfo(
    data: FarmerOrganizationalTestData,
  ): Promise<void> {
    await this.fillOrganizationalInfoExcept(data, []);
  }

  async fillOrganizationalInfoExcept(
    data: FarmerOrganizationalTestData,
    missingFields: FarmerOrganizationalRequiredField[],
  ): Promise<void> {
    await this.organizationalTab.click();

    if (!missingFields.includes("mainUnit")) {
      await this.selectAutocomplete(this.mainUnitInput, data.mainUnit);
    }

    if (!missingFields.includes("subUnit")) {
      await this.selectAutocomplete(this.subUnitInput, data.subUnit);
    }

    if (!missingFields.includes("farmerCodeEUJAS")) {
      await this.farmerCodeEUJASInput.fill(data.farmerCodeEUJAS);
    }

    await this.farmerCodeNOPInput.fill(data.farmerCodeNOP);
    await this.cbRefNoInput.fill(data.cbRefNo);
    await this.remarkInput.fill(data.remark);

    if (!missingFields.includes("riskStatus")) {
      await this.selectMatOption(this.riskStatusSelect, data.riskStatus);
    }
  }

  async save(): Promise<void> {
    await this.saveButton.click();
    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectFarmerSavedToast(): Promise<void> {
    await expect(
      this.page.getByText(/Success|success|Farmer Created|Created/i).first(),
    ).toBeVisible({ timeout: 10000 });
  }

  async back(): Promise<void> {
    await this.page
      .locator(".ngx-spinner-overlay")
      .waitFor({ state: "hidden", timeout: 30000 })
      .catch(() => {});

    await this.backButton.click();
  }

  async dismissPleaseFillFormPopupIfVisible(): Promise<void> {
    const popup = this.page.getByText(/Please fill the form/i);
    const okButton = this.page.getByRole("button", { name: /^Ok$/i });

    try {
      await popup.waitFor({ state: "visible", timeout: 3000 });
      await okButton.click();
      await expect(popup).toBeHidden({ timeout: 10000 });
    } catch {
      // Popup did not appear. Continue test.
    }
  }

  async expectCommonFieldInvalid(
    field: FarmerCommonRequiredField,
  ): Promise<void> {
    await this.dismissPleaseFillFormPopupIfVisible();

    const fieldLocatorMap: Record<FarmerCommonRequiredField, Locator> = {
      nameWithInitials: this.nameWithInitialsInput,
      fullName: this.fullNameInput,
      address: this.addressInput,
      country: this.countryInput,
      city: this.cityInput,
      fieldOfficer: this.fieldOfficerInput,
      supplierType: this.supplierTypeSelect,
    };

    await expect(fieldLocatorMap[field]).toHaveClass(/ng-invalid/);
  }

  async expectOrganizationalFieldInvalid(
    field: FarmerOrganizationalRequiredField,
  ): Promise<void> {
    await this.dismissPleaseFillFormPopupIfVisible();

    const fieldLocatorMap: Record<FarmerOrganizationalRequiredField, Locator> =
      {
        mainUnit: this.mainUnitInput,
        subUnit: this.subUnitInput,
        farmerCodeEUJAS: this.farmerCodeEUJASInput,
        riskStatus: this.riskStatusSelect,
      };

    // The Organizational tab is usually already active after Save.
    // Only click if the expected field is not visible.
    if (!(await fieldLocatorMap[field].isVisible().catch(() => false))) {
      await this.organizationalTab.click();
    }

    await expect(fieldLocatorMap[field]).toHaveClass(/ng-invalid/);
  }
}
