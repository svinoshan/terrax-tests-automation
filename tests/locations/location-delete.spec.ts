import { test, expect } from '@fixtures/auth.fixture';
import locationRecords from '@data/locations/location-data.json';
import { LocationTestData } from '@data/locations/location.data';

test('@regression deletes an active location by deactivating it',async({authenticatedUser,locationsPage})=>{
  void authenticatedUser;const suffix=Date.now();const data=structuredClone(locationRecords[0]) as LocationTestData;data.facilityName=`E2E Delete Location ${suffix}`;data.status=true;
  await locationsPage.open();await locationsPage.openCreate();await locationsPage.fill(data);await locationsPage.save();await expect(locationsPage.panel()).toBeHidden({timeout:15_000});await locationsPage.search(data.facilityName);await locationsPage.delete(data.facilityName);await locationsPage.search(data.facilityName);await locationsPage.expectStatus(data.facilityName,'Inactive');
});
