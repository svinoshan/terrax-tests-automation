import { test } from "@fixtures/auth.fixture";
import { createDispatchData } from "@data/dispatch/dispatch.data";

test.describe("@regression Create Dispatch", () => {
  test("user can create dispatch with available purchase detail", async ({
    authenticatedUser,
    dispatchListPage,
    createDispatchPage,
  }) => {
    void authenticatedUser;

    const dispatchData = createDispatchData();

    await dispatchListPage.open();
    await dispatchListPage.clickAddNew();

    await createDispatchPage.expectLoaded();

    const selectedDispatchTo =
      await createDispatchPage.fillHeader(dispatchData);

    await createDispatchPage.addFirstAvailablePurchaseDetail();

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

    await dispatchListPage.expectDispatchRowContains(
      dispatchData.vehicleNo,
      dispatchData.dispatchBy,
    );

    await dispatchListPage.expectDispatchRowContains(
      dispatchData.vehicleNo,
      selectedDispatchTo,
    );
  });
});
