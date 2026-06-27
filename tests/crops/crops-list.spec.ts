import { test } from '@fixtures/auth.fixture';

test('@smoke crops list page loads', async ({ authenticatedUser, cropsListPage }) => {
  await cropsListPage.open();
  await cropsListPage.expectLoaded();
});
