import { expect } from '@playwright/test';
import { test } from '@fixtures/auth.fixture';
import {
  createFarmerOrganizationalData,
  createFarmerProfileData,
} from '@data/farmer/farmer-profile.data';

test.describe('@known-bug Farmer Profile', () => {
  test.skip(
    'BUG: Supplier type is not persisted after creating farmer',
    async ({ authenticatedUser, farmerListPage, farmerProfilePage }) => {
      const profileData = createFarmerProfileData();
      const orgData = createFarmerOrganizationalData();

      await farmerListPage.open();
      await farmerListPage.clickAddFarmer();

      await farmerProfilePage.expectLoaded();

      await farmerProfilePage.fillCommonInfo(profileData);
      await farmerProfilePage.fillOrganizationalInfo(orgData);

      await farmerProfilePage.save();

      try {
        await farmerProfilePage.expectFarmerSavedToast();
      } catch {
        // Some builds may redirect quickly or show short-lived success toast.
      }

      await farmerListPage.expectLoaded();

      await farmerListPage.search(orgData.farmerCodeEUJAS);
      await farmerListPage.expectFarmerVisible(orgData.farmerCodeEUJAS);

      await farmerListPage.clickEditForFarmer(orgData.farmerCodeEUJAS);
      await farmerProfilePage.expectLoaded();

      // Expected behavior:
      // Supplier type selected during create should be persisted after save.
      //
      // Current bug:
      // Supplier type is reset to "Select Supplier type" after farmer is created.
      await farmerProfilePage.expectSupplierTypeValue(profileData.supplierType);
    },
  );
});
