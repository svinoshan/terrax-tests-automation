import { test, expect } from '@fixtures/auth.fixture';
import { getSupplierData } from '@data/suppliers/supplier.data';

for (const data of getSupplierData()) {
  test(`@create @regression ${data.testCaseId} creates a supplier with locations`, async ({ authenticatedUser, suppliersPage }) => {
    void authenticatedUser;
    await suppliersPage.open();
    await suppliersPage.openCreate();
    await suppliersPage.fill(data);
    await suppliersPage.save();
    await expect(suppliersPage.panel()).toBeHidden({ timeout: 15_000 });
    await suppliersPage.search(data.supplierCode);
    await suppliersPage.expectRowContains(data.supplierCode, data.supplierName);
    await suppliersPage.expectRowContains(data.supplierCode, data.contactPerson);
    await suppliersPage.expectRowContains(data.supplierCode, data.phone);
    await suppliersPage.expectStatus(data.supplierCode, data.active ? 'Active' : 'Inactive');
  });
}
