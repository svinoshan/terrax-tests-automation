import { test, expect } from '@fixtures/auth.fixture';

test.describe('@smoke Locations', () => {
  test('opens the locations list and create panel', async ({ authenticatedUser, locationsPage }) => {
    void authenticatedUser;
    await locationsPage.open();
    await expect(locationsPage['page'].getByText(/facility name/i).first()).toBeVisible();
    await locationsPage.openCreate();
    await expect(locationsPage.field('facilityName')).toBeVisible();
  });
});
