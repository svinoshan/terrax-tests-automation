import { test } from '@fixtures/auth.fixture';

test('@smoke dashboard loads after login', async ({ authenticatedUser, dashboardPage }) => {
  await dashboardPage.expectLoaded();
  await dashboardPage.expectStatCardsVisible();
});
