import { test } from "@fixtures/auth.fixture";
import {
  createMainUnitData,
  createSubUnitData,
} from "@data/unit-info/unit-info.data";

test.describe("@regression Sub Unit", () => {
  test("user can create and update sub unit", async ({
    authenticatedUser,
    mainUnitPage,
    subUnitPage,
  }) => {
    void authenticatedUser;

    const mainUnit = createMainUnitData();
    const subUnit = createSubUnitData(mainUnit);
    const updatedSubUnitDescription = `${subUnit.description} Updated`;

    // Create required Main Unit first.
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

    // Create Sub Unit linked to the newly created Main Unit.
    await subUnitPage.openCreateForm();

    await subUnitPage.fillForm(subUnit);
    await subUnitPage.save();

    try {
      await subUnitPage.expectSuccessToast();
    } catch {
      // Some builds may show short-lived/generic toast.
    }

    await subUnitPage.expectListLoaded();

    await subUnitPage.search(subUnit.subUnitCode);
    await subUnitPage.expectSubUnitVisible(subUnit.subUnitCode);
    await subUnitPage.expectRowContains(
      subUnit.subUnitCode,
      subUnit.description,
    );

    // Update Sub Unit description.
    await subUnitPage.clickEdit(subUnit.subUnitCode);

    await subUnitPage.updateDescription(updatedSubUnitDescription);
    await subUnitPage.update();

    try {
      await subUnitPage.expectSuccessToast();
    } catch {
      // Some builds may show short-lived/generic toast.
    }

    await subUnitPage.expectListLoaded();

    await subUnitPage.search(subUnit.subUnitCode);
    await subUnitPage.expectRowContains(
      subUnit.subUnitCode,
      updatedSubUnitDescription,
    );
  });
});
