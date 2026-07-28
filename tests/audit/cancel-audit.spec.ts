import { test } from "@fixtures/auth.fixture";
import { createAuditData } from "@data/audit/audit.data";
import { count } from "console";

test.describe("@regression Cancel Audit", () => {
  test("AUDIT_CANCEL_001 - user can cancel planned audit from list action", async ({
    authenticatedUser,
    auditListPage,
    createAuditPage,
  }) => {
    void authenticatedUser;

    const auditData = createAuditData();

    await auditListPage.open();
    await auditListPage.clickAddNew();

    await createAuditPage.expectLoaded();

    const auditFormResult = await createAuditPage.fillForm(auditData);

    await createAuditPage.configureSelectedFarmerRows({
      auditDate: auditData.auditDate,
      auditType: auditData.auditType,
      note: auditData.note,
      count: auditData.farmerRowsToSelect,
    });

    await createAuditPage.save();

    try {
      await createAuditPage.expectAuditSavedToast();
    } catch {
      // Redirect/toast may be fast.
    }

    await auditListPage.expectLoaded();

    await auditListPage.search(auditData.auditNumber);
    await auditListPage.expectAuditVisible(auditData.auditNumber);

    await auditListPage.expectAuditRowContains(
      auditData.auditNumber,
      auditFormResult.selectedFieldOfficer,
    );

    await auditListPage.expectAuditStatus(
      auditData.auditNumber,
      /Pending/i,
    );

    // Cancel is done from Audit list row action, not from Update Audit form.
    await auditListPage.cancelAuditFromList(auditData.auditNumber);

    try {
      await createAuditPage.expectAuditSavedToast();
    } catch {
      // Toast may be fast or list may update immediately.
    }

    await auditListPage.expectLoaded();

    await auditListPage.search(auditData.auditNumber);
    await auditListPage.expectAuditVisible(auditData.auditNumber);

    await auditListPage.expectAuditCancelled(auditData.auditNumber);
  });
});
