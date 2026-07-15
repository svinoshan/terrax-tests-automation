import { test } from '@fixtures/auth.fixture';

test.describe('@regression EUDR DDS Reports', () => {
  test('EUDR_DDS_UPDATE_001 - user can open existing DDS report and update', async ({
    authenticatedUser,
    ddsReportsPage,
    ddsReportFormPage,
  }) => {
    void authenticatedUser;

    await ddsReportsPage.open();
    await ddsReportsPage.expectAtLeastOneReportRow();

    await ddsReportsPage.openFirstReportForEdit();

    await ddsReportFormPage.expectUpdateLoaded();

    await ddsReportFormPage.addCommodityRow();

    await ddsReportFormPage.deleteLastCommodityRow();

    await ddsReportFormPage.update();

    await ddsReportsPage.expectLoaded();
  });
});
