import { test, expect } from '@fixtures/auth.fixture';

test.describe('@smoke Buyers', () => {
  test('opens the buyer list and shows required location feedback', async ({ authenticatedUser, buyersPage }) => {
    void authenticatedUser; await buyersPage.open(); await buyersPage.openCreate(); await buyersPage.save();
    await expect(buyersPage.field('name')).toHaveClass(/ng-invalid/);
    await buyersPage.expectInline('At least one location is required');
  });
});
