import { test } from '@fixtures/auth.fixture';

test.describe('@smoke Dispatch', () => {
  test('dispatch list opens and shows expected columns', async ({
    authenticatedUser,
    dispatchListPage,
  }) => {
    void authenticatedUser;

    await dispatchListPage.open();
    await dispatchListPage.expectLoaded();
  });

  test('add new opens create dispatch form', async ({
    authenticatedUser,
    dispatchListPage,
    createDispatchPage,
  }) => {
    void authenticatedUser;

    await dispatchListPage.open();
    await dispatchListPage.clickAddNew();

    await createDispatchPage.expectLoaded();
  });
});
