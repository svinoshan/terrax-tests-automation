import { test, expect } from '@fixtures/auth.fixture';
import { getSupplierData } from '@data/suppliers/supplier.data';

for (const data of getSupplierData().filter(record => record.updates)) {
  test(`@update @regression ${data.testCaseId} updates an existing supplier and its location`, async ({ authenticatedUser, suppliersPage }) => {
    void authenticatedUser;
    const updates = data.updates!;
    await suppliersPage.open();
    await suppliersPage.search(data.supplierCode);
    await suppliersPage.edit(data.supplierCode);
    if (updates.contactPerson !== undefined) await suppliersPage.field('contactPerson').fill(updates.contactPerson);
    if (updates.phone !== undefined) await suppliersPage.field('phone').fill(updates.phone);
    if (updates.email !== undefined) await suppliersPage.field('email').fill(updates.email);
    if (updates.address !== undefined) await suppliersPage.field('address').fill(updates.address);
    if (updates.description !== undefined) await suppliersPage.field('description').fill(updates.description);
    if (typeof updates.active === 'boolean') await suppliersPage.setStatus(updates.active);
    if (updates.location) {
      await suppliersPage.editFirstLocation();
      if (updates.location.address !== undefined) await suppliersPage.locationDialog.field('address').fill(updates.location.address);
      if (updates.location.coordinates !== undefined) await suppliersPage.locationDialog.field('coordinates').fill(updates.location.coordinates);
      await suppliersPage.locationDialog.save();
    }
    await suppliersPage.update();
    await expect(suppliersPage.panel()).toBeHidden({ timeout: 15_000 });
    await suppliersPage.search(data.supplierCode);
    if (updates.contactPerson) await suppliersPage.expectRowContains(data.supplierCode, updates.contactPerson);
    if (updates.phone) await suppliersPage.expectRowContains(data.supplierCode, updates.phone);
    if (typeof updates.active === 'boolean') await suppliersPage.expectStatus(data.supplierCode, updates.active ? 'Active' : 'Inactive');
  });
}
