import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { UserManagementTestData } from "@data/user-management/user-management.data";

export class UserManagementFormPage extends BasePage {
  readonly pageTitle: Locator;

  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly telephoneInput: Locator;
  readonly addressInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;

  readonly saveButton: Locator;
  readonly updateButton: Locator;
  readonly backButton: Locator;

  readonly activeSwitch: Locator;
  readonly approvalPermissionsSwitch: Locator;
  readonly paidServicePermissionsSwitch: Locator;

  constructor(page: Page) {
    super(page);

    this.pageTitle = page.getByRole("heading", {
      name: /Add user|Update user|Edit user/i,
    });

    this.fullNameInput = page.getByRole("textbox", {
      name: /Enter full name/i,
    });

    this.emailInput = page.getByRole("textbox", {
      name: /Enter email/i,
    });

    this.telephoneInput = page.getByPlaceholder(/Enter telephone/i);

    this.addressInput = page.getByRole("textbox", {
      name: /Enter address/i,
    });

    this.passwordInput = page.getByRole("textbox", {
      name: /^Enter password$/i,
    });

    this.confirmPasswordInput = page.getByRole("textbox", {
      name: /Confirm password/i,
    });

    this.saveButton = page.getByRole("button", { name: /Save/i }).first();
    this.updateButton = page.getByRole("button", { name: /Update/i }).first();
    this.backButton = page.getByRole("button", { name: /Back/i }).first();

    this.activeSwitch = page.locator("#flexSwitchCheckDefault2");
    this.approvalPermissionsSwitch = page.locator("#flexSwitchCheckDefault3");
    this.paidServicePermissionsSwitch = page.locator(
      "#flexSwitchCheckDefault4",
    );
  }

  async expectCreateLoaded(): Promise<void> {
    await expect(
      this.page.getByRole("heading", { name: /Add user/i }),
    ).toBeVisible({ timeout: 30000 });

    await expect(this.fullNameInput).toBeVisible({ timeout: 10000 });
    await expect(this.emailInput).toBeVisible({ timeout: 10000 });
    await expect(this.telephoneInput).toBeVisible({ timeout: 10000 });
    await expect(this.addressInput).toBeVisible({ timeout: 10000 });
    await expect(this.passwordInput).toBeVisible({ timeout: 10000 });
    await expect(this.confirmPasswordInput).toBeVisible({ timeout: 10000 });
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByRole("checkbox", { name: /Permission/i }),
    ).toBeVisible({ timeout: 10000 });
  }

  async expectUpdateLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.fullNameInput).toBeVisible({ timeout: 10000 });
    await expect(this.emailInput).toBeVisible({ timeout: 10000 });
    await expect(this.updateButton).toBeVisible({ timeout: 10000 });
  }

  async fillUser(data: UserManagementTestData): Promise<void> {
    await this.fullNameInput.fill(data.fullName);
    await this.emailInput.fill(data.email);
    await this.telephoneInput.fill(data.telephone);
    await this.addressInput.fill(data.address);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.password);

    await expect(this.fullNameInput).toHaveValue(data.fullName);
    await expect(this.emailInput).toHaveValue(data.email);
  }

  async checkPermission(permissionName: string | RegExp): Promise<void> {
    const checkbox = this.page.getByRole("checkbox", {
      name: permissionName,
      exact: typeof permissionName === "string",
    });

    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  }

  async uncheckPermission(permissionName: string | RegExp): Promise<void> {
    const checkbox = this.page.getByRole("checkbox", {
      name: permissionName,
      exact: typeof permissionName === "string",
    });

    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.uncheck();
    await expect(checkbox).not.toBeChecked();
  }

  async assignMinimalPermissions(): Promise<void> {
    await this.checkPermission("Dashboard");
    await this.checkPermission("User Management");
  }

  async setActive(value: boolean): Promise<void> {
    if ((await this.activeSwitch.count()) === 0) {
      return;
    }

    if (value) {
      await this.activeSwitch.check();
    } else {
      await this.activeSwitch.uncheck();
    }
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

  async clickSaveExpectValidation(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();

    await this.page.waitForTimeout(500);
  }

  // async expectRequiredValidationMessages(): Promise<void> {
  //   await expect(this.page.getByText(/Full name.*required/i)).toBeVisible({
  //     timeout: 10000,
  //   });

  //   await expect(this.page.getByText(/Email.*required/i)).toBeVisible({
  //     timeout: 10000,
  //   });

  //   await expect(this.page.getByText(/Telephone.*required/i)).toBeVisible({
  //     timeout: 10000,
  //   });

  //   await expect(this.page.getByText(/Password.*required/i)).toBeVisible({
  //     timeout: 10000,
  //   });

  //   await expect(this.page.getByText(/Confirm password.*required/i)).toBeVisible({
  //     timeout: 10000,
  //   });
  // }
  async expectRequiredValidationMessages(): Promise<void> {
    await expect(this.page.getByText(/Full name Required suffix/i)).toBeVisible(
      {
        timeout: 10000,
      },
    );

    await expect(this.page.getByText(/Email Required suffix/i)).toBeVisible({
      timeout: 10000,
    });

    await expect(this.page.getByText(/Telephone Is required/i)).toBeVisible({
      timeout: 10000,
    });

    await expect(this.page.getByText(/^Password Is required$/i)).toBeVisible({
      timeout: 10000,
    });

    await expect(
      this.page.getByText(/^Confirm password required$/i),
    ).toBeVisible({
      timeout: 10000,
    });
  }

  async fillInvalidEmailAndPassword(): Promise<void> {
    await this.fullNameInput.fill("Invalid User E2E");
    await this.emailInput.fill("email@com");
    await this.telephoneInput.fill("0771234567");
    await this.addressInput.fill("E2E Address");
    await this.passwordInput.fill("short");
    await this.confirmPasswordInput.fill("different");
  }

  async expectInvalidEmailAndPasswordMessages(): Promise<void> {
    await expect(this.page.getByText(/Invalid email/i)).toBeVisible({
      timeout: 10000,
    });

    await expect(this.page.getByText(/Email tag restriction/i)).toBeVisible({
      timeout: 10000,
    });

    await expect(this.page.getByText(/Password min length/i)).toBeVisible({
      timeout: 10000,
    });

    await expect(this.page.getByText(/Password complexity error/i)).toBeVisible(
      {
        timeout: 10000,
      },
    );

    await expect(this.page.getByText(/Passwords do not match/i)).toBeVisible({
      timeout: 10000,
    });
  }

  async isEmailAlreadyExistsPopupVisible(timeout = 3000): Promise<boolean> {
    return await this.page
      .getByText(/Email already exist|email already exists|email.*already/i)
      .first()
      .isVisible({ timeout })
      .catch(() => false);
  }

  async dismissEmailAlreadyExistsPopupIfVisible(): Promise<void> {
    if (!(await this.isEmailAlreadyExistsPopupVisible())) {
      return;
    }

    const okButton = this.page.getByRole("button", { name: /^Ok$/i }).first();

    await expect(okButton).toBeVisible({ timeout: 5000 });
    await okButton.click();

    await expect(okButton)
      .toBeHidden({ timeout: 5000 })
      .catch(() => {});
  }

  async expectNoEmailAlreadyExistsPopup(): Promise<void> {
    await expect(
      this.page
        .getByText(/Email already exist|email already exists|email.*already/i)
        .first(),
    ).toBeHidden({ timeout: 3000 });
  }

  async saveAndDismissKnownEmailBug(): Promise<void> {
    await this.save();

    await this.dismissEmailAlreadyExistsPopupIfVisible();

    await this.page.waitForTimeout(500);
  }
}
