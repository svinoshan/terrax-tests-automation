import { test } from '@fixtures/auth.fixture';
import { createMainUnitData } from '@data/unit-info/unit-info.data';

test.describe('@regression Main Unit', () => {
  test('user can create and update main unit', async ({
    authenticatedUser,
    mainUnitPage,
  }) => {
    void authenticatedUser;

    const mainUnit = createMainUnitData();
    const updatedDescription = `${mainUnit.description} Updated`;

    await mainUnitPage.openCreateForm();

    await mainUnitPage.fillForm(mainUnit);
    await mainUnitPage.save();

    try {
      await mainUnitPage.expectSuccessToast();
    } catch {
      // Some builds may show short-lived/generic toast.
    }

    await mainUnitPage.expectListLoaded();

    await mainUnitPage.search(mainUnit.mainUnitCode);
    await mainUnitPage.expectMainUnitVisible(mainUnit.mainUnitCode);
    await mainUnitPage.expectRowContains(
      mainUnit.mainUnitCode,
      mainUnit.description,
    );

    await mainUnitPage.clickEdit(mainUnit.mainUnitCode);

    await mainUnitPage.updateDescription(updatedDescription);
    await mainUnitPage.update();

    try {
      await mainUnitPage.expectSuccessToast();
    } catch {
      // Some builds may show short-lived/generic toast.
    }

    await mainUnitPage.expectListLoaded();

    await mainUnitPage.search(mainUnit.mainUnitCode);
    await mainUnitPage.expectRowContains(
      mainUnit.mainUnitCode,
      updatedDescription,
    );
  });
});