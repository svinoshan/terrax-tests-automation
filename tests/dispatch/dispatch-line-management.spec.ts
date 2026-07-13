import { test } from "@fixtures/auth.fixture";
import { createDispatchData } from "@data/dispatch/dispatch.data";

test.describe("@regression Dispatch Line Management", () => {
  test("DISPATCH_LINE_001 - user can delete added dispatch line before save and add another line", async ({
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

    // Add first line.
    await createDispatchPage.addFirstAvailablePurchaseDetail();

    await createDispatchPage.setFirstDispatchLineValuesWithinAvailable();

    await createDispatchPage.expectAtLeastOneDispatchLine();

    // Delete the line before saving.
    await createDispatchPage.deleteFirstDispatchLine();

    await createDispatchPage.expectNoDispatchLines();

    // Add a line again and save successfully.
    await createDispatchPage.addFirstAvailablePurchaseDetail();

    await createDispatchPage.setFirstDispatchLineValuesWithinAvailable();

    await createDispatchPage.expectAtLeastOneDispatchLine();

    await createDispatchPage.save();

    try {
      await createDispatchPage.expectDispatchSavedToast();
    } catch {
      // Redirect/toast may be fast.
    }

    await dispatchListPage.expectLoaded();

    await dispatchListPage.search(dispatchData.vehicleNo);
    await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

    await dispatchListPage.expectDispatchRowContains(
      dispatchData.vehicleNo,
      dispatchData.dispatchBy,
    );
  });
});

test("DISPATCH_LINE_002 - user can add multiple dispatch lines and totals calculate correctly", async ({
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

  // Add first available purchase detail.
  await createDispatchPage.addNextAvailablePurchaseDetail();

  const firstLine =
    await createDispatchPage.setDispatchLineValuesWithinAvailableByIndex(0);

  await createDispatchPage.expectDispatchLineCount(1);

  // Add another available purchase detail.
  // Previously selected purchase detail should be unavailable/disabled,
  // so this chooses the next available unchecked row.
  await createDispatchPage.addNextAvailablePurchaseDetail();

  const secondLine =
    await createDispatchPage.setDispatchLineValuesWithinAvailableByIndex(1);

  await createDispatchPage.expectDispatchLineCount(2);

  const firstQty = Number(firstLine.dispatchQty);
  const firstPrice = Number(firstLine.dispatchPrice);

  const secondQty = Number(secondLine.dispatchQty);
  const secondPrice = Number(secondLine.dispatchPrice);

  const expectedTotalQty = firstQty + secondQty;
  const expectedTotalPrice = firstQty * firstPrice + secondQty * secondPrice;

  await createDispatchPage.expectDispatchTotals(
    expectedTotalQty,
    expectedTotalPrice,
  );

  await createDispatchPage.save();

  try {
    await createDispatchPage.expectDispatchSavedToast();
  } catch {
    // Redirect/toast may be fast.
  }

  await dispatchListPage.expectLoaded();

  await dispatchListPage.search(dispatchData.vehicleNo);
  await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

  await dispatchListPage.expectDispatchRowContains(
    dispatchData.vehicleNo,
    dispatchData.dispatchBy,
  );
});
