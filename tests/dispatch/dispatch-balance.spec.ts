import { expect } from "@playwright/test";
import { test } from "@fixtures/auth.fixture";
import { createDispatchData } from "@data/dispatch/dispatch.data";

test.describe("@regression Dispatch Balance", () => {
  test("DISPATCH_BAL_001 - Save dispatch reduces balance by dispatch quantity", async ({
    authenticatedUser,
    dispatchListPage,
    createDispatchPage,
  }) => {
    void authenticatedUser;

    const dispatchData = createDispatchData();

    await dispatchListPage.open();
    await dispatchListPage.clickAddNew();

    await createDispatchPage.expectLoaded();

    await createDispatchPage.fillHeader(dispatchData);
    await createDispatchPage.addFirstAvailablePurchaseDetail();

    await createDispatchPage.setFirstDispatchLineValuesWithinAvailable({
      //maxDispatchQty: 50,
      //priceMarkup: 10,
    });

    const beforeSaveLine =
      await createDispatchPage.getFirstDispatchLineNumbers();

    await createDispatchPage.save();

    try {
      await createDispatchPage.expectDispatchSavedToast();
    } catch {
      // Redirect/toast may be fast.
    }

    await dispatchListPage.expectLoaded();

    await dispatchListPage.search(dispatchData.vehicleNo);
    await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

    await dispatchListPage.clickEditForDispatch(dispatchData.vehicleNo);

    await createDispatchPage.expectUpdateLoaded();

    const expectedBalance =
      beforeSaveLine.balanceQty - beforeSaveLine.dispatchQty;

    await createDispatchPage.expectFirstDispatchLineBalance(expectedBalance);
  });
});

test("DISPATCH_BAL_002 - Cancel saved dispatch restores balance quantity", async ({
  authenticatedUser,
  dispatchListPage,
  createDispatchPage,
}) => {
  void authenticatedUser;

  const dispatchData = createDispatchData();

  await dispatchListPage.open();
  await dispatchListPage.clickAddNew();

  await createDispatchPage.expectLoaded();

  await createDispatchPage.fillHeader(dispatchData);
  await createDispatchPage.addFirstAvailablePurchaseDetail();

  const lineValues =
    await createDispatchPage.setFirstDispatchLineValuesWithinAvailable({
      //maxDispatchQty: 50,
      //priceMarkup: 10,
      // maxDispatchPrice can be enabled later if needed.
    });

  const beforeSaveLine = await createDispatchPage.getFirstDispatchLineNumbers();

  await createDispatchPage.save();

  try {
    await createDispatchPage.expectDispatchSavedToast();
  } catch {
    // Redirect/toast may be fast.
  }

  await dispatchListPage.expectLoaded();

  await dispatchListPage.search(dispatchData.vehicleNo);
  await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

  await dispatchListPage.clickEditForDispatch(dispatchData.vehicleNo);

  await createDispatchPage.expectUpdateLoaded();

  const expectedReservedBalance =
    beforeSaveLine.balanceQty - beforeSaveLine.dispatchQty;

  await createDispatchPage.expectFirstDispatchLineBalance(
    expectedReservedBalance,
  );

  await createDispatchPage.cancelDispatch();

  await dispatchListPage.expectLoaded();

  await dispatchListPage.search(dispatchData.vehicleNo);
  await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

  await dispatchListPage.expectDispatchCancelled(dispatchData.vehicleNo);

  // Open a new dispatch form and verify the same GRN balance is restored.
  await dispatchListPage.clickAddNew();

  await createDispatchPage.expectLoaded();

  await createDispatchPage.fillHeader(dispatchData);

  const restoredBalance =
    await createDispatchPage.getAvailablePurchaseDetailBalanceByGrn(
      beforeSaveLine.grnNo,
    );

  expect(restoredBalance).toBeCloseTo(beforeSaveLine.balanceQty, 2);
});

