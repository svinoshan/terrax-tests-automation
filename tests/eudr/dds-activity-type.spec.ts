import { test } from '@fixtures/auth.fixture';

test.describe('@regression EUDR DDS Reports', () => {
  test('EUDR_DDS_ACTIVITY_001 - activity type controls country fields', async ({
    authenticatedUser,
    ddsReportsPage,
    ddsReportFormPage,
  }) => {
    void authenticatedUser;

    await ddsReportsPage.open();
    await ddsReportsPage.clickAddNew();

    await ddsReportFormPage.expectCreateLoaded();

    await ddsReportFormPage.selectActivityType('Import');
    await ddsReportFormPage.expectActivityCountryState('Import');

    await ddsReportFormPage.selectActivityType('Export');
    await ddsReportFormPage.expectActivityCountryState('Export');

    await ddsReportFormPage.selectActivityType('Trade');
    await ddsReportFormPage.expectActivityCountryState('Trade');

    await ddsReportFormPage.selectActivityType('Domestic production');
    await ddsReportFormPage.expectActivityCountryState('Domestic production');
  });
});
