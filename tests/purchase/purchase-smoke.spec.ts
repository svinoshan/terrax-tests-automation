import { test, expect } from '@fixtures/auth.fixture';
import { PurchaseType } from '@data/purchase/purchase.data';

test('@smoke Purchase list displays current columns', async ({ authenticatedUser, purchaseListPage }) => {
  void authenticatedUser;
  await purchaseListPage.open();
});

for (const type of ['FARMER_GROUP', 'SUPPLIER'] as PurchaseType[]) {
  test('@smoke Purchase conditional fields ' + type, async ({ authenticatedUser, purchaseListPage, createPurchasePage }) => {
    void authenticatedUser;
    await purchaseListPage.open();
    await purchaseListPage.clickAddNew();
    await createPurchasePage.expectLoaded();
    await expect(createPurchasePage.field('purchaseType').locator('option')).toHaveCount(3);
    await createPurchasePage.selectType(type);
    await expect(createPurchasePage.field('location')).toBeVisible();
    await expect(createPurchasePage.field('user')).toBeVisible();
    if (type === 'FARMER_GROUP') {
      await expect(createPurchasePage.field('farmer')).toBeVisible();
      await expect(createPurchasePage.field('land')).toBeVisible();
      await expect(createPurchasePage.lineField(0, 'massBalanceQty')).toBeVisible();
      await expect(createPurchasePage.field('supplier')).toBeHidden();
    } else {
      await expect(createPurchasePage.field('supplier')).toBeVisible();
      await expect(createPurchasePage.lineField(0, 'certifications')).toBeVisible();
      await expect(createPurchasePage.field('farmer')).toBeHidden();
      await expect(createPurchasePage.field('land')).toBeHidden();
    }
  });
}
