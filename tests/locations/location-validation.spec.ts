import { test, expect } from '@fixtures/auth.fixture';
import { locationNegativeData } from '@data/locations/location.data';

for (const data of locationNegativeData.filter(item => item.expectedSource === 'inline' || item.expectedSource === 'control-invalid')) {
  test(`@validation ${data.testCaseId} ${data.scenario}`, async ({ authenticatedUser, locationsPage }) => {
    void authenticatedUser; await locationsPage.open(); await locationsPage.openCreate(); await locationsPage.fill(data.data); await locationsPage.save();
    if (data.expectedSource === 'inline' && data.expectedMessage) await locationsPage.expectInline(data.expectedMessage);
    else await expect(locationsPage.field(data.expectedField)).toHaveClass(/ng-invalid/);
  });
}

for (const data of locationNegativeData.filter(item => item.expectedSource === 'validation-dialog')) {
  test(`@validation ${data.testCaseId} ${data.scenario}`, async ({ authenticatedUser, locationsPage, page }) => {
    void authenticatedUser; await locationsPage.open(); await locationsPage.openCreate(); await locationsPage.fill(data.data); await locationsPage.save();
    await expect(page.getByText(data.expectedMessage!, { exact: false }).first()).toBeVisible({ timeout: 10_000 });
  });
}
