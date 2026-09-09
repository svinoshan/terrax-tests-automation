import { test, expect } from '@fixtures/auth.fixture';
import buyerRecords from '@data/buyers/buyer-data.json';
import { BuyerTestData } from '@data/buyers/buyer.data';

test('@regression deletes an active buyer by deactivating it',async({authenticatedUser,buyersPage})=>{
  void authenticatedUser;const suffix=Date.now();const data=structuredClone(buyerRecords[0]) as BuyerTestData;data.name=`E2E Delete Buyer ${suffix}`;data.locations[0].facilityName=`E2E Buyer Facility ${suffix}`;data.status=true;
  await buyersPage.open();await buyersPage.openCreate();await buyersPage.fill(data);await buyersPage.save();await expect(buyersPage.panel()).toBeHidden({timeout:15_000});await buyersPage.search(data.name);await buyersPage.delete(data.name);await buyersPage.search(data.name);await buyersPage.expectStatus(data.name,'Inactive');
});
