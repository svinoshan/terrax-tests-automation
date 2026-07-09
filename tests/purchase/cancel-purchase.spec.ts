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

async function createActiveFarmerWithPurchaseSetup({
  farmerListPage,
  farmerProfilePage,
}: {
  farmerListPage: any;
  farmerProfilePage: any;
}) {
  const profileData = createFarmerProfileData();
  profileData.supplierType = "Farmer";

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
    // Redirect/toast may be fast.
  }

  await farmerListPage.expectLoaded();

  return {
    profileData,
    orgData,
    landData,
  };
}

test.describe("@regression Cancel Purchase", () => {
  test("user can cancel unauthorized purchase note", async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
    purchaseListPage,
    createPurchasePage,
  }) => {
    void authenticatedUser;

    const farmerSetup = await createActiveFarmerWithPurchaseSetup({
      farmerListPage,
      farmerProfilePage,
    });

    const purchaseData = createPurchaseNoteData();

    await purchaseListPage.open();
    await purchaseListPage.clickAddNew();

    await createPurchasePage.expectLoaded();

    await createPurchasePage.fillHeader(
      farmerSetup.profileData.fullName,
      farmerSetup.landData.plotCode,
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

    await purchaseListPage.search(farmerSetup.orgData.farmerCodeEUJAS);
    await purchaseListPage.expectPurchaseVisible(
      farmerSetup.orgData.farmerCodeEUJAS,
    );

    await purchaseListPage.expectPurchaseAuthorizedStatus(
      farmerSetup.orgData.farmerCodeEUJAS,
      /No/i,
    );

    await purchaseListPage.clickEditForPurchase(
      farmerSetup.orgData.farmerCodeEUJAS,
    );

    await createPurchasePage.expectUpdateLoaded();
    await createPurchasePage.cancelPurchase();

    await purchaseListPage.expectLoaded();

    await purchaseListPage.search(farmerSetup.orgData.farmerCodeEUJAS);
    await purchaseListPage.expectPurchaseVisible(
      farmerSetup.orgData.farmerCodeEUJAS,
    );

    await purchaseListPage.expectPurchaseCancelled(
      farmerSetup.orgData.farmerCodeEUJAS,
    );
  });

  test("user can cancel authorized purchase note from view mode", async ({
    authenticatedUser,
    farmerListPage,
    farmerProfilePage,
    purchaseListPage,
    createPurchasePage,
  }) => {
    void authenticatedUser;

    const farmerSetup = await createActiveFarmerWithPurchaseSetup({
      farmerListPage,
      farmerProfilePage,
    });

    const purchaseData = createPurchaseNoteData();

    await purchaseListPage.open();
    await purchaseListPage.clickAddNew();

    await createPurchasePage.expectLoaded();

    await createPurchasePage.fillHeader(
      farmerSetup.profileData.fullName,
      farmerSetup.landData.plotCode,
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

    await purchaseListPage.search(farmerSetup.orgData.farmerCodeEUJAS);
    await purchaseListPage.expectPurchaseVisible(
      farmerSetup.orgData.farmerCodeEUJAS,
    );

    await purchaseListPage.expectPurchaseAuthorizedStatus(
      farmerSetup.orgData.farmerCodeEUJAS,
      /Yes/i,
    );

    // Authorized row opens in view mode but still exposes Cancel.
    await purchaseListPage.clickEditForPurchase(
      farmerSetup.orgData.farmerCodeEUJAS,
    );

    await createPurchasePage.expectViewLoaded();
    await createPurchasePage.cancelPurchase();

    await purchaseListPage.expectLoaded();

    await purchaseListPage.search(farmerSetup.orgData.farmerCodeEUJAS);
    await purchaseListPage.expectPurchaseVisible(
      farmerSetup.orgData.farmerCodeEUJAS,
    );

    await purchaseListPage.expectPurchaseCancelled(
      farmerSetup.orgData.farmerCodeEUJAS,
    );
  });
});
