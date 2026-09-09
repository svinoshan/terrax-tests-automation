import { test } from '@fixtures/auth.fixture';
import { getBuyerData } from '@data/buyers/buyer.data';

test('@regression buyer location coordinates synchronize with the map', async ({ authenticatedUser, buyersPage }) => {
  void authenticatedUser; const data=getBuyerData()[0]; test.skip(!data, 'No Buyer data selected');
  await buyersPage.open(); await buyersPage.openCreate(); await buyersPage.panel().getByRole('button',{name:/add/i}).click();
  await buyersPage.locationDialog.expectCoordinatesMoveMarker(data.locations[0].coordinates || '6.927079, 79.861244');
  await buyersPage.locationDialog.clickMapAndExpectCoordinatesChanged();
});
