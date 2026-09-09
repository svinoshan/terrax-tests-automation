import { test, expect } from '@fixtures/auth.fixture';
import { buyerNegativeData } from '@data/buyers/buyer.data';

for (const item of buyerNegativeData.filter(value => !value.expectedField.startsWith('locations.') && (value.expectedSource === 'inline' || value.expectedSource === 'control-invalid'))) {
  test(`@validation ${item.testCaseId} ${item.scenario}`, async ({ authenticatedUser, buyersPage }) => {
    void authenticatedUser; await buyersPage.open(); await buyersPage.openCreate(); await buyersPage.fill(item.data); await buyersPage.save();
    if (item.expectedSource === 'inline' && item.expectedMessage) await buyersPage.expectInline(item.expectedMessage);
    else await expect(buyersPage.field(item.expectedField)).toHaveClass(/ng-invalid/);
  });
}

for (const item of buyerNegativeData.filter(value => value.expectedSource === 'validation-dialog')) {
  test(`@validation ${item.testCaseId} ${item.scenario}`, async ({ authenticatedUser, buyersPage, page }) => {
    void authenticatedUser; await buyersPage.open(); await buyersPage.openCreate(); await buyersPage.fill(item.data); await buyersPage.save();
    await expect(page.getByText(item.expectedMessage!, { exact: false }).first()).toBeVisible({ timeout: 10_000 });
  });
}

for (const item of buyerNegativeData.filter(value => value.expectedField.startsWith('locations.') && value.expectedSource === 'inline')) {
  test(`@validation ${item.testCaseId} ${item.scenario}`, async ({ authenticatedUser, buyersPage }) => {
    void authenticatedUser; await buyersPage.open(); await buyersPage.openCreate();
    await buyersPage.panel().getByRole('button', { name: /add/i }).click();
    await buyersPage.locationDialog.fill(item.data.locations[0]); await buyersPage.locationDialog.save();
    await buyersPage.locationDialog.expectMessage(item.expectedMessage!);
  });
}
