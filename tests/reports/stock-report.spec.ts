import { test } from '@fixtures/auth.fixture';

test.describe('@regression Reports - Stock report', () => {
  test('REPORT_STOCK_001 - Stock report opens and shows expected columns', async ({
    authenticatedUser,
    stockReportPage,
  }) => {
    void authenticatedUser;

    await stockReportPage.open();
    await stockReportPage.expectLoaded();
    await stockReportPage.expectAtLeastOneStockRow();
  });

  test('REPORT_STOCK_002 - user can expand stock report row', async ({
    authenticatedUser,
    stockReportPage,
  }) => {
    void authenticatedUser;

    await stockReportPage.open();
    await stockReportPage.expectAtLeastOneStockRow();

    await stockReportPage.expandFirstStockRow();
  });
});
