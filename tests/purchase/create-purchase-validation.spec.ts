import { test, expect } from '@fixtures/auth.fixture';
import records from '@data/purchase/purchase-negative-data.json';
import positive from '@data/purchase/purchase-data.json';
import { PurchaseCase, PurchaseType } from '@data/purchase/purchase.data';

for (const type of ['FARMER_GROUP', 'SUPPLIER'] as PurchaseType[]) {
  for (const item of records.filter(r => !r.purchaseType || r.purchaseType === type)) {
    test('@validation ' + item.testCaseId + ' ' + type + ' ' + item.scenario,
      async ({ authenticatedUser, page, purchaseListPage, createPurchasePage }, testInfo) => {
        void authenticatedUser;
        test.setTimeout(180_000);
        let writes = 0;
        // Validation tests must never create a record, even if the UI regresses.
        await page.route('**/purchase/main', async route => {
          if (route.request().method() === 'POST') { writes++; await route.abort(); }
          else await route.continue();
        });
        try {
          await purchaseListPage.open();
          await purchaseListPage.clickAddNew();
          const data = positive.find(d => d.purchaseType === type)! as PurchaseCase;
          await createPurchasePage.prepare({ ...data, lines: [data.lines[0]] }, 'Validation only');
          const control = item.line ? createPurchasePage.lineField(0, item.field) : createPurchasePage.field(item.field);
          if (item.field === 'purchaseType') await control.selectOption('');
          else await control.fill(item.value);
          await control.blur();
          await expect(control).toHaveClass(/ng-invalid/);
          await createPurchasePage.action('Save').click();
          await expect(createPurchasePage.field('purchaseType')).toBeVisible();
          expect(writes, 'Invalid form attempted a POST').toBe(0);
        } finally {
          await testInfo.attach('purchase-selection', {
            body: JSON.stringify({ selections: createPurchasePage.selections, attempts: createPurchasePage.attempts }, null, 2),
            contentType: 'application/json'
          });
        }
      });
  }
}
