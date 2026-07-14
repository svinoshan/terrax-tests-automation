import { expect } from '@playwright/test';
import { test } from '@fixtures/auth.fixture';

test.describe('@regression Audit Result', () => {
  test('AUDIT_RESULT_001 - user can search audit results and view details', async ({
    authenticatedUser,
    auditResultPage,
  }) => {
    void authenticatedUser;

    await auditResultPage.open();

    await auditResultPage.searchByFarmer(
      process.env.AUDIT_RESULT_FARMER ?? 'Sampath Thennakoon',
    );

    await auditResultPage.expectAtLeastOneResultRow();

    await auditResultPage.openFirstAuditResultDetails();

    await auditResultPage.closeAuditResultDetails();
  });

  test('AUDIT_RESULT_002 - user can open audit result print popup', async ({
    authenticatedUser,
    auditResultPage,
  }) => {
    void authenticatedUser;

    await auditResultPage.open();

    await auditResultPage.searchByFarmer(
      process.env.AUDIT_RESULT_FARMER ?? 'Sampath Thennakoon',
    );

    await auditResultPage.expectAtLeastOneResultRow();

    const popup = await auditResultPage.openFirstAuditResultPrintPopup();

    expect(popup, 'Expected Audit Result print popup/new tab to open').not.toBeNull();

    await popup?.close();
  });
});
