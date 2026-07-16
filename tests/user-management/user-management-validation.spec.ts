import { test } from '@fixtures/auth.fixture';

test.describe('@validation User Management', () => {
  test('USER_MGMT_VAL_001 - Required field validation is shown', async ({
    authenticatedUser,
    userManagementListPage,
    userManagementFormPage,
  }) => {
    void authenticatedUser;

    await userManagementListPage.open();
    await userManagementListPage.clickAddNew();

    await userManagementFormPage.expectCreateLoaded();

    await userManagementFormPage.clickSaveExpectValidation();

    await userManagementFormPage.expectRequiredValidationMessages();
  });

  test('USER_MGMT_VAL_002 - Invalid email and password validation is shown', async ({
    authenticatedUser,
    userManagementListPage,
    userManagementFormPage,
  }) => {
    void authenticatedUser;

    await userManagementListPage.open();
    await userManagementListPage.clickAddNew();

    await userManagementFormPage.expectCreateLoaded();

    await userManagementFormPage.fillInvalidEmailAndPassword();

    await userManagementFormPage.clickSaveExpectValidation();

    await userManagementFormPage.expectInvalidEmailAndPasswordMessages();
  });
});
