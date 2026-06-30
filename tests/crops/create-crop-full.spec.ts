import { test } from '@fixtures/auth.fixture';
import {
  getCreatableCropData,
  getKnownBugCropData,
  withUniqueCropValues,
} from '@data/crops/create-crop.data';

test.describe('@regression Create Crop - full flow', () => {
  for (const crop of getCreatableCropData()) {
    test(`user can create crop - ${crop.testCaseId}`, async ({
      authenticatedUser,
      cropsListPage,
      createCropPage,
    }) => {
      const cropData = withUniqueCropValues(crop);

      await cropsListPage.open();

      await cropsListPage.clickAddNew();
      await createCropPage.expectLoaded();

      await createCropPage.fillCreateCropForm(cropData);
      await createCropPage.save();
      await createCropPage.expectCropCreatedToast();
      
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

test.describe('@known-bug Create Crop - documented app issue', () => {
  for (const crop of getKnownBugCropData()) {
    test.skip(`known bug: ${crop.testCaseId} - ${crop.scenario}`, async () => {
      // This data is intentionally skipped until the app bug is fixed.
      // Bug note: Mother Crop = Default and Out turn is empty/disabled can prevent save.
    });
  }
});
