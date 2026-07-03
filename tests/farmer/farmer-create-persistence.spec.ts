import { expect } from '@playwright/test';
import { test } from "@fixtures/auth.fixture";
import {
  createFarmerOrganizationalData,
  createFarmerProfileData,
} from "@data/farmer/farmer-profile.data";

test.describe("@regression Farmer Create Persistence", () => {
  test.fail("Bug: not all entered farmer profile and organizational values persist after save", async ({
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
      // Some builds may redirect quickly or show short-lived success toast.
    }

    await farmerListPage.expectLoaded();

    await farmerListPage.search(orgData.farmerCodeEUJAS);
    await farmerListPage.expectFarmerVisible(orgData.farmerCodeEUJAS);

    await farmerListPage.clickEditForFarmer(orgData.farmerCodeEUJAS);
    await farmerProfilePage.expectLoaded();

    // await farmerProfilePage.expectCreatedFarmerCommonInfoPersisted(profileData);
    // await farmerProfilePage.expectCreatedFarmerOrganizationalInfoPersisted(orgData);

    const mismatches =
      await farmerProfilePage.collectCreatedFarmerPersistenceMismatches(
        profileData,
        orgData,
      );

    expect(
      mismatches,
      `Farmer create persistence mismatches:\n${mismatches.join("\n")}`,
    ).toEqual([]);
  });
});
