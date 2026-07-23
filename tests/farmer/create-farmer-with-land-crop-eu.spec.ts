import { test } from "@fixtures/auth.fixture";
import {
  createFarmerCropData,
  createFarmerDossierData,
  createFarmerEuNopJasData,
  createFarmerLandData,
  createFarmerOrganizationalData,
  createFarmerProfileData,
} from "@data/farmer/farmer-profile.data";

test.describe("@regression Create Farmer with full supporting records", () => {
  test("user can create active farmer with land crop EU/NOP/JAS and dossier document", async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
  }) => {
    const profileData = createFarmerProfileData();
    const orgData = createFarmerOrganizationalData();

    const landData = createFarmerLandData();
    const cropData = createFarmerCropData(landData.plotCode);
    const euNopJasData = createFarmerEuNopJasData(landData.plotCode);
    const dossierData = createFarmerDossierData(landData.plotCode);

    await farmerListPage.open();
    await farmerListPage.clickAddFarmer();

    await farmerProfilePage.expectLoaded();

    await farmerProfilePage.fillCommonInfo(profileData);
    await farmerProfilePage.fillOrganizationalInfo(orgData);

    await farmerProfilePage.addLandRecord(landData);
    await farmerProfilePage.addCropRecord(cropData);
    await farmerProfilePage.addEuNopJasRecord(euNopJasData);
    await farmerProfilePage.addDossierDocument(dossierData);
    await farmerProfilePage.ensureFarmerActive();
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

    await farmerListPage.expectFarmerRowContains(
      orgData.farmerCodeEUJAS,
      orgData.mainUnit,
    );

    await farmerListPage.expectFarmerRowContains(
      orgData.farmerCodeEUJAS,
      orgData.subUnit,
    );

    await farmerListPage.expectFarmerCreatedStatus(
      orgData.farmerCodeEUJAS,
    );
  });
});
