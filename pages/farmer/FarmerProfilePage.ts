import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import {
  FarmerOrganizationalTestData,
  FarmerProfileTestData,
  FarmerCropTestData,
  FarmerEuNopJasTestData,
  FarmerLandTestData,
  FarmerDossierTestData,
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
  readonly dossierTab: Locator;

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
  readonly inactiveSwitch: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole('heading', { name: 'Farmer profile' });

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

    this.organizationalTab = page.getByRole('heading', { name: 'Organizational' });
    this.landTab = page.getByRole("tab", { name: /land/i });
    this.cropsTab = page.getByRole("tab", { name: /crops/i });
    this.euNopJasTab = page.getByRole("tab", { name: /eu\/nop\/jas/i });
    this.dossierTab = this.page.getByRole("tab", { name: /Dossier/i });

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

    this.inactiveSwitch = page.locator("#flexSwitchCheckDefault");
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
  }

  // async ensureFarmerActive(): Promise<void> {
  //   if (await this.inactiveSwitch.isChecked().catch(() => false)) {
  //     await this.inactiveSwitch.uncheck();
  //   }

  //   await expect(this.inactiveSwitch).not.toBeChecked();
  // }
  // async ensureFarmerActive(): Promise<void> {
  //   await expect(this.inactiveSwitch).toBeVisible({ timeout: 10000 });

  //   // In this app:
  //   // unchecked = Inactive
  //   // checked = Active
  //   if (!(await this.inactiveSwitch.isChecked())) {
  //     await this.inactiveSwitch.check();
  //   }

  //   await expect(this.inactiveSwitch).toBeChecked();

  //   await expect(
  //     this.page.locator('label[for="flexSwitchCheckDefault"]'),
  //   ).toContainText(/Active/i);
  // }

  // async ensureFarmerInactive(): Promise<void> {
  //   await expect(this.inactiveSwitch).toBeVisible({ timeout: 10000 });

  //   if (await this.inactiveSwitch.isChecked()) {
  //     await this.inactiveSwitch.uncheck();
  //   }

  //   await expect(this.inactiveSwitch).not.toBeChecked();

  //   await expect(
  //     this.page.locator('label[for="flexSwitchCheckDefault"]'),
  //   ).toContainText(/Inactive/i);
  // }

  private async openProfileTab(): Promise<void> {
    const profileTab = this.page.getByRole("tab", { name: /^Profile/i });

    await expect(profileTab).toBeVisible({ timeout: 10000 });
    await profileTab.click();

    await expect(this.nameWithInitialsInput).toBeVisible({ timeout: 15000 });
  }

  private async currentActiveSwitch(): Promise<Locator> {
    await this.openProfileTab();

    const switchLocator = this.page
      .locator("#flexSwitchCheckDefault")
      .or(
        this.page.getByRole("checkbox").filter({ hasText: /Active|Inactive/i }),
      )
      .first();

    await expect(switchLocator).toBeVisible({ timeout: 15000 });

    return switchLocator;
  }

  async ensureFarmerActive(): Promise<void> {
    const activeSwitch = await this.currentActiveSwitch();

    // In this app:
    // unchecked = Inactive
    // checked = Active
    if (!(await activeSwitch.isChecked())) {
      await activeSwitch.check();
    }

    await expect(activeSwitch).toBeChecked();

    await expect(
      this.page.locator('label[for="flexSwitchCheckDefault"]'),
    ).toContainText(/Active/i);
  }

  async ensureFarmerInactive(): Promise<void> {
    const activeSwitch = await this.currentActiveSwitch();

    if (await activeSwitch.isChecked()) {
      await activeSwitch.uncheck();
    }

    await expect(activeSwitch).not.toBeChecked();

    await expect(
      this.page.locator('label[for="flexSwitchCheckDefault"]'),
    ).toContainText(/Inactive/i);
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
    //await this.organizationalTab.click();

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

    await this.openProfileTab();

    const fieldLocatorMap: Record<FarmerCommonRequiredField, Locator> = {
      nameWithInitials: this.nameWithInitialsInput,
      fullName: this.fullNameInput,
      address: this.addressInput,
      country: this.countryInput,
      city: this.cityInput,
      fieldOfficer: this.fieldOfficerInput,
      supplierType: this.supplierTypeSelect,
    };

    //await expect(fieldLocatorMap[field]).toHaveClass(/ng-invalid/);
    const targetField = fieldLocatorMap[field];

    await expect(targetField).toBeVisible({ timeout: 15000 });
    await expect(targetField).toHaveClass(/ng-invalid/, { timeout: 10000 });
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
    // if (!(await fieldLocatorMap[field].isVisible().catch(() => false))) {
    //   await this.organizationalTab.click();
    // }

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
    //await this.organizationalTab.click();

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

    //await this.organizationalTab.click();

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

  private async selectMatOptionInScope(
    scope: Locator,
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

    await expect(scope).toBeVisible();
  }

  private async selectMultiMatOptionsInScope(
    scope: Locator,
    selectControl: Locator,
    optionNames: string[],
  ): Promise<void> {
    await selectControl.click();

    for (const optionName of optionNames) {
      const option = this.page
        .getByRole("option")
        .filter({ hasText: optionName })
        .first();

      await expect(option).toBeVisible({ timeout: 10000 });
      await option.click();
    }

    await this.page
      .locator(".cdk-overlay-backdrop")
      .click()
      .catch(() => {});
    await expect(scope).toBeVisible();
  }

  private async selectAutocompleteInScope(
    input: Locator,
    value: string,
  ): Promise<void> {
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

  private async refreshPlotCodeOptions(scope: Locator): Promise<void> {
    const refreshButton = scope
      .locator('button:has(i.fa-rotate-right), button:has(i[class*="rotate"])')
      .first();

    if (await refreshButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await refreshButton.click();

      await this.page
        .waitForLoadState("networkidle", { timeout: 10000 })
        .catch(() => {});

      await this.page.waitForTimeout(750);
    }
  }

  private landPlotForm(): Locator {
    return this.page
      .locator("form")
      .filter({ hasText: /Plot type|Plot code|Land name/i })
      .last();
  }

  private async openCreateLandPlotPanel(): Promise<void> {
    await this.landTab.click();

    await expect(
      this.page.getByText(/Plots And Land Configurations/i),
    ).toBeVisible({ timeout: 15000 });

    const addNewButton = this.page
      .getByRole("button", { name: /Add new/i })
      .or(this.page.locator("button").filter({ hasText: /Add new/i }))
      .last();

    await expect(addNewButton).toBeVisible({ timeout: 15000 });
    await addNewButton.click();

    await expect(
      this.page.getByRole("heading", { name: /Create land plot/i }),
    ).toBeVisible({ timeout: 15000 });

    await expect(this.landPlotForm()).toBeVisible({ timeout: 15000 });
  }

  private async selectLandPlotCombobox(
    index: number,
    optionName: string | RegExp,
    exact = false,
  ): Promise<void> {
    const form = this.landPlotForm();
    const combobox = form.getByRole("combobox").nth(index);

    await expect(combobox).toBeVisible({ timeout: 15000 });
    await combobox.click();

    const option =
      typeof optionName === "string"
        ? this.page.getByRole("option", { name: optionName, exact }).first()
        : this.page.getByRole("option", { name: optionName }).first();

    await expect(option).toBeVisible({ timeout: 15000 });
    await option.click();
  }

  private async selectLandPlotMultiCombobox(
    index: number,
    optionNames: string[],
  ): Promise<void> {
    const form = this.landPlotForm();
    const combobox = form.getByRole("combobox").nth(index);

    await expect(combobox).toBeVisible({ timeout: 15000 });
    await combobox.click();

    for (const optionName of optionNames) {
      const option = this.page
        .getByRole("option")
        .filter({ hasText: optionName })
        .first();

      await expect(option).toBeVisible({ timeout: 15000 });
      await option.click();
    }

    await this.page
      .locator(".cdk-overlay-backdrop")
      .click()
      .catch(() => {});
    await this.page.keyboard.press("Escape").catch(() => {});
  }

  // async addLandRecord(data: FarmerLandTestData): Promise<void> {
  //   await this.landTab.click();

  //   const landTab = this.page.locator("app-land-tab");

  //   const plotTypeSelect = landTab.locator('[formcontrolname="plotType"]');
  //   const plotCodeSelect = landTab.locator('[formcontrolname="plotCode"]');
  //   const landNameInput = landTab.locator('[formcontrolname="landName"]');
  //   const landExtendInput = landTab.locator('[formcontrolname="landExtend"]');
  //   const purchaseStatusSelect = landTab.locator(
  //     '[formcontrolname="perchaseActive"]',
  //   );
  //   const certificationsSelect = landTab.locator(
  //     '[formcontrolname="certifications"]',
  //   );
  //   const landDocsAvailableSelect = landTab.locator(
  //     '[formcontrolname="landDocsAvailable"]',
  //   );
  //   // const landDocumentationSelect = landTab.locator(
  //   //   '[formcontrolname="landDocs"]',
  //   // );

  //   const landDocumentationSelect = landTab
  //     .locator("mat-select")
  //     .filter({
  //       hasText: /Select option|Land ownership|Right for agricultural use/i,
  //     })
  //     .first();

  //   const refNumberInput = landTab.locator('[formcontrolname="refNumber"]');
  //   const extraEvidenceInput = landTab.locator(
  //     '[formcontrolname="extraEvidence"]',
  //   );

  //   await expect(landTab).toBeVisible({ timeout: 10000 });

  //   await this.selectMatOptionInScope(landTab, plotTypeSelect, data.plotType);
  //   await this.selectMatOptionInScope(landTab, plotCodeSelect, data.plotCode);

  //   await landNameInput.fill(data.landName);
  //   await landExtendInput.fill(data.landExtend);

  //   await this.selectMatOptionInScope(
  //     landTab,
  //     purchaseStatusSelect,
  //     data.purchaseStatus,
  //   );

  //   await this.selectMultiMatOptionsInScope(
  //     landTab,
  //     certificationsSelect,
  //     data.certifications,
  //   );

  //   await this.selectMatOptionInScope(
  //     landTab,
  //     landDocsAvailableSelect,
  //     data.landDocsAvailable,
  //   );

  //   await this.selectMatOptionInScope(
  //     landTab,
  //     landDocumentationSelect,
  //     data.landDocumentation,
  //   );

  //   await refNumberInput.fill(data.refNumber);
  //   await extraEvidenceInput.fill(data.extraEvidence);

  //   await landTab.locator("button.btn-success").last().click();
  //   // await landTab
  //   //   .locator("button.btn-success")
  //   //   .filter({ has: landTab.locator("i.feather.icon-plus") })
  //   //   .click();

  //   await expect(
  //     landTab.getByRole("cell", { name: data.plotCode }).first(),
  //   ).toBeVisible({
  //     timeout: 10000,
  //   });

  //   await expect(landTab.getByText(data.landName).first()).toBeVisible({
  //     timeout: 10000,
  //   });
  // }
  async addLandRecord(data: FarmerLandTestData): Promise<void> {
    await this.openCreateLandPlotPanel();

    const form = this.landPlotForm();

    // Create land plot combobox order in the new side panel:
    // 0 = Plot type
    // 1 = Plot code
    // 2 = Purchase status
    // 3 = Certifications
    // 4 = Land docs available
    // 5 = Land docs type
    await this.selectLandPlotCombobox(0, data.plotType);
    await this.selectLandPlotCombobox(1, data.plotCode, true);

    const landNameInput = form.getByRole("textbox", {
      name: /Enter Land name/i,
    });

    const landExtendInput = form.getByRole("textbox", {
      name: /Enter Land extend/i,
    });

    await expect(landNameInput).toBeVisible({ timeout: 10000 });
    await landNameInput.fill(data.landName);

    await expect(landExtendInput).toBeVisible({ timeout: 10000 });
    await landExtendInput.fill(data.landExtend);

    await this.selectLandPlotCombobox(2, data.purchaseStatus);
    await this.selectLandPlotMultiCombobox(3, data.certifications);
    await this.selectLandPlotCombobox(4, data.landDocsAvailable);
    await this.selectLandPlotCombobox(5, data.landDocumentation);

    const refNumberInput = form.getByRole("textbox", {
      name: /Enter Ref number/i,
    });

    if (await refNumberInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await refNumberInput.fill(data.refNumber);
    }

    const extraEvidenceInput = form.getByRole("textbox", {
      name: /Enter additional evidence/i,
    });

    if (
      await extraEvidenceInput.isVisible({ timeout: 3000 }).catch(() => false)
    ) {
      await extraEvidenceInput.fill(data.extraEvidence);
    }

    const addButton = form
      .getByRole("button", { name: /^.*Add$/i })
      .or(this.page.getByRole("button", { name: /^.*Add$/i }))
      .last();

    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    await expect(this.page.getByRole("heading", { name: /Create land plot/i }))
      .toBeHidden({ timeout: 15000 })
      .catch(() => {});

    await expect(
      this.page.getByRole("cell", { name: data.plotCode }).first(),
    ).toBeVisible({
      timeout: 15000,
    });

    await expect(this.page.getByText(data.landName).first()).toBeVisible({
      timeout: 15000,
    });
  }

  private cropForm(): Locator {
    return this.page
      .locator("form")
      .filter({ hasText: /Plot code|Crop name|No of plants/i })
      .last();
  }

  private async openCreateCropPanel(): Promise<void> {
    await this.cropsTab.click();

    await expect(this.page.getByText(/Crop Configurations/i)).toBeVisible({
      timeout: 15000,
    });

    const addNewButton = this.page
      .getByRole("button", { name: /Add new/i })
      .or(this.page.locator("button").filter({ hasText: /Add new/i }))
      .last();

    await expect(addNewButton).toBeVisible({ timeout: 15000 });
    await addNewButton.click();

    await expect(
      this.page.getByText(/Create crop record|Fill required fields/i).first(),
    ).toBeVisible({ timeout: 15000 });

    await expect(this.cropForm()).toBeVisible({ timeout: 15000 });
  }

  private async refreshCropPlotCodeOptions(): Promise<void> {
    const refreshButton = this.page
      .getByRole("button", {
        name: /Refresh Plot code/i,
      })
      .or(
        this.page.getByRole("button", {
          description: /Refresh Plot code/i,
        }),
      )
      .or(this.cropForm().locator("button").filter({ hasText: /^$/ }))
      .first();

    if (await refreshButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await refreshButton.click();

      await this.page
        .waitForLoadState("networkidle", { timeout: 10000 })
        .catch(() => {});

      await this.page.waitForTimeout(500);
    }
  }

  private async selectCropPlotCodeWithFallback(
    preferredPlotCode: string,
  ): Promise<string> {
    const form = this.cropForm();

    await this.refreshCropPlotCodeOptions();

    const plotCodeCombobox = form.getByRole("combobox").first();

    await expect(plotCodeCombobox).toBeVisible({ timeout: 15000 });
    await plotCodeCombobox.click();

    let options = this.page.getByRole("option");

    let hasOptions = await options
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (!hasOptions) {
      await this.page.keyboard.press("Escape").catch(() => {});
      await this.refreshCropPlotCodeOptions();

      await plotCodeCombobox.click();

      options = this.page.getByRole("option");

      hasOptions = await options
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false);
    }

    if (!hasOptions) {
      throw new Error(
        "No plot code options found in Create crop record panel.",
      );
    }

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const selectedText =
      optionTexts.find((text) => text === preferredPlotCode) ??
      optionTexts.find((text) => text.includes(preferredPlotCode)) ??
      optionTexts[0];

    await this.page
      .getByRole("option")
      .filter({ hasText: selectedText })
      .first()
      .click();

    return selectedText;
  }

  private async selectCropNameWithFallback(
    preferredCropName: string,
  ): Promise<string> {
    const cropNameCombobox = this.page
      .getByRole("combobox", { name: /Select Crop name/i })
      .or(this.cropForm().getByRole("combobox").nth(1))
      .first();

    await expect(cropNameCombobox).toBeVisible({ timeout: 15000 });
    await cropNameCombobox.click();

    const options = this.page.getByRole("option");

    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const selectedText =
      optionTexts.find((text) =>
        text.toLowerCase().includes(preferredCropName.toLowerCase()),
      ) ?? optionTexts[0];

    await this.page
      .getByRole("option")
      .filter({ hasText: selectedText })
      .first()
      .click();

    return selectedText;
  }

  // async addCropRecord(data: FarmerCropTestData): Promise<void> {
  //   await this.cropsTab.click();

  //   const cropsTab = this.page.locator("app-crops-tab");

  //   const plotCodeSelect = cropsTab.locator('[formcontrolname="plotCode"]');
  //   const cropNameInput = cropsTab.locator('[formcontrolname="cropName"]');
  //   const noOfPlantsInput = cropsTab.locator('[formcontrolname="noOfPlant"]');

  //   await expect(cropsTab).toBeVisible({ timeout: 10000 });

  //   // Plot codes may not load immediately after adding Land.
  //   // Refresh is required before selecting the new plot code.
  //   await this.refreshPlotCodeOptions(cropsTab);

  //   await this.selectMatOptionInScope(cropsTab, plotCodeSelect, data.plotCode);
  //   await this.selectAutocompleteInScope(cropNameInput, data.cropName);
  //   await noOfPlantsInput.fill(data.noOfPlants);

  //   await cropsTab.locator("button.btn-success").last().click();

  //   await expect(
  //     cropsTab.getByRole("cell", { name: data.plotCode }).first(),
  //   ).toBeVisible({
  //     timeout: 10000,
  //   });

  //   await expect(cropsTab.getByText(data.cropName).first()).toBeVisible({
  //     timeout: 10000,
  //   });
  // }
  async addCropRecord(data: FarmerCropTestData): Promise<void> {
    await this.openCreateCropPanel();

    const selectedPlotCode = await this.selectCropPlotCodeWithFallback(
      data.plotCode,
    );

    const selectedCropName = await this.selectCropNameWithFallback(
      data.cropName,
    );

    const noOfPlantsInput = this.page
      .getByRole("textbox", { name: /Enter No of plants/i })
      .or(this.cropForm().locator("input").last())
      .first();

    await expect(noOfPlantsInput).toBeVisible({ timeout: 15000 });
    await noOfPlantsInput.fill(data.noOfPlants);

    const addButton = this.page
      .getByRole("button", { name: /^.*Add$/i })
      .last();

    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    await expect(this.page.getByText(/Create crop record/i))
      .toBeHidden({ timeout: 15000 })
      .catch(() => {});

    await expect(
      this.page.getByRole("cell", { name: selectedPlotCode }).first(),
    ).toBeVisible({
      timeout: 15000,
    });

    await expect(this.page.getByText(selectedCropName).first()).toBeVisible({
      timeout: 15000,
    });
  }

  private euNopJasForm(): Locator {
    return this.page
      .locator("form")
      .filter({
        hasText:
          /Plot code|Field status EU\/JAS|Field status NOP|Harvest status EU\/JAS|Harvest status NOP|Fertilizer/i,
      })
      .last();
  }

  private async openCreateEuNopJasPanel(): Promise<void> {
    await this.euNopJasTab.click();

    await expect(
      this.page.getByText(/Certification details configurations/i),
    ).toBeVisible({ timeout: 15000 });

    const addNewButton = this.page
      .getByRole("button", { name: /Add new/i })
      .or(this.page.locator("button").filter({ hasText: /Add new/i }))
      .last();

    await expect(addNewButton).toBeVisible({ timeout: 15000 });
    await addNewButton.click();

    await expect(
      this.page.getByRole("heading", {
        name: /Create certification details/i,
      }),
    ).toBeVisible({ timeout: 15000 });

    await expect(this.euNopJasForm()).toBeVisible({ timeout: 15000 });
  }

  private async refreshEuNopJasPlotOptions(): Promise<void> {
    const refreshButton = this.page
      .getByRole("button", { description: /Refresh plots/i })
      .or(this.page.getByRole("button", { name: /Refresh plots/i }))
      .or(this.euNopJasForm().locator("button").filter({ hasText: /^$/ }))
      .first();

    if (await refreshButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await refreshButton.click();

      await this.page
        .waitForLoadState("networkidle", { timeout: 10000 })
        .catch(() => {});

      await this.page.waitForTimeout(500);
    }
  }

  private async selectEuNopJasComboboxOption(
    comboboxName: RegExp,
    optionName: string,
  ): Promise<void> {
    const combobox = this.page
      .getByRole("combobox", { name: comboboxName })
      .first();

    await expect(combobox).toBeVisible({ timeout: 15000 });
    await combobox.click();

    const exactOption = this.page
      .getByRole("option", { name: optionName, exact: true })
      .first();

    if (await exactOption.isVisible({ timeout: 5000 }).catch(() => false)) {
      await exactOption.click();
      return;
    }

    const containsOption = this.page
      .getByRole("option")
      .filter({ hasText: optionName })
      .first();

    await expect(containsOption).toBeVisible({ timeout: 15000 });
    await containsOption.click();
  }

  private async selectEuNopJasPlotCodeWithFallback(
    preferredPlotCode: string,
  ): Promise<string> {
    await this.refreshEuNopJasPlotOptions();

    const form = this.euNopJasForm();

    const plotCodeCombobox = this.page
      .getByRole("combobox", { name: /Select Plot code/i })
      .or(form.getByRole("combobox").first())
      .first();

    await expect(plotCodeCombobox).toBeVisible({ timeout: 15000 });
    await plotCodeCombobox.click();

    let options = this.page.getByRole("option");

    let hasOptions = await options
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (!hasOptions) {
      await this.page.keyboard.press("Escape").catch(() => {});

      await this.refreshEuNopJasPlotOptions();

      await plotCodeCombobox.click();

      options = this.page.getByRole("option");

      hasOptions = await options
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false);
    }

    if (!hasOptions) {
      throw new Error("No plot code options found in EU/NOP/JAS panel.");
    }

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const selectedText =
      optionTexts.find((text) => text === preferredPlotCode) ??
      optionTexts.find((text) => text.includes(preferredPlotCode)) ??
      optionTexts[0];

    await this.page
      .getByRole("option")
      .filter({ hasText: selectedText })
      .first()
      .click();

    return selectedText;
  }

  async addEuNopJasRecord(data: FarmerEuNopJasTestData): Promise<void> {
    await this.openCreateEuNopJasPanel();

    const selectedPlotCode = await this.selectEuNopJasPlotCodeWithFallback(
      data.plotCode,
    );

    const form = this.euNopJasForm();

    const dateInputs = this.page
      .getByRole("textbox", { name: /Select date/i })
      .or(form.locator('input[type="text"]:visible'));

    const organicDateInput = dateInputs.nth(0);
    const conversionDateInput = dateInputs.nth(1);
    const lastFertilizerDateInput = dateInputs.nth(2);

    await expect(organicDateInput).toBeVisible({ timeout: 15000 });
    await organicDateInput.fill(data.startDateOrg);
    await organicDateInput.blur();

    await expect(conversionDateInput).toBeVisible({ timeout: 15000 });
    await conversionDateInput.fill(data.startDateConv);
    await conversionDateInput.blur();

    await this.selectEuNopJasComboboxOption(
      /Select Field status EU\/JAS/i,
      data.fieldStatusEujas,
    );

    await this.selectEuNopJasComboboxOption(
      /Select Field status NOP/i,
      data.fieldStatusNop,
    );

    await this.selectEuNopJasComboboxOption(
      /Select Harvest status EU\/JAS/i,
      data.harvestStatusEujas,
    );

    await this.selectEuNopJasComboboxOption(
      /Select Harvest status NOP/i,
      data.harvestStatusNop,
    );

    const fertilizerInput = form
      .locator('[formcontrolname="fertilizerTypUse"]:visible')
      .or(
        form
          .locator('input[type="text"]:visible')
          .filter({ hasNotText: /Select date/i }),
      )
      .last();

    if (await fertilizerInput.isVisible({ timeout: 3000 }).catch(() => false)) {
      await fertilizerInput.fill(data.fertilizerTypeUsed);
    }

    if (
      await lastFertilizerDateInput
        .isVisible({ timeout: 3000 })
        .catch(() => false)
    ) {
      await lastFertilizerDateInput.fill(data.lastDateUse);
      await lastFertilizerDateInput.blur();
    }

    const addButton = this.page
      .getByRole("button", { name: /^.*Add$/i })
      .last();

    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    await expect(
      this.page.getByRole("heading", {
        name: /Create certification details/i,
      }),
    )
      .toBeHidden({ timeout: 15000 })
      .catch(() => {});

    await expect(
      this.page.getByRole("cell", { name: selectedPlotCode }).first(),
    ).toBeVisible({
      timeout: 15000,
    });

    await expect(
      this.page.getByText(data.fieldStatusEujas).first(),
    ).toBeVisible({
      timeout: 15000,
    });
  }

  private dossierForm(): Locator {
    return this.page
      .locator("form")
      .filter({ hasText: /Plot code|Document name|Upload|File/i })
      .last();
  }

  private async openCreateDossierPanel(): Promise<void> {
    await this.dossierTab.click();

    await expect(this.page.getByText(/Dossier Configurations/i)).toBeVisible({
      timeout: 15000,
    });

    const addNewButton = this.page
      .getByRole("button", { name: /Add new/i })
      .or(this.page.locator("button").filter({ hasText: /Add new/i }))
      .last();

    await expect(addNewButton).toBeVisible({ timeout: 15000 });
    await addNewButton.click();

    await expect(this.dossierForm()).toBeVisible({ timeout: 15000 });
  }

  private async refreshDossierPlotCodeOptions(): Promise<void> {
    const refreshButton = this.page
      .getByRole("button", {
        name: /Refresh Plot code/i,
      })
      .or(
        this.page.getByRole("button", {
          description: /Refresh Plot code/i,
        }),
      )
      .or(this.dossierForm().locator("button").filter({ hasText: /^$/ }))
      .first();

    if (await refreshButton.isVisible({ timeout: 3000 }).catch(() => false)) {
      await refreshButton.click();

      await this.page
        .waitForLoadState("networkidle", { timeout: 10000 })
        .catch(() => {});

      await this.page.waitForTimeout(500);
    }
  }

  private async selectDossierPlotCodeWithFallback(
    preferredPlotCode: string,
  ): Promise<string> {
    const form = this.dossierForm();

    await this.refreshDossierPlotCodeOptions();

    const plotCodeCombobox = form.getByRole("combobox").first();

    await expect(plotCodeCombobox).toBeVisible({ timeout: 15000 });
    await plotCodeCombobox.click();

    let options = this.page.getByRole("option");

    let hasOptions = await options
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (!hasOptions) {
      await this.page.keyboard.press("Escape").catch(() => {});
      await this.refreshDossierPlotCodeOptions();

      await plotCodeCombobox.click();

      options = this.page.getByRole("option");

      hasOptions = await options
        .first()
        .isVisible({ timeout: 5000 })
        .catch(() => false);
    }

    if (!hasOptions) {
      throw new Error("No plot code options found in Dossier panel.");
    }

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    const selectedText =
      optionTexts.find((text) => text === preferredPlotCode) ??
      optionTexts.find((text) => text.includes(preferredPlotCode)) ??
      optionTexts[0];

    await this.page
      .getByRole("option")
      .filter({ hasText: selectedText })
      .first()
      .click();

    return selectedText;
  }

  // async addDossierDocument(data: FarmerDossierTestData): Promise<void> {
  //   await this.page.getByRole("tab", { name: /dossier/i }).click();

  //   const dossierTab = this.page.locator("app-dossier-tab");

  //   const plotCodeSelect = dossierTab.locator('[formcontrolname="plotCode"]');
  //   const documentNameInput = dossierTab.locator('[formcontrolname="name"]');
  //   const fileInput = dossierTab.locator('input[type="file"]');

  //   await expect(dossierTab).toBeVisible({ timeout: 10000 });

  //   // Plot codes may not load immediately after adding land.
  //   await this.refreshPlotCodeOptions(dossierTab);

  //   await this.selectMatOptionInScope(
  //     dossierTab,
  //     plotCodeSelect,
  //     data.plotCode,
  //   );

  //   await documentNameInput.fill(data.documentName);
  //   await expect(documentNameInput).toHaveValue(data.documentName);

  //   await fileInput.setInputFiles(data.filePath);

  //   await dossierTab.locator("button.btn-success").last().click();

  //   await expect(dossierTab.getByText(data.documentName).first()).toBeVisible({
  //     timeout: 10000,
  //   });

  //   await expect(
  //     dossierTab.getByRole("cell", { name: data.plotCode }).first(),
  //   ).toBeVisible({
  //     timeout: 10000,
  //   });
  // }

  async addDossierDocument(data: FarmerDossierTestData): Promise<void> {
    await this.openCreateDossierPanel();

    const selectedPlotCode = await this.selectDossierPlotCodeWithFallback(
      data.plotCode,
    );

    const form = this.dossierForm();

    const documentNameInput = form
      .getByRole("textbox", {
        name: /Document name|Enter document name|Enter name/i,
      })
      .or(form.locator('[formcontrolname="name"]'))
      .or(form.locator('input[type="text"]'))
      .first();

    await expect(documentNameInput).toBeVisible({ timeout: 15000 });
    await documentNameInput.fill(data.documentName);

    await expect(documentNameInput).toHaveValue(data.documentName);

    const fileInput = form
      .locator('input[type="file"]')
      .or(this.page.locator('input[type="file"]'))
      .first();

    await expect(fileInput).toBeAttached({ timeout: 15000 });
    await fileInput.setInputFiles(data.filePath);

    const addButton = this.page
      .getByRole("button", { name: /^.*Add$/i })
      .last();

    await expect(addButton).toBeVisible({ timeout: 10000 });
    await addButton.click();

    await expect(this.dossierForm())
      .toBeHidden({ timeout: 15000 })
      .catch(() => {});

    await expect(this.page.getByText(data.documentName).first()).toBeVisible({
      timeout: 15000,
    });

    await expect(
      this.page.getByRole("cell", { name: selectedPlotCode }).first(),
    ).toBeVisible({
      timeout: 15000,
    });
  }
}
