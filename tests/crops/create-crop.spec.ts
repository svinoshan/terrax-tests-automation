import { test } from '@fixtures/auth.fixture';
import { getCropData } from '@data/crops/create-crop.data';

test.describe('@smoke Create Crop - safe tests', () => {
  test.beforeEach(async ({ authenticatedUser, cropsListPage, createCropPage }) => {
    await cropsListPage.open();
    await cropsListPage.expectLoaded();

    await cropsListPage.clickAddNew();
    await createCropPage.expectLoaded();
  });

  test('create crop page opens and shows required fields', async ({ createCropPage }) => {
    await createCropPage.expectFormFieldsVisible();
    await createCropPage.expectButtonsVisible();
  });

  test('save empty create crop form keeps required controls invalid', async ({ createCropPage }) => {
    await createCropPage.save();

    await createCropPage.expectLoaded();
    await createCropPage.expectRequiredControlsInvalid();
  });

  // test('reset clears entered text fields', async ({ createCropPage }) => {
  //   const [firstCrop] = getCropData(1);

  //   await createCropPage.fillTextFieldsOnly(firstCrop);
  //   await createCropPage.reset();

  //   await createCropPage.expectTextFieldsCleared();
  // });

  test('cancel button returns to crops list', async ({ createCropPage, cropsListPage }) => {
    await createCropPage.back();

    await cropsListPage.expectLoaded();
  });
});
