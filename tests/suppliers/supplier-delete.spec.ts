import { test, expect } from '@fixtures/auth.fixture';
import supplierRecords from '@data/suppliers/supplier-data.json';
import { SupplierTestData } from '@data/suppliers/supplier.data';

test('@regression deletes an active supplier by deactivating it',async({authenticatedUser,suppliersPage})=>{
  void authenticatedUser;const suffix=Date.now();const data=structuredClone(supplierRecords[0]) as SupplierTestData;data.supplierCode=`E2E-DEL-${suffix}`;data.supplierName=`E2E Delete Supplier ${suffix}`;data.registrationNo=`E2E-REG-${suffix}`;data.taxNo=`E2E-TAX-${suffix}`;data.locations[0].facilityName=`E2E Supplier Facility ${suffix}`;data.active=true;
  await suppliersPage.open();await suppliersPage.openCreate();await suppliersPage.fill(data);await suppliersPage.save();await expect(suppliersPage.panel()).toBeHidden({timeout:15_000});await suppliersPage.search(data.supplierCode);await suppliersPage.delete(data.supplierCode);await suppliersPage.search(data.supplierCode);await suppliersPage.expectStatus(data.supplierCode,'Inactive');
});
