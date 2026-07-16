import { test } from '@fixtures/auth.fixture';

test.describe('@regression Reports - Mass balance', () => {
  test('REPORT_MASS_BALANCE_001 - Mass balance opens and shows expected columns', async ({
    authenticatedUser,
    massBalanceReportPage,
  }) => {
    void authenticatedUser;

    await massBalanceReportPage.open();
    await massBalanceReportPage.expectLoaded();
  });

  test('REPORT_MASS_BALANCE_002 - user can apply filters and search', async ({
    authenticatedUser,
    massBalanceReportPage,
  }) => {
    void authenticatedUser;

    await massBalanceReportPage.open();

    await massBalanceReportPage.applyFilters();

    await massBalanceReportPage.expectAtLeastOneResultOrEmptyState();

    await massBalanceReportPage.clearFilters();
  });
});
