import { test, expect } from '@fixtures/auth.fixture';
import { getBuyerData } from '@data/buyers/buyer.data';

for (const data of getBuyerData()) {
  test(`@create @regression ${data.testCaseId} creates a buyer with locations`, async ({ authenticatedUser, buyersPage }) => {
    void authenticatedUser;
    await buyersPage.open();
    await buyersPage.openCreate();
    await buyersPage.fill(data);
    await buyersPage.save();
    await expect(buyersPage.panel()).toBeHidden({ timeout: 15_000 });
    await buyersPage.search(data.name);
    await buyersPage.expectRowContains(data.name, data.address);
    await buyersPage.expectRowContains(data.name, data.phoneNo);
    await buyersPage.expectStatus(data.name, data.status ? 'Active' : 'Inactive');
  });
}
