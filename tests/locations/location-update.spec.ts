import { test, expect } from '@fixtures/auth.fixture';
import { getLocationData } from '@data/locations/location.data';

for (const data of getLocationData().filter(record => record.updates)) {
  test(`@update @regression ${data.testCaseId} updates an existing location`, async ({ authenticatedUser, locationsPage }) => {
    void authenticatedUser;
    const updates = data.updates!;
    await locationsPage.open();
    await locationsPage.search(data.facilityName);
    await locationsPage.edit(data.facilityName);
    if (updates.phoneNumber !== undefined) await locationsPage.field('phoneNumber').fill(updates.phoneNumber);
    if (updates.address !== undefined) await locationsPage.field('address').fill(updates.address);
    if (typeof updates.status === 'boolean') await locationsPage.setStatus(updates.status);
    await locationsPage.update();
    await expect(locationsPage.panel()).toBeHidden({ timeout: 15_000 });
    await locationsPage.search(data.facilityName);
    if (updates.address) await locationsPage.expectRowContains(data.facilityName, updates.address);
    if (updates.phoneNumber) await locationsPage.expectRowContains(data.facilityName, updates.phoneNumber);
    if (typeof updates.status === 'boolean') await locationsPage.expectStatus(data.facilityName, updates.status ? 'Active' : 'Inactive');
  });
}
