import { test } from '@fixtures/auth.fixture';
import { createUserManagementData } from '@data/user-management/user-management.data';

test.describe('@regression User Management', () => {
  test('USER_MGMT_UPDATE_001 - user can update created application user permissions', async ({
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

    await userManagementListPage.openEditForUser(userData.email);

    await userManagementFormPage.expectUpdateLoaded();

    await userManagementFormPage.uncheckPermission('User Management');

    await userManagementFormPage.checkPermission('Dashboard');

    await userManagementFormPage.update();

    await userManagementListPage.expectLoaded();

    await userManagementListPage.search(userData.email);
    await userManagementListPage.expectUserVisible(userData.email);
    await userManagementListPage.expectUserRowContains(userData.email, userData.fullName);
  });
});