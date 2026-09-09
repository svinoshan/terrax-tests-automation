import { test, expect } from '@fixtures/auth.fixture';
import { getPurchaseData } from '@data/purchase/purchase.data';

for (const data of getPurchaseData()) {
  test('@lines ' + data.testCaseId + ' totals, duplicate item, remove line and zero price',
    async ({ authenticatedUser, page, purchaseListPage, createPurchasePage }, testInfo) => {
      void authenticatedUser;
      test.setTimeout(180_000);
      try {
        await purchaseListPage.open();
        await purchaseListPage.clickAddNew();
        await createPurchasePage.prepare({ ...data, lines: [data.lines[0]] }, 'Unsaved line checks');
        const firstItem = await createPurchasePage.lineField(0, 'itemId').inputValue();
        await createPurchasePage.lineField(0, 'unitPrice').fill('0');
        await expect(createPurchasePage.lineField(0, 'unitPrice')).toHaveClass(/ng-valid/);
        await expect(page.locator('app-purchase-form tbody tr').last().locator('td.text-success')).toHaveText('0.00');

        await page.getByRole('button', { name: /add line/i }).click();
        await createPurchasePage.lineField(1, 'itemId').selectOption(firstItem);
        await expect(createPurchasePage.lineField(1, 'itemId')).toHaveClass(/ng-invalid/);
        await createPurchasePage.line(1).getByRole('button').click();
        await page.getByRole('button', { name: /yes.*delete/i }).click();
        await expect(page.locator('app-purchase-form tbody tr:has(select[formcontrolname="itemId"])')).toHaveCount(1);
        await createPurchasePage.lineField(0, 'qty').fill('1.25');
        await createPurchasePage.lineField(0, 'unitPrice').fill('12.34');
        await expect(page.locator('app-purchase-form tbody tr').last().locator('td.text-success')).toHaveText('15.43');
        if (data.purchaseType === 'FARMER_GROUP') {
          await expect(createPurchasePage.field('harvestEnd')).toBeDisabled();
          await createPurchasePage.field('harvestStart').fill('2026-09-09');
          await createPurchasePage.field('harvestStart').blur();
          await expect(createPurchasePage.field('harvestEnd')).toBeEnabled();
          await createPurchasePage.field('harvestEnd').fill('2026-09-08');
          await createPurchasePage.field('harvestEnd').blur();
          await expect(page.locator('app-purchase-form form')).toHaveClass(/ng-invalid/);
        }
      } finally {
        await testInfo.attach('purchase-selection', {
          body: JSON.stringify({ selections: createPurchasePage.selections, attempts: createPurchasePage.attempts }, null, 2),
          contentType: 'application/json'
        });
      }
    });
}
