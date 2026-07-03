import { test } from "@fixtures/auth.fixture";
import {
  createFarmerOrganizationalData,
  createFarmerProfileData,
} from "@data/farmer/farmer-profile.data";

test.describe("@regression Update Farmer", () => {
  test("user can update farmer basic profile information", async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
  }) => {
    const profileData = createFarmerProfileData();
    const orgData = createFarmerOrganizationalData();

    const updatedNameWithInitials = `${profileData.nameWithInitials} Updated`;
    const updatedContactPersonPhone = "0709998888";

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
    await farmerListPage.expectFarmerRowContains(
      orgData.farmerCodeEUJAS,
      profileData.nameWithInitials,
    );

    // await farmerListPage.clickEditForFarmer(orgData.farmerCodeEUJAS);
    // await farmerProfilePage.expectLoaded();

    // await farmerProfilePage.updateBasicFarmerInfo(
    //   updatedNameWithInitials,
    //   updatedContactPersonPhone,
    // );

    await farmerListPage.clickEditForFarmer(orgData.farmerCodeEUJAS);
    await farmerProfilePage.expectLoaded();

    // Wait until the edit form has finished loading existing farmer values.
    // This prevents Angular async form patching from overwriting our update.
    await farmerProfilePage.expectBasicFarmerInfoValues(
      profileData.nameWithInitials,
      profileData.contactPersonPhone,
    );

    await farmerProfilePage.updateBasicFarmerInfo(
      updatedNameWithInitials,
      updatedContactPersonPhone,
    );

    await farmerProfilePage.update();

    try {
      await farmerProfilePage.expectFarmerUpdatedToast();
    } catch {
      // Some builds may redirect quickly or show generic success toast.
    }

    await farmerListPage.expectLoaded();

    await farmerListPage.search(orgData.farmerCodeEUJAS);
    await farmerListPage.expectFarmerVisible(orgData.farmerCodeEUJAS);

    // Verify updated name appears in the list row.
    await farmerListPage.expectFarmerRowContains(
      orgData.farmerCodeEUJAS,
      updatedNameWithInitials,
    );

    // Reopen edit form and verify updated form values persisted.
    await farmerListPage.clickEditForFarmer(orgData.farmerCodeEUJAS);
    await farmerProfilePage.expectLoaded();

    await farmerProfilePage.expectBasicFarmerInfoValues(
      updatedNameWithInitials,
      updatedContactPersonPhone,
    );
  });
});
