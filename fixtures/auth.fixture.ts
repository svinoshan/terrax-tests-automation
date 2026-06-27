import { test as base, expect } from './pages.fixture';
import { requiredEnv } from '@utils/env';

type AuthFixtures = {
  authenticatedUser: void;
};

export const test = base.extend<AuthFixtures>({
  authenticatedUser: async ({ loginPage, dashboardPage, appShell }, use) => {
    await loginPage.open();
    await loginPage.login(requiredEnv('APP_USERNAME'), requiredEnv('APP_PASSWORD'));

    await dashboardPage.expectLoaded();
    await appShell.dismissLocationAccessPopupIfVisible();

    await use();
  },
});

export { expect };
