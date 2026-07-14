import { test } from '@fixtures/auth.fixture';

test.describe('@smoke Audit Check List', () => {
  test('CHECKLIST_SMOKE_001 - Check List page opens and shows expected columns', async ({
    authenticatedUser,
    checkListPage,
  }) => {
    void authenticatedUser;

    await checkListPage.open();
    await checkListPage.expectLoaded();
  });
});
