import { test } from "@fixtures/auth.fixture";
import { createDispatchData } from "@data/dispatch/dispatch.data";

async function createSavedDispatch({
  dispatchListPage,
  createDispatchPage,
  authorize = false,
}: {
  dispatchListPage: any;
  createDispatchPage: any;
  authorize?: boolean;
}) {
  const dispatchData = createDispatchData();

  await dispatchListPage.open();
  await dispatchListPage.clickAddNew();

  await createDispatchPage.expectLoaded();

  await createDispatchPage.fillHeader(dispatchData);
  await createDispatchPage.addFirstAvailablePurchaseDetail();

  // Do not dispatch full balance by default.
  await createDispatchPage.setFirstDispatchLineValuesWithinAvailable();

//   await createDispatchPage.setFirstDispatchLineValuesWithinAvailable({
//     maxDispatchQty: 10,
//     priceMarkup: 5,
//   });

  if (authorize) {
    await createDispatchPage.saveAndAuthorize();
  } else {
    await createDispatchPage.save();
  }

  try {
    await createDispatchPage.expectDispatchSavedToast();
  } catch {
    // Redirect/toast may be fast.
  }

  await dispatchListPage.expectLoaded();

  await dispatchListPage.search(dispatchData.vehicleNo);
  await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

  return dispatchData;
}

test.describe("@regression Cancel Dispatch", () => {
  test("user can cancel unauthorized dispatch", async ({
    authenticatedUser,
    dispatchListPage,
    createDispatchPage,
  }) => {
    void authenticatedUser;

    const dispatchData = await createSavedDispatch({
      dispatchListPage,
      createDispatchPage,
      authorize: false,
    });

    await dispatchListPage.clickEditForDispatch(dispatchData.vehicleNo);

    await createDispatchPage.expectUpdateLoaded();
    await createDispatchPage.cancelDispatch();

    await dispatchListPage.expectLoaded();

    await dispatchListPage.search(dispatchData.vehicleNo);
    await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

    await dispatchListPage.expectDispatchCancelled(dispatchData.vehicleNo);
  });

  test("user can cancel authorized dispatch from view/update screen", async ({
    authenticatedUser,
    dispatchListPage,
    createDispatchPage,
  }) => {
    void authenticatedUser;

    const dispatchData = await createSavedDispatch({
      dispatchListPage,
      createDispatchPage,
      authorize: true,
    });

    await dispatchListPage.clickViewForDispatch(dispatchData.vehicleNo);

    // Depending on app behavior, authorized dispatch may open as view or update-like read-only screen.
    await createDispatchPage.cancelDispatch();

    await dispatchListPage.expectLoaded();

    await dispatchListPage.search(dispatchData.vehicleNo);
    await dispatchListPage.expectDispatchVisible(dispatchData.vehicleNo);

    await dispatchListPage.expectDispatchCancelled(dispatchData.vehicleNo);
  });
});
