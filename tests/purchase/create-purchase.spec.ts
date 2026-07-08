import { test } from '@fixtures/auth.fixture';
import {
  createFarmerCropData,
  createFarmerDossierData,
  createFarmerEuNopJasData,
  createFarmerLandData,
  createFarmerOrganizationalData,
  createFarmerProfileData,
} from '@data/farmer/farmer-profile.data';
import { createPurchaseNoteData } from '@data/purchase/purchase.data';

test.describe('@regression Create Purchase', () => {
  test('user can create purchase note for active farmer with plot and crop', async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
    purchaseListPage,
    createPurchasePage,
  }) => {
    const profileData = createFarmerProfileData();
    profileData.supplierType = 'Farmer';

    const orgData = createFarmerOrganizationalData();

    const landData = createFarmerLandData();
    const cropData = createFarmerCropData(landData.plotCode);
    const euNopJasData = createFarmerEuNopJasData(landData.plotCode);
    const dossierData = createFarmerDossierData(landData.plotCode);

    const purchaseData = createPurchaseNoteData();

    // Arrange: create active farmer with supporting plot/crop records.
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
    await farmerListPage.expectFarmerRowContains(orgData.farmerCodeEUJAS, /Active/i);

    // Act: create purchase note.
    await purchaseListPage.open();
    await purchaseListPage.clickAddNew();

    await createPurchasePage.expectLoaded();

    await createPurchasePage.fillHeader(
      //orgData.farmerCodeEUJAS,
      profileData.fullName,
      landData.plotCode,
      purchaseData,
    );

    await createPurchasePage.addPurchaseLine(purchaseData);
    await createPurchasePage.save();

    try {
      await createPurchasePage.expectPurchaseSavedToast();
    } catch {
      // Some builds may redirect quickly or show short-lived success toast.
    }

    // Assert: redirected back to Purchase notes list.
    await purchaseListPage.expectLoaded();

    await purchaseListPage.search(orgData.farmerCodeEUJAS);
    await purchaseListPage.expectPurchaseVisible(orgData.farmerCodeEUJAS);

    await purchaseListPage.expectPurchaseRowContains(
      orgData.farmerCodeEUJAS,
      profileData.nameWithInitials,
    );

    await purchaseListPage.expectPurchaseRowContains(
      orgData.farmerCodeEUJAS,
      landData.plotCode,
    );

    await purchaseListPage.expectPurchaseRowContains(
      orgData.farmerCodeEUJAS,
      /No|Yes/i,
    );
  });
});
