import { test } from '@fixtures/auth.fixture';

test.describe('@smoke Audit submodules', () => {
  test('AUDIT_CHECKLIST_SMOKE_001 - Check List page opens', async ({
    authenticatedUser,
    auditSubModulePage,
  }) => {
    void authenticatedUser;

    await auditSubModulePage.openCheckList();

    await auditSubModulePage.expectPageLoaded(/Check List|Checklist/i);
  });

  test('AUDIT_RESULT_SMOKE_001 - Audit Result page opens', async ({
    authenticatedUser,
    auditSubModulePage,
  }) => {
    void authenticatedUser;

    await auditSubModulePage.openAuditResult();

    await auditSubModulePage.expectPageLoaded(/Audit Result/i);
  });

  test('AUDIT_RESULT_SUMMARY_SMOKE_001 - Audit Result Summary page opens', async ({
    authenticatedUser,
    auditSubModulePage,
  }) => {
    void authenticatedUser;

    await auditSubModulePage.openAuditResultSummary();

    await auditSubModulePage.expectPageLoaded(/Audit Result Summary/i);
  });
});