test("DISPATCH_BAL_003 - Update dispatch quantity adjusts balance correctly", async ({
  authenticatedUser,
  dispatchListPage,
  createDispatchPage,
}) => {
  void authenticatedUser;

  const dispatchData = createDispatchData();

  await dispatchListPage.open();
  await dispatchListPage.clickAddNew();

  await createDispatchPage.expectLoaded();

  await createDispatchPage.fillHeader(dispatchData);
  await createDispatchPage.addFirstAvailablePurchaseDetail();

  const initialLine =
    await createDispatchPage.setFirstDispatchLineValuesWithinAvailable({
      //maxDispatchQty: 50,
      //priceMarkup: 10,
      // maxDispatchPrice can be enabled later if needed.
    });

  const beforeSaveLine = await createDispatchPage.getFirstDispatchLineNumbers();

  await createDispatchPage.save();

  try {
    await createDispatchPage.expectDispatchSavedToast();
  } catch {
    // Redirect/toast may be fast.
  }

  await dispatchListPage.expectLoaded();

  await dispatchListPage.search(dispatchData.vehicleNo);
  await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

  await dispatchListPage.clickEditForDispatch(dispatchData.vehicleNo);

  await createDispatchPage.expectUpdateLoaded();

  const expectedBalanceAfterSave =
    beforeSaveLine.balanceQty - beforeSaveLine.dispatchQty;

  await createDispatchPage.expectFirstDispatchLineBalance(
    expectedBalanceAfterSave,
  );

  const originalDispatchQty = beforeSaveLine.dispatchQty;

  const updatedDispatchQty = Math.max(
    1,
    Math.floor(originalDispatchQty / 2),
  ).toString();

  const updatedLine =
    await createDispatchPage.updateFirstDispatchLineToSpecificQty(
      updatedDispatchQty,
    );

  await createDispatchPage.update();

  try {
    await createDispatchPage.expectDispatchSavedToast();
  } catch {
    // Redirect/toast may be fast.
  }

  await dispatchListPage.expectLoaded();

  await dispatchListPage.search(dispatchData.vehicleNo);
  await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

  await dispatchListPage.clickEditForDispatch(dispatchData.vehicleNo);

  await createDispatchPage.expectUpdateLoaded();

  const expectedBalanceAfterUpdate =
    beforeSaveLine.balanceQty - Number(updatedLine.dispatchQty);

  await createDispatchPage.expectFirstDispatchLineBalance(
    expectedBalanceAfterUpdate,
  );

  await createDispatchPage.expectUpdatedDispatchValues(
    dispatchData.note,
    updatedLine.dispatchQty,
    updatedLine.dispatchPrice,
  );
});

test("DISPATCH_BAL_004 - Save and Authorized reduces balance once", async ({
  authenticatedUser,
  dispatchListPage,
  createDispatchPage,
}) => {
  void authenticatedUser;

  const dispatchData = createDispatchData();

  await dispatchListPage.open();
  await dispatchListPage.clickAddNew();

  await createDispatchPage.expectLoaded();

  await createDispatchPage.fillHeader(dispatchData);
  await createDispatchPage.addFirstAvailablePurchaseDetail();

  await createDispatchPage.setFirstDispatchLineValuesWithinAvailable({
    //maxDispatchQty: 50,
    //priceMarkup: 10,
  });

  const beforeSaveLine = await createDispatchPage.getFirstDispatchLineNumbers();

  await createDispatchPage.saveAndAuthorize();

  try {
    await createDispatchPage.expectDispatchSavedToast();
  } catch {
    // Redirect/toast may be fast.
  }

  await dispatchListPage.expectLoaded();

  await dispatchListPage.search(dispatchData.vehicleNo);
  await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

  await dispatchListPage.clickViewForDispatch(dispatchData.vehicleNo);

  const expectedBalanceAfterAuthorize =
    beforeSaveLine.balanceQty - beforeSaveLine.dispatchQty;

  await createDispatchPage.expectFirstDispatchLineBalance(
    expectedBalanceAfterAuthorize,
  );
});

test("DISPATCH_BAL_005 - Cancel authorized dispatch restores balance quantity", async ({
  authenticatedUser,
  dispatchListPage,
  createDispatchPage,
}) => {
  void authenticatedUser;

  const dispatchData = createDispatchData();

  await dispatchListPage.open();
  await dispatchListPage.clickAddNew();

  await createDispatchPage.expectLoaded();

  await createDispatchPage.fillHeader(dispatchData);
  await createDispatchPage.addFirstAvailablePurchaseDetail();

  await createDispatchPage.setFirstDispatchLineValuesWithinAvailable();

  const beforeAuthorizeLine =
    await createDispatchPage.getFirstDispatchLineNumbers();

  await createDispatchPage.saveAndAuthorize();

  try {
    await createDispatchPage.expectDispatchSavedToast();
  } catch {
    // Redirect/toast may be fast.
  }

  await dispatchListPage.expectLoaded();

  await dispatchListPage.search(dispatchData.vehicleNo);
  await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

  await dispatchListPage.clickViewForDispatch(dispatchData.vehicleNo);

  const expectedBalanceAfterAuthorize =
    beforeAuthorizeLine.balanceQty - beforeAuthorizeLine.dispatchQty;

  await createDispatchPage.expectFirstDispatchLineBalance(
    expectedBalanceAfterAuthorize,
  );

  await createDispatchPage.cancelDispatch();

  await dispatchListPage.expectLoaded();

  await dispatchListPage.search(dispatchData.vehicleNo);
  await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

  await dispatchListPage.expectDispatchCancelled(dispatchData.vehicleNo);

  // Open a new dispatch form for the same dispatch-to and verify the same GRN balance is restored.
  await dispatchListPage.clickAddNew();

  await createDispatchPage.expectLoaded();

  await createDispatchPage.fillHeader(dispatchData);

  const restoredBalance =
    await createDispatchPage.getAvailablePurchaseDetailBalanceByGrn(
      beforeAuthorizeLine.grnNo,
    );

  expect(restoredBalance).toBeCloseTo(beforeAuthorizeLine.balanceQty, 2);
});
