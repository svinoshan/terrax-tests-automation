import { test, expect } from '@fixtures/auth.fixture';
import { getLocationData } from '@data/locations/location.data';

for (const data of getLocationData()) {
  test(`@create @regression ${data.testCaseId} creates a location`, async ({ authenticatedUser, locationsPage }) => {
    void authenticatedUser;
    await locationsPage.open();
    await locationsPage.openCreate();
    await locationsPage.fill(data);
    await locationsPage.save();
    await expect(locationsPage.panel()).toBeHidden({ timeout: 15_000 });
    await locationsPage.search(data.facilityName);
    await locationsPage.expectRowContains(data.facilityName, data.address);
    await locationsPage.expectRowContains(data.facilityName, data.phoneNumber);
    await locationsPage.expectStatus(data.facilityName, data.status ? 'Active' : 'Inactive');
  });
}
