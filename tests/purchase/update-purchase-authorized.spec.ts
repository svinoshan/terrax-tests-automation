import { test } from "@fixtures/auth.fixture";
import {
  createFarmerCropData,
  createFarmerDossierData,
  createFarmerEuNopJasData,
  createFarmerLandData,
  createFarmerOrganizationalData,
  createFarmerProfileData,
} from "@data/farmer/farmer-profile.data";
import { createPurchaseNoteData } from "@data/purchase/purchase.data";

test.describe("@regression Update and Authorize Purchase", () => {
  test("user can update unauthorized purchase note and authorize it", async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
    purchaseListPage,
    createPurchasePage,
  }) => {
    void authenticatedUser;

    const profileData = createFarmerProfileData();
    profileData.supplierType = "Farmer";

    const orgData = createFarmerOrganizationalData();
    const landData = createFarmerLandData();
    const cropData = createFarmerCropData(landData.plotCode);
    const euNopJasData = createFarmerEuNopJasData(landData.plotCode);
    const dossierData = createFarmerDossierData(landData.plotCode);
    const purchaseData = createPurchaseNoteData();

    const updatedNote = `${purchaseData.note} updated and authorized`;
    const updatedPurchaseQty = "15";
    const updatedUnitPrice = "200";

    // Arrange: create active farmer with full supporting records.
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

    // Arrange: create unauthorized purchase using normal Save.
    await purchaseListPage.open();
    await purchaseListPage.clickAddNew();

    await createPurchasePage.expectLoaded();

    await createPurchasePage.fillHeader(
      profileData.fullName,
      landData.plotCode,
      purchaseData,
    );

    await createPurchasePage.addPurchaseLine(purchaseData);
    await createPurchasePage.save();

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
      /No/i,
    );

    // Act: edit unauthorized purchase and authorize during update.
    await purchaseListPage.clickEditForPurchase(orgData.farmerCodeEUJAS);

    await createPurchasePage.expectUpdateLoaded();

    await createPurchasePage.updateNote(updatedNote);

    await createPurchasePage.editFirstPurchaseLine(
      updatedPurchaseQty,
      updatedUnitPrice,
    );

    await createPurchasePage.updateAndAuthorize();

    try {
      await createPurchasePage.expectPurchaseSavedToast();
    } catch {
      // Redirect/toast may be fast.
    }

    // Assert: purchase is now authorized.
    await purchaseListPage.expectLoaded();

    await purchaseListPage.search(orgData.farmerCodeEUJAS);
    await purchaseListPage.expectPurchaseVisible(orgData.farmerCodeEUJAS);

    await purchaseListPage.expectPurchaseAuthorizedStatus(
      orgData.farmerCodeEUJAS,
      /Yes/i,
    );

    // Assert: authorized purchase opens as view/read-only, not editable.
    await purchaseListPage.clickEditForPurchase(orgData.farmerCodeEUJAS);

    await createPurchasePage.expectViewLoaded();
    await createPurchasePage.expectNoUpdateActionsVisible();

    await createPurchasePage.expectUpdatedPurchaseValues(
      updatedNote,
      updatedPurchaseQty,
      updatedUnitPrice,
    );
  });
});
