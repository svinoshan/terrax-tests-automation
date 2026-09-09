import { test, expect } from '@fixtures/auth.fixture';
import { supplierNegativeData } from '@data/suppliers/supplier.data';

for(const item of supplierNegativeData.filter(value=>!value.expectedField.startsWith('locations.')&&(value.expectedSource==='inline'||value.expectedSource==='control-invalid'))){
  test(`@validation ${item.testCaseId} ${item.scenario}`,async({authenticatedUser,suppliersPage})=>{void authenticatedUser;await suppliersPage.open();await suppliersPage.openCreate();await suppliersPage.fill(item.data);await suppliersPage.save();if(item.expectedSource==='inline'&&item.expectedMessage)await suppliersPage.expectInline(item.expectedMessage);else await expect(suppliersPage.field(item.expectedField)).toHaveClass(/ng-invalid/);});
}


for(const item of supplierNegativeData.filter(value=>value.expectedSource==='validation-dialog')){
  test(`@validation ${item.testCaseId} ${item.scenario}`,async({authenticatedUser,suppliersPage,page})=>{void authenticatedUser;await suppliersPage.open();await suppliersPage.openCreate();await suppliersPage.fill(item.data);await suppliersPage.save();await expect(page.getByText(item.expectedMessage!,{exact:false}).first()).toBeVisible({timeout:10_000});});
}

for(const item of supplierNegativeData.filter(value=>value.expectedField.startsWith('locations.')&&value.expectedSource==='inline')){
  test(`@validation ${item.testCaseId} ${item.scenario}`,async({authenticatedUser,suppliersPage})=>{void authenticatedUser;await suppliersPage.open();await suppliersPage.openCreate();await suppliersPage.panel().getByRole('button',{name:/add/i}).click();await suppliersPage.locationDialog.fill(item.data.locations[0]);await suppliersPage.locationDialog.save();await suppliersPage.locationDialog.expectMessage(item.expectedMessage!);});
}
