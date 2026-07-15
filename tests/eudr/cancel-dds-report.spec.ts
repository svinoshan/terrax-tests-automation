import { test } from '@fixtures/auth.fixture';

test.describe('@regression EUDR DDS Reports', () => {
  test('EUDR_DDS_CANCEL_001 - user can cancel created DDS report', async ({
    authenticatedUser,
    ddsReportsPage,
    ddsReportFormPage,
  }) => {
    void authenticatedUser;

    const suffix = new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, '')
      .slice(8, 17);

    const tradingCompany = `DDS Cancel E2E-${suffix}`;

    await ddsReportsPage.open();
    await ddsReportsPage.clickAddNew();

    await ddsReportFormPage.expectCreateLoaded();

    await ddsReportFormPage.selectOperatorWithFallback(
      process.env.EUDR_DDS_OPERATOR ?? 'Test Operator',
    );

    await ddsReportFormPage.setTradingCompany(tradingCompany);

    await ddsReportFormPage.setDdsDate(
      new Date().toISOString().slice(0, 10),
    );

    await ddsReportFormPage.selectActivityType('Domestic production');

    await ddsReportFormPage.expectActivityCountryState(
      'Domestic production',
    );

    await ddsReportFormPage.selectCountryOfActivityWithFallback(
      process.env.EUDR_DDS_COUNTRY_OF_ACTIVITY ?? 'Spain',
    );

    await ddsReportFormPage.addCommodityRow();

    await ddsReportFormPage.fillFirstCommodityRow({
      productionDate: new Date().toISOString().slice(0, 10),
      netMass: '12',
    });

    await ddsReportFormPage.openSelectFarmersModal();
    await ddsReportFormPage.selectFirstAvailableFarmerLand();
    await ddsReportFormPage.confirmFarmerSelection();

    await ddsReportFormPage.save();

    await ddsReportsPage.expectLoaded();

    await ddsReportsPage.search(tradingCompany);
    await ddsReportsPage.expectReportVisible(tradingCompany);

    await ddsReportsPage.openReportForEdit(tradingCompany);

    await ddsReportFormPage.expectUpdateLoaded();

    await ddsReportFormPage.cancelDdsReport();

    await ddsReportsPage.expectLoaded();

    await ddsReportsPage.search(tradingCompany);
    await ddsReportsPage.expectReportVisible(tradingCompany);

    await ddsReportsPage.expectReportStatus(tradingCompany, /Cancel/i);
  });
});
