import { test } from '@fixtures/auth.fixture';
import {
  createCropValidationBaseData,
  createCropValidationScenarios,
} from '@data/crops/create-crop-validation.data';
import { withUniqueCropValues } from '@data/crops/create-crop.data';

test.describe('@validation Create Crop - required fields', () => {
  test.beforeEach(async ({ authenticatedUser, cropsListPage, createCropPage }) => {
    await cropsListPage.open();
    await cropsListPage.clickAddNew();
    await createCropPage.expectLoaded();
  });

  test('empty form cannot be submitted', async ({ createCropPage }) => {
    await createCropPage.save();

    await createCropPage.expectLoaded();
    await createCropPage.expectRequiredControlsInvalid();
  });

  for (const scenario of createCropValidationScenarios) {
    test(`${scenario.testCaseId} - ${scenario.scenario}`, async ({ createCropPage }) => {
      const cropData = withUniqueCropValues(createCropValidationBaseData);

      await createCropPage.fillCreateCropFormExcept(cropData, [scenario.missingField]);
      await createCropPage.save();

      await createCropPage.expectLoaded();
      await createCropPage.expectFieldInvalid(scenario.missingField);
    });
  }
});
