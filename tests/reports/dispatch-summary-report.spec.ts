import { test } from '@fixtures/auth.fixture';

test.describe('@regression Reports - Dispatch summary', () => {
  test('REPORT_DISPATCH_SUMMARY_001 - Show summary completes without generic error popup', async ({
    authenticatedUser,
    dispatchSummaryReportPage,
  }) => {
    void authenticatedUser;

    await dispatchSummaryReportPage.open();

    await dispatchSummaryReportPage.fillFilters();

    await dispatchSummaryReportPage.showSummary();

    await dispatchSummaryReportPage.expectReportCompletedWithRowsOrEmptyState();
  });

  test('REPORT_DISPATCH_SUMMARY_002 - Show details completes without generic error popup', async ({
    authenticatedUser,
    dispatchSummaryReportPage,
  }) => {
    void authenticatedUser;

    await dispatchSummaryReportPage.open();

    await dispatchSummaryReportPage.fillFilters();

    await dispatchSummaryReportPage.showDetails();

    await dispatchSummaryReportPage.expectReportCompletedWithRowsOrEmptyState();
  });
});
