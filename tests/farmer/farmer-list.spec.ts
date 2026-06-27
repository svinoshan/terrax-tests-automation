import { test } from '@fixtures/auth.fixture';

test('@smoke farmer list page loads', async ({ authenticatedUser, farmerListPage }) => {
  await farmerListPage.open();
  await farmerListPage.expectLoaded();
});
