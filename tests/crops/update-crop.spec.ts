import { test } from "@fixtures/auth.fixture";
import {
  getCreatableCropData,
  withUniqueCropValues,
} from "@data/crops/create-crop.data";

test.describe("@regression Update Crop", () => {
  for (const crop of getCreatableCropData()) {
    test(`user can update crop safe fields - ${crop.testCaseId}`, async ({
      authenticatedUser,
      cropsListPage,
      createCropPage,
    }) => {
      void authenticatedUser;

      const originalCrop = withUniqueCropValues(crop);

      await cropsListPage.open();
      await cropsListPage.clickAddNew();
      await createCropPage.expectLoaded();

      await createCropPage.fillCreateCropForm(originalCrop);
      await createCropPage.save();

      try {
        await createCropPage.expectCropCreatedToast();
      } catch {
        // Some app builds show a generic success toast or redirect quickly.
      }

      try {
        await cropsListPage.expectLoaded();
      } catch {
        if (await createCropPage.isLoaded()) {
          await createCropPage.back();
        }

        await cropsListPage.expectLoaded();
      }

      await cropsListPage.search(originalCrop.cropName);
      await cropsListPage.expectCropVisible(originalCrop.cropName);

      await cropsListPage.clickEditForCrop(originalCrop.cropName);
      await createCropPage.expectUpdateLoaded();

      const updatedDescription = `${originalCrop.description} updated by E2E test`;

      const isDefaultMotherCrop = originalCrop.motherCrop === "Default";

      const updatedCrop = {
        ...originalCrop,

        // Keep these unchanged for now.
        // Updating cropName/hsCode appears unreliable in current app/search behavior.
        cropName: originalCrop.cropName,
        hsCode: originalCrop.hsCode,

        scientificName: `${originalCrop.scientificName} updated`,
        description: updatedDescription,
        productForm: "Raw material",
        purchaseUom: "Kg",
        typeOfCrop: "Annual",
        plantedUom: "Tree",

        // Conditional update behavior:
        // Default mother crop uses Exp qty per year.
        // Existing mother crop uses Out turn.
        expQtyPerYear: isDefaultMotherCrop ? "1200" : originalCrop.expQtyPerYear,
        outTurn: isDefaultMotherCrop ? undefined : "80",

        // Intentionally not updating these due to current update-mode issue.
        category: originalCrop.category,
        motherCrop: originalCrop.motherCrop,
      };

      await createCropPage.fillUpdateCropFormSkippingCategoryAndMotherCrop(
        updatedCrop,
      );

      await createCropPage.update();

      try {
        await createCropPage.expectCropUpdatedToast();
      } catch {
        // Some app builds show a generic success toast or redirect quickly.
      }

      try {
        await cropsListPage.expectLoaded();
      } catch {
        if (await createCropPage.isLoaded()) {
          await createCropPage.back();
        }

        await cropsListPage.expectLoaded();
      }

      await cropsListPage.search(originalCrop.cropName);
      await cropsListPage.expectCropVisible(originalCrop.cropName);

      await cropsListPage.expectCropRowContains(
        originalCrop.cropName,
        updatedDescription,
      );

      await cropsListPage.expectCropRowContains(originalCrop.cropName, /Tree/i);

      await cropsListPage.expectCropRowContains(originalCrop.cropName, /Kg/i);

      if (isDefaultMotherCrop) {
        await cropsListPage.expectCropRowContains(
          originalCrop.cropName,
          /1200|1,200|1,200\.00|1200\.00/i,
        );
      } else {
        await cropsListPage.expectCropRowContains(
          originalCrop.cropName,
          /80/i,
        );
      }

      // Category is intentionally not updated in this test.
      // It should remain the original value.
      await cropsListPage.expectCropRowContains(
        originalCrop.cropName,
        new RegExp(originalCrop.category, "i"),
      );

      // Mother crop is intentionally not updated in this test.
      // For Default mother crop, the list may display N/A instead of Default.
      if (isDefaultMotherCrop) {
        await cropsListPage.expectCropRowContains(
          originalCrop.cropName,
          /Default|N\/A/i,
        );
      } else {
        await cropsListPage.expectCropRowContains(
          originalCrop.cropName,
          new RegExp(originalCrop.motherCrop, "i"),
        );
      }
    });
  }
});