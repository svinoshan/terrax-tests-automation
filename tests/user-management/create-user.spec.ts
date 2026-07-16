import { test } from "@fixtures/auth.fixture";
import { createUserManagementData } from "@data/user-management/user-management.data";

test.describe("@regression User Management", () => {
  test("USER_MGMT_CREATE_001 - user can create application user", async ({
    authenticatedUser,
    userManagementListPage,
    userManagementFormPage,
  }) => {
    void authenticatedUser;

    test.fail(
      true,
      "BUG/Clarification: User is created, but app shows email already exists popup for a unique generated email.",
    );

    const userData = createUserManagementData();

    await userManagementListPage.open();
    await userManagementListPage.clickAddNew();

    await userManagementFormPage.expectCreateLoaded();

    await userManagementFormPage.fillUser(userData);
    await userManagementFormPage.assignMinimalPermissions();
    await userManagementFormPage.setActive(true);

    await userManagementFormPage.save();

    await userManagementFormPage.expectNoEmailAlreadyExistsPopup();

    await userManagementListPage.expectLoaded();

    await userManagementListPage.search(userData.email);
    await userManagementListPage.expectUserVisible(userData.email);
    await userManagementListPage.expectUserRowContains(
      userData.email,
      userData.fullName,
    );
    await userManagementListPage.expectUserRowContains(
      userData.email,
      /Active/i,
    );
  });
});
