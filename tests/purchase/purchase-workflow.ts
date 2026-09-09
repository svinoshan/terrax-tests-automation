import { test, expect } from '@fixtures/auth.fixture';
import { randomUUID } from 'node:crypto';
import { getPurchaseData } from '@data/purchase/purchase.data';

type Workflow = 'create' | 'update' | 'create-authorized' | 'update-authorized' | 'cancel' | 'cancel-authorized' | 'report';
export function purchaseWorkflow(workflow: Workflow): void {
  for (const data of getPurchaseData()) {
    test('@' + workflow + ' @regression ' + data.testCaseId + ' ' + workflow + ' ' + data.purchaseType,
      async ({ authenticatedUser, purchaseListPage, createPurchasePage }, testInfo) => {
        void authenticatedUser;
        test.setTimeout(240_000);
        const note = 'E2E ' + data.testCaseId + ' ' + randomUUID();
        try {
          await purchaseListPage.open();
          await purchaseListPage.clickAddNew();
          await createPurchasePage.prepare(data, note);
          const authorized = workflow === 'create-authorized' || workflow === 'cancel-authorized';
          const saved = await createPurchasePage.createAndIdentify(authorized);
          await purchaseListPage.search(saved.number);
          await purchaseListPage.expectStatus(saved.number, authorized ? 'Authorized' : 'Not authorized');
          await purchaseListPage.clickEditForPurchase(saved.number);
          await createPurchasePage.expectPersisted(saved);

          if (workflow === 'update' || workflow === 'update-authorized') {
            await createPurchasePage.field('note').fill(note + ' updated');
            await createPurchasePage.lineField(0, 'qty').fill(String(data.updates.qty));
            await createPurchasePage.lineField(0, 'unitPrice').fill(String(data.updates.unitPrice));
            const result = await createPurchasePage.submit(workflow === 'update-authorized', true);
            saved.document = result.document;
            await purchaseListPage.search(saved.number);
            await purchaseListPage.expectStatus(saved.number, workflow === 'update-authorized' ? 'Authorized' : 'Not authorized');
            await purchaseListPage.clickEditForPurchase(saved.number);
            await createPurchasePage.expectPersisted(saved);
          }
          if (workflow === 'cancel' || workflow === 'cancel-authorized') {
            await createPurchasePage.cancelPurchase();
            await purchaseListPage.search(saved.number);
            await purchaseListPage.expectStatus(saved.number, 'Cancel');
            await purchaseListPage.clickEditForPurchase(saved.number);
            await createPurchasePage.expectPersisted(saved);
          }
          if (authorized || workflow === 'update-authorized' || workflow.startsWith('cancel')) {
            await expect(createPurchasePage.field('note')).toBeDisabled();
            await expect(createPurchasePage.lineField(0, 'qty')).toBeDisabled();
            await expect(createPurchasePage.action('Update')).toBeHidden();
          }
          if (workflow === 'report') {
            const popup = await createPurchasePage.openReportPopup();
            await expect(popup).toHaveURL(/^blob:/);
            await popup.close();
          }
        } finally {
          await testInfo.attach('purchase-selection', {
            body: JSON.stringify({ note, selections: createPurchasePage.selections, attempts: createPurchasePage.attempts }, null, 2),
            contentType: 'application/json'
          });
        }
      });
  }
}
