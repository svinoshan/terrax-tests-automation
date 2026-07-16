import { test } from '@fixtures/auth.fixture';

test.describe('@regression Reports - Purchase summary', () => {
  test.fail('REPORT_PURCHASE_SUMMARY_001 - Show summary completes without generic error popup', async ({
    authenticatedUser,
    purchaseSummaryReportPage,
  }) => {
    void authenticatedUser;

    await purchaseSummaryReportPage.open();

    await purchaseSummaryReportPage.fillFilters();

    await purchaseSummaryReportPage.showSummary();

    await purchaseSummaryReportPage.expectReportCompletedWithRowsOrEmptyState();
  });

  test.fail('REPORT_PURCHASE_SUMMARY_002 - Show details completes without generic error popup', async ({
    authenticatedUser,
    purchaseSummaryReportPage,
  }) => {
    void authenticatedUser;

    await purchaseSummaryReportPage.open();

    await purchaseSummaryReportPage.fillFilters();

    await purchaseSummaryReportPage.showDetails();

    await purchaseSummaryReportPage.expectReportCompletedWithRowsOrEmptyState();
  });
});