import { test, expect } from '@fixtures/auth.fixture';
import supplierRecords from '@data/suppliers/supplier-data.json';
import { SupplierTestData } from '@data/suppliers/supplier.data';

for (const duplicateField of ['supplierCode', 'taxNo', 'supplierNameCountry'] as const) {
  test(`@validation rejects duplicate ${duplicateField}`, async ({ authenticatedUser, suppliersPage, page }) => {
    void authenticatedUser;
    const suffix = `${Date.now()}-${duplicateField}`;
    const first = structuredClone(supplierRecords[0]) as SupplierTestData;
    first.supplierCode = `E2E-${suffix}`; first.supplierName = `E2E Supplier ${suffix}`;
    first.registrationNo = `E2E-REG-${suffix}`; first.taxNo = `E2E-TAX-${suffix}`;
    first.locations[0].facilityName = `E2E Facility ${suffix}`;
    await suppliersPage.open(); await suppliersPage.openCreate(); await suppliersPage.fill(first); await suppliersPage.save();
    await expect(suppliersPage.panel()).toBeHidden({ timeout: 15_000 });

    const second = structuredClone(first);
    second.locations[0].facilityName += ' second'; second.registrationNo += '-2';
    if (duplicateField !== 'supplierCode') second.supplierCode += '-2';
    if (duplicateField !== 'taxNo') second.taxNo += '-2';
    if (duplicateField !== 'supplierNameCountry') second.supplierName += ' second';
    await suppliersPage.openCreate(); await suppliersPage.fill(second); await suppliersPage.save();

    const message = duplicateField === 'supplierCode'
      ? `Supplier Code already exists: ${first.supplierCode}`
      : duplicateField === 'taxNo'
        ? `Tax No already exists: ${first.taxNo}`
        : new RegExp(`Supplier name '${first.supplierName}'.*already exists in country`);
    await expect(page.getByText(message, { exact: false }).first()).toBeVisible({ timeout: 10_000 });
  });
}
