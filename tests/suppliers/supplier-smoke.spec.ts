import { test, expect } from '@fixtures/auth.fixture';

test.describe('@smoke Suppliers', () => {
  test('opens supplier list and validates required controls', async ({ authenticatedUser, suppliersPage }) => {
    void authenticatedUser; await suppliersPage.open(); await suppliersPage.openCreate(); await suppliersPage.save();
    await expect(suppliersPage.field('supplierCode')).toHaveClass(/ng-invalid/);
    await suppliersPage.expectInline('At least one location is required');
  });
});
