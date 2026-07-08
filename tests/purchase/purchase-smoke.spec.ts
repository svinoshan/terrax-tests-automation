import { test } from '@fixtures/auth.fixture';

test.describe('@smoke Purchase', () => {
  test('purchase notes list opens and shows expected columns', async ({
    authenticatedUser,
    purchaseListPage,
  }) => {
    await purchaseListPage.open();
    await purchaseListPage.expectLoaded();
  });

  test('add new opens create purchase note form', async ({
    authenticatedUser,
    purchaseListPage,
    createPurchasePage,
  }) => {
    await purchaseListPage.open();
    await purchaseListPage.clickAddNew();

    await createPurchasePage.expectLoaded();
  });
});
