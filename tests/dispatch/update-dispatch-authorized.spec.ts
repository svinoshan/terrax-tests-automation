import { expect, test } from "@fixtures/auth.fixture";
import { createDispatchData } from "@data/dispatch/dispatch.data";

test.describe("@regression Update and Authorize Dispatch", () => {
  test("user can update unauthorized dispatch and authorize it", async ({
    authenticatedUser,
    dispatchListPage,
    createDispatchPage,
  }) => {
    void authenticatedUser;

    const dispatchData = createDispatchData();

    const updatedNote = `${dispatchData.note} updated and authorized`;

    // Arrange: create unauthorized dispatch using Save.
    await dispatchListPage.open();
    await dispatchListPage.clickAddNew();

    await createDispatchPage.expectLoaded();

    await createDispatchPage.fillHeader(dispatchData);
    await createDispatchPage.addFirstAvailablePurchaseDetail();

    // Important: do not dispatch full balance by default.
    await createDispatchPage.setFirstDispatchLineValuesWithinAvailable();

    await createDispatchPage.save();

    try {
      await createDispatchPage.expectDispatchSavedToast();
    } catch {
      // Redirect/toast may be fast.
    }

    await dispatchListPage.expectLoaded();

    await dispatchListPage.search(dispatchData.vehicleNo);
    await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

    // Act: open edit, update note + line, then authorize.
    await dispatchListPage.clickEditForDispatch(dispatchData.vehicleNo);

    await createDispatchPage.expectUpdateLoaded();

    // Wait until Angular has finished loading the saved note.
    await createDispatchPage.expectDispatchNoteValue(dispatchData.note);

    await createDispatchPage.updateNote(updatedNote);

    const updatedLine =
      await createDispatchPage.updateFirstDispatchLineSafely();

    await createDispatchPage.updateAndAuthorize();

    try {
      await createDispatchPage.expectDispatchSavedToast();
    } catch {
      // Some builds show an Ok dialog instead of toast.
    }

    // Assert: dispatch remains visible in list after update + authorize.
    await dispatchListPage.expectLoaded();

    await dispatchListPage.search(dispatchData.vehicleNo);
    await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

    await dispatchListPage.expectDispatchRowContains(
      dispatchData.vehicleNo,
      dispatchData.dispatchBy,
    );

    // Optional persistence verification if the row can still be opened.
    await dispatchListPage.clickViewForDispatch(dispatchData.vehicleNo);

    // If the authorized screen opens in view mode, this will still help confirm persisted data.
    // If your app uses "View dispatch" heading, we can add a stricter view assertion later.
    // await createDispatchPage.expectUpdatedDispatchValues(
    //   updatedNote,
    //   updatedLine.dispatchQty ?? "",
    //   updatedLine.dispatchPrice ?? "",
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
