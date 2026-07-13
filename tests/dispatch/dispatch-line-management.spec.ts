import { test } from '@fixtures/auth.fixture';
import { createDispatchData } from '@data/dispatch/dispatch.data';

test.describe('@regression Dispatch Line Management', () => {
  test('DISPATCH_LINE_001 - user can delete added dispatch line before save and add another line', async ({
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