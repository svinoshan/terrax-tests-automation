import { test } from '@fixtures/auth.fixture';
import { createFarmerProfileData } from '@data/farmer/farmer-profile.data';

test.describe('@smoke Farmer Profile - safe tests', () => {
  test('farmer list opens and shows expected columns/actions', async ({
    authenticatedUser,
    farmerListPage,
  }) => {
    await farmerListPage.open();
    await farmerListPage.expectLoaded();
  });

  test('add farmer opens farmer profile page with common fields and tabs', async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
  }) => {
    await farmerListPage.open();
    await farmerListPage.clickAddFarmer();

    await farmerProfilePage.expectLoaded();
    await farmerProfilePage.expectCommonInfoFieldsVisible();
    await farmerProfilePage.expectTabsVisible();
    await farmerProfilePage.expectOrganizationalFieldsVisible();
  });

  test('farmer profile common information accepts input', async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
  }) => {
    const data = createFarmerProfileData();

    await farmerListPage.open();
    await farmerListPage.clickAddFarmer();

    await farmerProfilePage.expectLoaded();
    await farmerProfilePage.fillCommonInfo(data);
  });

  test('back button returns from farmer profile to farmer list', async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
  }) => {
    await farmerListPage.open();
    await farmerListPage.clickAddFarmer();

    await farmerProfilePage.expectLoaded();
    await farmerProfilePage.back();

    await farmerListPage.expectLoaded();
  });
});
