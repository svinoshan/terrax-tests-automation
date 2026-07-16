import { test } from '@fixtures/auth.fixture';
import { createUserManagementData } from '@data/user-management/user-management.data';

test.describe('@regression User Management', () => {
  test('USER_MGMT_DELETE_001 - user can delete created application user', async ({
    authenticatedUser,
    userManagementListPage,
    userManagementFormPage,
  }) => {
    void authenticatedUser;

    const userData = createUserManagementData();

    await userManagementListPage.open();
    await userManagementListPage.clickAddNew();

    await userManagementFormPage.expectCreateLoaded();

    await userManagementFormPage.fillUser(userData);
    await userManagementFormPage.assignMinimalPermissions();
    await userManagementFormPage.setActive(true);

    await userManagementFormPage.saveAndDismissKnownEmailBug();

    await userManagementListPage.expectLoaded();

    await userManagementListPage.search(userData.email);
    await userManagementListPage.expectUserVisible(userData.email);

    await userManagementListPage.deleteUser(userData.email);

    await userManagementListPage.expectLoaded();

    await userManagementListPage.search(userData.email);
    await userManagementListPage.expectUserHidden(userData.email);
  });
});