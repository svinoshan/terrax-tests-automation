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

test.describe('@regression Create Authorized Purchase', () => {
  test('user can create purchase note using Save and Authorized', async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
    purchaseListPage,
    createPurchasePage,
  }) => {
    void authenticatedUser;

    const profileData = createFarmerProfileData();
    profileData.supplierType = 'Farmer';

    const orgData = createFarmerOrganizationalData();
    const landData = createFarmerLandData();
    const cropData = createFarmerCropData(landData.plotCode);
    const euNopJasData = createFarmerEuNopJasData(landData.plotCode);
    const dossierData = createFarmerDossierData(landData.plotCode);
    const purchaseData = createPurchaseNoteData();

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
      // Redirect/toast may be fast.
    }

    await farmerListPage.expectLoaded();

    await purchaseListPage.open();
    await purchaseListPage.clickAddNew();

    await createPurchasePage.expectLoaded();

    await createPurchasePage.fillHeader(
      profileData.fullName,
      landData.plotCode,
      purchaseData,
    );

    await createPurchasePage.addPurchaseLine(purchaseData);

    await createPurchasePage.saveAndAuthorizedButton.click();

    try {
      await createPurchasePage.expectPurchaseSavedToast();
    } catch {
      // Redirect/toast may be fast.
    }

    await purchaseListPage.expectLoaded();

    await purchaseListPage.search(orgData.farmerCodeEUJAS);
    await purchaseListPage.expectPurchaseVisible(orgData.farmerCodeEUJAS);

    await purchaseListPage.expectPurchaseAuthorizedStatus(
      orgData.farmerCodeEUJAS,
      /Yes/i,
    );
  });
});