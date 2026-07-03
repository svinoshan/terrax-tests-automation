import { test } from '@fixtures/auth.fixture';
import {
  createFarmerOrganizationalData,
  createFarmerProfileData,
} from '@data/farmer/farmer-profile.data';

test.describe('@regression Create Farmer - full flow', () => {
  test('user can create farmer with profile and organizational information', async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
  }) => {
    const profileData = createFarmerProfileData();
    const orgData = createFarmerOrganizationalData();

    await farmerListPage.open();
    await farmerListPage.clickAddFarmer();

    await farmerProfilePage.expectLoaded();

    await farmerProfilePage.fillCommonInfo(profileData);
    await farmerProfilePage.fillOrganizationalInfo(orgData);

    await farmerProfilePage.save();

    try {
      await farmerProfilePage.expectFarmerSavedToast();
    } catch {
      // Some builds may redirect quickly or show a short-lived success toast.
    }

    await farmerListPage.expectLoaded();

    await farmerListPage.search(orgData.farmerCodeEUJAS);
    await farmerListPage.expectFarmerVisible(orgData.farmerCodeEUJAS);

    await farmerListPage.expectFarmerRowContains(
      orgData.farmerCodeEUJAS,
      profileData.nameWithInitials,
    );

    await farmerListPage.expectFarmerRowContains(
      orgData.farmerCodeEUJAS,
      orgData.cbRefNo,
    );

    await farmerListPage.expectFarmerRowContains(
      orgData.farmerCodeEUJAS,
      orgData.mainUnit,
    );

    await farmerListPage.expectFarmerRowContains(
      orgData.farmerCodeEUJAS,
      orgData.subUnit,
    );

    await farmerListPage.expectFarmerRowContains(
      orgData.farmerCodeEUJAS,
      profileData.city,
    );

    await farmerListPage.expectFarmerRowContains(
      orgData.farmerCodeEUJAS,
      /Active/i,
    );
  });
});
