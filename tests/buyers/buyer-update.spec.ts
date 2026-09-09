import { test, expect } from '@fixtures/auth.fixture';
import { getBuyerData } from '@data/buyers/buyer.data';

for (const data of getBuyerData().filter(record => record.updates)) {
  test(`@update @regression ${data.testCaseId} updates an existing buyer and its location`, async ({ authenticatedUser, buyersPage }) => {
    void authenticatedUser;
    const updates = data.updates!;
    await buyersPage.open();
    await buyersPage.search(data.name);
    await buyersPage.edit(data.name);
    if (updates.address !== undefined) await buyersPage.field('address').fill(updates.address);
    if (updates.phoneNo !== undefined) await buyersPage.field('phoneNo').fill(updates.phoneNo);
    if (typeof updates.status === 'boolean') await buyersPage.setStatus(updates.status);
    if (updates.location) {
      await buyersPage.editFirstLocation();
      if (updates.location.address !== undefined) await buyersPage.locationDialog.field('address').fill(updates.location.address);
      if (updates.location.coordinates !== undefined) await buyersPage.locationDialog.field('coordinates').fill(updates.location.coordinates);
      await buyersPage.locationDialog.save();
    }
    await buyersPage.update();
    await expect(buyersPage.panel()).toBeHidden({ timeout: 15_000 });
    await buyersPage.search(data.name);
    if (updates.address) await buyersPage.expectRowContains(data.name, updates.address);
    if (updates.phoneNo) await buyersPage.expectRowContains(data.name, updates.phoneNo);
    if (typeof updates.status === 'boolean') await buyersPage.expectStatus(data.name, updates.status ? 'Active' : 'Inactive');
  });
}
