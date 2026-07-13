import { expect } from '@playwright/test';
import { test } from '@fixtures/auth.fixture';

test.describe('@smoke Reports', () => {
  test('PURCHASE_REPORT_001 - user can open purchase report', async ({
    authenticatedUser,
    purchaseListPage,
    createPurchasePage,
  }) => {
    void authenticatedUser;

    await purchaseListPage.open();

    await purchaseListPage.clickFirstPurchaseAction();

    const popup = await createPurchasePage.openReportPopup();

    expect(popup, 'Expected Purchase report to open in a popup/new tab').not.toBeNull();

    await popup?.close();
  });

  test('DISPATCH_REPORT_001 - user can open dispatch report', async ({
    authenticatedUser,
    dispatchListPage,
    createDispatchPage,
  }) => {
    void authenticatedUser;

    await dispatchListPage.open();

    await dispatchListPage.clickFirstDispatchAction();

    const popup = await createDispatchPage.openReportPopup();

    expect(popup, 'Expected Dispatch report to open in a popup/new tab').not.toBeNull();

    await popup?.close();
  });
});