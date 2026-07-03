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

  readonly applicationDateInput: Locator;
  readonly mainUnitInput: Locator;
  readonly subUnitInput: Locator;
  readonly farmerCodeEUJASInput: Locator;
  readonly farmerCodeNOPInput: Locator;
  readonly cbRefNoInput: Locator;
  readonly remarkInput: Locator;
  readonly riskStatusSelect: Locator;

  readonly saveButton: Locator;
  readonly updateButton: Locator;
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

    this.applicationDateInput = page.locator(
      '[formcontrolname="applicationDate"]',
    );
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

    this.updateButton = page
      .locator("button")
      .filter({ hasText: /update/i })
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

    await this.applicationDateInput.fill(data.applicationDate);
    await this.applicationDateInput.blur();

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

  async getSupplierTypeText(): Promise<string> {
    return (await this.supplierTypeSelect.innerText()).trim();
  }

  async expectSupplierTypeValue(expectedSupplierType: string): Promise<void> {
    const supplierTypeText = await this.getSupplierTypeText();

    expect(supplierTypeText).toContain(expectedSupplierType);
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

  // async updateBasicFarmerInfo(
  //   nameWithInitials: string,
  //   contactPersonPhone: string,
  // ): Promise<void> {
  //   await this.nameWithInitialsInput.fill(nameWithInitials);
  //   await this.contactPersonPhoneInput.fill(contactPersonPhone);

  //   await expect(this.nameWithInitialsInput).toHaveValue(nameWithInitials);
  //   await expect(this.contactPersonPhoneInput).toHaveValue(contactPersonPhone);
  // }
  async updateBasicFarmerInfo(
    nameWithInitials: string,
    contactPersonPhone: string,
  ): Promise<void> {
    await this.nameWithInitialsInput.click();
    await this.nameWithInitialsInput.press(
      process.platform === "darwin" ? "Meta+A" : "Control+A",
    );
    await this.nameWithInitialsInput.press("Backspace");
    await this.nameWithInitialsInput.fill(nameWithInitials);

    await this.contactPersonPhoneInput.click();
    await this.contactPersonPhoneInput.press(
      process.platform === "darwin" ? "Meta+A" : "Control+A",
    );
    await this.contactPersonPhoneInput.press("Backspace");
    await this.contactPersonPhoneInput.fill(contactPersonPhone);

    await expect(this.nameWithInitialsInput).toHaveValue(nameWithInitials, {
      timeout: 10000,
    });

    await expect(this.contactPersonPhoneInput).toHaveValue(contactPersonPhone, {
      timeout: 10000,
    });
  }

  async expectBasicFarmerInfoValues(
    nameWithInitials: string,
    contactPersonPhone: string,
  ): Promise<void> {
    await expect(this.nameWithInitialsInput).toHaveValue(nameWithInitials, {
      timeout: 10000,
    });

    await expect(this.contactPersonPhoneInput).toHaveValue(contactPersonPhone, {
      timeout: 10000,
    });
  }

  async update(): Promise<void> {
    await this.updateButton.click();
    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectFarmerUpdatedToast(): Promise<void> {
    await expect(
      this.page.getByText(/Success|success|Updated|update/i).first(),
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

  // async getMatSelectDisplayedText(selectControl: Locator): Promise<string> {
  //   const selectedValue = selectControl
  //     .locator(".mat-mdc-select-value-text")
  //     .first();

  //   if (await selectedValue.isVisible().catch(() => false)) {
  //     return (await selectedValue.innerText()).trim();
  //   }

  //   return (await selectControl.innerText()).trim();
  // }

  // async expectMatSelectSelectedValue(
  //   selectControl: Locator,
  //   expectedValue: string,
  // ): Promise<void> {
  //   const selectedValue = selectControl
  //     .locator(".mat-mdc-select-value-text")
  //     .first();

  //   await expect(selectedValue).toBeVisible({ timeout: 10000 });
  //   await expect(selectedValue).toContainText(expectedValue, {
  //     timeout: 10000,
  //   });
  // }

  async getMatSelectDisplayedText(selectControl: Locator): Promise<string> {
    const selectedText = selectControl
      .locator(".mat-mdc-select-value-text")
      .first();

    if (
      (await selectedText.count()) > 0 &&
      (await selectedText.isVisible().catch(() => false))
    ) {
      return (await selectedText.innerText()).replace(/\s+/g, " ").trim();
    }

    const placeholder = selectControl
      .locator(".mat-mdc-select-placeholder")
      .first();

    if (
      (await placeholder.count()) > 0 &&
      (await placeholder.isVisible().catch(() => false))
    ) {
      return (await placeholder.innerText()).replace(/\s+/g, " ").trim();
    }

    return (await selectControl.innerText()).replace(/\s+/g, " ").trim();
  }

  // async expectMatSelectSelectedValue(
  //   selectControl: Locator,
  //   expectedValue: string,
  // ): Promise<void> {
  //   await expect
  //     .poll(async () => await this.getMatSelectDisplayedText(selectControl), {
  //       timeout: 10000,
  //       message: `Expected mat-select value to contain "${expectedValue}"`,
  //     })
  //     .toContain(expectedValue);
  // }

  async expectMatSelectSelectedValue(
    selectControl: Locator,
    expectedValue: string,
  ): Promise<void> {
    await expect
      .poll(async () => await this.getMatSelectDisplayedText(selectControl), {
        timeout: 10000,
        message: `Expected mat-select value to equal "${expectedValue}"`,
      })
      .toBe(expectedValue);
  }

  async expectCreatedFarmerCommonInfoPersisted(
    data: FarmerProfileTestData,
  ): Promise<void> {
    await expect(this.nameWithInitialsInput).toHaveValue(data.nameWithInitials);
    await expect(this.fullNameInput).toHaveValue(data.fullName);
    await expect(this.fixedPhoneInput).toHaveValue(data.fixedPhone);
    await expect(this.mobilePhoneInput).toHaveValue(data.mobilePhone);
    await expect(this.nicInput).toHaveValue(data.nic);
    await expect(this.addressInput).toHaveValue(data.address);
    await expect(this.countryInput).toHaveValue(data.country);
    await expect(this.cityInput).toHaveValue(data.city);
    await expect(this.fieldOfficerInput).toHaveValue(data.fieldOfficer);
    await expect(this.contactPersonInput).toHaveValue(data.contactPerson);
    await expect(this.contactPersonPhoneInput).toHaveValue(
      data.contactPersonPhone,
    );

    await this.expectMatSelectSelectedValue(this.genderSelect, data.gender);
    await this.expectMatSelectSelectedValue(
      this.supplierTypeSelect,
      data.supplierType,
    );
  }

  async expectCreatedFarmerOrganizationalInfoPersisted(
    data: FarmerOrganizationalTestData,
  ): Promise<void> {
    await this.organizationalTab.click();

    await expect(this.applicationDateInput).toHaveValue(data.applicationDate);
    await expect(this.mainUnitInput).toHaveValue(data.mainUnit);
    await expect(this.subUnitInput).toHaveValue(data.subUnit);
    await expect(this.farmerCodeEUJASInput).toHaveValue(data.farmerCodeEUJAS);
    await expect(this.farmerCodeNOPInput).toHaveValue(data.farmerCodeNOP);
    await expect(this.cbRefNoInput).toHaveValue(data.cbRefNo);
    await expect(this.remarkInput).toHaveValue(data.remark);

    await this.expectMatSelectSelectedValue(
      this.riskStatusSelect,
      data.riskStatus,
    );
  }

  async collectCreatedFarmerPersistenceMismatches(
    profileData: FarmerProfileTestData,
    orgData: FarmerOrganizationalTestData,
  ): Promise<string[]> {
    const mismatches: string[] = [];

    const normalize = (value: string): string =>
      value.replace(/\s+/g, " ").trim();

    const checkInput = async (
      label: string,
      locator: Locator,
      expectedValue: string,
    ): Promise<void> => {
      const actualValue = normalize(await locator.inputValue());

      if (actualValue !== expectedValue) {
        mismatches.push(
          `${label}: expected "${expectedValue}", actual "${actualValue}"`,
        );
      }
    };

    const checkSelect = async (
      label: string,
      locator: Locator,
      expectedValue: string,
    ): Promise<void> => {
      const actualValue = normalize(
        await this.getMatSelectDisplayedText(locator),
      );

      // if (!actualValue.includes(expectedValue)) {
      //   mismatches.push(
      //     `${label}: expected "${expectedValue}", actual "${actualValue}"`,
      //   );
      // }

      if (actualValue !== expectedValue) {
        mismatches.push(
          `${label}: expected "${expectedValue}", actual "${actualValue}"`,
        );
      }
    };

    await checkInput(
      "Name with initials",
      this.nameWithInitialsInput,
      profileData.nameWithInitials,
    );

    await checkInput("Full name", this.fullNameInput, profileData.fullName);
    await checkInput(
      "Fixed phone",
      this.fixedPhoneInput,
      profileData.fixedPhone,
    );
    await checkInput(
      "Mobile phone",
      this.mobilePhoneInput,
      profileData.mobilePhone,
    );
    await checkInput("NIC/passport", this.nicInput, profileData.nic);
    await checkInput("Address", this.addressInput, profileData.address);
    await checkInput("Country", this.countryInput, profileData.country);
    await checkInput("City", this.cityInput, profileData.city);
    await checkInput(
      "Field officer",
      this.fieldOfficerInput,
      profileData.fieldOfficer,
    );
    await checkInput(
      "Contact person",
      this.contactPersonInput,
      profileData.contactPerson,
    );
    await checkInput(
      "Contact person phone",
      this.contactPersonPhoneInput,
      profileData.contactPersonPhone,
    );

    await checkSelect("Gender", this.genderSelect, profileData.gender);
    await checkSelect(
      "Supplier type",
      this.supplierTypeSelect,
      profileData.supplierType,
    );

    await this.organizationalTab.click();

    await checkInput(
      "Application date",
      this.applicationDateInput,
      orgData.applicationDate,
    );
    await checkInput("Main unit", this.mainUnitInput, orgData.mainUnit);
    await checkInput("Sub unit", this.subUnitInput, orgData.subUnit);
    await checkInput(
      "Farmer code",
      this.farmerCodeEUJASInput,
      orgData.farmerCodeEUJAS,
    );
    await checkInput(
      "Farmer code NOP",
      this.farmerCodeNOPInput,
      orgData.farmerCodeNOP,
    );
    await checkInput("CB ref no", this.cbRefNoInput, orgData.cbRefNo);
    await checkInput("Remark", this.remarkInput, orgData.remark);

    await checkSelect("Risk status", this.riskStatusSelect, orgData.riskStatus);

    return mismatches;
  }
}
