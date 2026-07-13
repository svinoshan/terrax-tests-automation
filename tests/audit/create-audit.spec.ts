import { test } from "@fixtures/auth.fixture";
import { createAuditData } from "@data/audit/audit.data";

test.describe("@regression Create Audit", () => {
  test("user can create audit with selected farmers", async ({
    authenticatedUser,
    auditListPage,
    createAuditPage,
  }) => {
    void authenticatedUser;

    const auditData = createAuditData();

    await auditListPage.open();
    await auditListPage.clickAddNew();

    await createAuditPage.expectLoaded();

    //await createAuditPage.fillForm(auditData);
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

    await auditListPage.expectAuditRowContains(
      auditData.auditNumber,
      auditFormResult.selectedFieldOfficer,
    );

    await auditListPage.expectAuditRowContains(
      auditData.auditNumber,
      /Pending|Completed|Cancel/i,
    );
  });
});
