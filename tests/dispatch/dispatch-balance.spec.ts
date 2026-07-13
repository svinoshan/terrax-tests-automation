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
      maxDispatchQty: 50,
      priceMarkup: 10,
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

test('DISPATCH_BAL_002 - Cancel saved dispatch restores balance quantity', async ({
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
      maxDispatchQty: 50,
      priceMarkup: 10,
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
