import { test } from '@fixtures/auth.fixture';

test.describe('@regression Audit Result Summary', () => {
  test('AUDIT_RESULT_SUMMARY_001 - user can filter summary by checklist', async ({
    authenticatedUser,
    auditResultSummaryPage,
  }) => {
    void authenticatedUser;

    await auditResultSummaryPage.open();

    await auditResultSummaryPage.selectCheckListWithFallback(
      process.env.AUDIT_RESULT_SUMMARY_CHECKLIST ??
        process.env.CHECKLIST_DRAG_NAME ??
        'Fruit and Vegetables',
    );

    await auditResultSummaryPage.expectSummaryRowsVisible();
  });
});
