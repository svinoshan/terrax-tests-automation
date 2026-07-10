import { test } from "@fixtures/auth.fixture";
import { createDispatchData } from "@data/dispatch/dispatch.data";

test.describe("@regression Create Authorized Dispatch", () => {
  test("user can create dispatch using Save and Authorized", async ({
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

    // Important: do not dispatch full balance by default.
    await createDispatchPage.setFirstDispatchLineValuesWithinAvailable();

    // await createDispatchPage.setFirstDispatchLineValuesWithinAvailable({
    //   maxDispatchQty: 25,
    //maxDispatchPrice: 1000,
    //   priceMarkup: 15,
    // });

    await createDispatchPage.saveAndAuthorize();

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
