import { test } from '@fixtures/auth.fixture';

test.describe('@regression EUDR DDS Reports', () => {
  test('EUDR_DDS_FARMER_MODAL_001 - Select Farmers modal opens from DDS report form', async ({
    authenticatedUser,
    ddsReportsPage,
    ddsReportFormPage,
  }) => {
    void authenticatedUser;

    await ddsReportsPage.open();
    await ddsReportsPage.clickAddNew();

    await ddsReportFormPage.expectCreateLoaded();

    await ddsReportFormPage.selectOperatorWithFallback(
      process.env.EUDR_DDS_OPERATOR ?? 'Test Operator',
    );

    await ddsReportFormPage.setTradingCompany(
      process.env.EUDR_DDS_TRADING_COMPANY ?? 'Test Company',
    );

    await ddsReportFormPage.setDdsDate(new Date().toISOString().slice(0, 10));

    await ddsReportFormPage.selectActivityType('Domestic production');

    await ddsReportFormPage.expectActivityCountryState('Domestic production');

    await ddsReportFormPage.selectCountryOfActivityWithFallback(
      process.env.EUDR_DDS_COUNTRY_OF_ACTIVITY ?? 'Spain',
    );

    await ddsReportFormPage.addCommodityRow();

    await ddsReportFormPage.fillFirstCommodityRow({
      productionDate: new Date().toISOString().slice(0, 10),
      netMass: '12',
    });

    await ddsReportFormPage.openSelectFarmersModal();

    await ddsReportFormPage.closeSelectFarmersModal();
  });
});
