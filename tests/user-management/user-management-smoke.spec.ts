import { test } from '@fixtures/auth.fixture';

test.describe('@smoke User Management', () => {
  test('USER_MGMT_SMOKE_001 - User Management list opens and shows expected columns', async ({
    authenticatedUser,
    userManagementListPage,
  }) => {
    void authenticatedUser;

    await userManagementListPage.open();
    await userManagementListPage.expectLoaded();
  });

  test('USER_MGMT_SMOKE_002 - Add new opens Add user form', async ({
    authenticatedUser,
    userManagementListPage,
    userManagementFormPage,
  }) => {
    void authenticatedUser;

    await userManagementListPage.open();
    await userManagementListPage.clickAddNew();

    await userManagementFormPage.expectCreateLoaded();
  });
});
