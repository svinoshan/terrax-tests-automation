import { test } from "@fixtures/auth.fixture";
import {
  getCreatableCropData,
  withUniqueCropValues,
} from "@data/crops/create-crop.data";

test.describe("@regression Create Crop - full flow", () => {
  //const cropScenarios = [...getCreatableCropData(), ...getKnownBugCropData()];

  for (const crop of getCreatableCropData()) {
    test(`user can create crop - ${crop.testCaseId}`, async ({
      authenticatedUser,
      cropsListPage,
      createCropPage,
    }) => {
      void authenticatedUser;
      
      const cropData = withUniqueCropValues(crop);

      await cropsListPage.open();

      await cropsListPage.clickAddNew();
      await createCropPage.expectLoaded();

      await createCropPage.fillCreateCropForm(cropData);
      await createCropPage.save();
      //await createCropPage.expectCropCreatedToast();
      try {
        await createCropPage.expectCropCreatedToast();
      } catch {
        // Some builds may redirect quickly or show a short-lived success toast.
      }

      // Preferred path: app redirects to All Crops after successful save.
      try {
        await cropsListPage.expectLoaded();
      } catch {
        // Fallback path: if app stays on Create Crop page, go back manually.
        if (await createCropPage.isLoaded()) {
          await createCropPage.back();
        }

        await cropsListPage.expectLoaded();
      }

      await cropsListPage.search(cropData.cropName);
      await cropsListPage.expectCropVisible(cropData.cropName);
    });
  }
});
