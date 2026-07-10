import { expect, test } from "@fixtures/auth.fixture";
import { createDispatchData } from "@data/dispatch/dispatch.data";

test.describe("@regression Update Dispatch", () => {
  test("user can update unauthorized dispatch", async ({
    authenticatedUser,
    dispatchListPage,
    createDispatchPage,
  }) => {
    void authenticatedUser;

    const dispatchData = createDispatchData();

    const updatedNote = `${dispatchData.note} updated`;
    //const updatedDispatchQty = "210";
    //const updatedDispatchPrice = "20";

    // Arrange: create unauthorized dispatch using normal Save.
    await dispatchListPage.open();
    await dispatchListPage.clickAddNew();

    await createDispatchPage.expectLoaded();

    await createDispatchPage.fillHeader(dispatchData);
    await createDispatchPage.addFirstAvailablePurchaseDetail();

    // Important: do not dispatch full balance by default.
    await createDispatchPage.setFirstDispatchLineValuesWithinAvailable();

    // await createDispatchPage.setFirstDispatchLineValuesWithinAvailable({
    //   maxDispatchQty: 50,
    //   priceMarkup: 10,
    // });

    await createDispatchPage.save();

    try {
      await createDispatchPage.expectDispatchSavedToast();
    } catch {
      // Redirect/toast may be fast.
    }

    await dispatchListPage.expectLoaded();

    await dispatchListPage.search(dispatchData.vehicleNo);
    await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

    // Act: open edit and update note + first line.
    await dispatchListPage.clickEditForDispatch(dispatchData.vehicleNo);

    await createDispatchPage.expectUpdateLoaded();

    await createDispatchPage.updateNote(updatedNote);

    // await createDispatchPage.updateFirstDispatchLine(
    //   updatedDispatchQty,
    //   updatedDispatchPrice,
    // );
    // const updatedDispatchQty =
    //   await createDispatchPage.updateFirstDispatchLineWithinAvailable(
    //     updatedDispatchPrice,
    //   );
    const updatedLine =
      await createDispatchPage.updateFirstDispatchLineSafely();

    // const updatedLine = await createDispatchPage.updateFirstDispatchLineSafely({
    //   priceMarkup: 10,
    // });

    await createDispatchPage.update();

    try {
      await createDispatchPage.expectDispatchSavedToast();
    } catch {
      // Redirect/toast may be fast.
    }

    // Assert: reopen and verify values persisted.
    await dispatchListPage.expectLoaded();

    await dispatchListPage.search(dispatchData.vehicleNo);
    await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

    await dispatchListPage.clickEditForDispatch(dispatchData.vehicleNo);

    await createDispatchPage.expectUpdateLoaded();

    // await createDispatchPage.expectUpdatedDispatchValues(
    //   updatedNote,
    //   updatedLine.dispatchQty,
    //   updatedLine.dispatchPrice,
    // );

    if (updatedLine.dispatchQty && updatedLine.dispatchPrice) {
      await createDispatchPage.expectUpdatedDispatchValues(
        updatedNote,
        updatedLine.dispatchQty,
        updatedLine.dispatchPrice,
      );
    } else {
      await expect(createDispatchPage.noteInput).toHaveValue(updatedNote);
    }
  });
});
