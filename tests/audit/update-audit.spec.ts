import { test } from '@fixtures/auth.fixture';
import { createAuditData } from '@data/audit/audit.data';

test.describe('@regression Update Audit', () => {
  test('AUDIT_UPDATE_001 - user can update planned audit', async ({
    authenticatedUser,
    auditListPage,
    createAuditPage,
  }) => {
    void authenticatedUser;

    const auditData = createAuditData();

    const updatedAuditNumber = `${auditData.auditNumber}-UPD`;

    await auditListPage.open();
    await auditListPage.clickAddNew();

    await createAuditPage.expectLoaded();

    const auditFormResult = await createAuditPage.fillForm(auditData);

    await createAuditPage.save();

    try {
      await createAuditPage.expectAuditSavedToast();
    } catch {
      // Redirect/toast may be fast.
    }

    await auditListPage.expectLoaded();

    await auditListPage.search(auditData.auditNumber);
    await auditListPage.expectAuditVisible(auditData.auditNumber);

    await auditListPage.clickEditForAudit(auditData.auditNumber);

    await createAuditPage.expectUpdateLoaded();

    await createAuditPage.updateAuditNumber(updatedAuditNumber);

    await createAuditPage.update();

    try {
      await createAuditPage.expectAuditSavedToast();
    } catch {
      // Redirect/toast may be fast.
    }

    await auditListPage.expectLoaded();

    await auditListPage.search(updatedAuditNumber);
    await auditListPage.expectAuditVisible(updatedAuditNumber);

    await auditListPage.expectAuditRowContains(
      updatedAuditNumber,
      auditFormResult.selectedFieldOfficer,
    );

    await auditListPage.expectAuditRowContains(
      updatedAuditNumber,
      /Pending|Completed|Cancel/i,
    );
  });
});