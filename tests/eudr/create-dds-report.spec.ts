import { test } from "@fixtures/auth.fixture";

type DdsActivityType = "Import" | "Export" | "Trade" | "Domestic production";

function getPreferredDdsActivityType(): DdsActivityType {
  const envValue = process.env.EUDR_DDS_ACTIVITY_TYPE;

  const allowedValues: DdsActivityType[] = [
    "Import",
    "Export",
    "Trade",
    "Domestic production",
  ];

  if (allowedValues.includes(envValue as DdsActivityType)) {
    return envValue as DdsActivityType;
  }

  return "Import";
}

test.describe("@regression EUDR DDS Reports", () => {
  test("EUDR_DDS_CREATE_001 - user can create DDS report", async ({
    authenticatedUser,
    ddsReportsPage,
    ddsReportFormPage,
  }) => {
    void authenticatedUser;

    const tradingCompany = `DDS Company E2E-${new Date()
      .toISOString()
      .replace(/[-:.TZ]/g, "")
      .slice(8, 17)}`;

    await ddsReportsPage.open();
    await ddsReportsPage.clickAddNew();

    await ddsReportFormPage.expectCreateLoaded();

    await ddsReportFormPage.selectOperatorWithFallback(
      process.env.EUDR_DDS_OPERATOR ?? "Test Operator",
    );

    await ddsReportFormPage.setTradingCompany(tradingCompany);

    await ddsReportFormPage.setDdsDate(new Date().toISOString().slice(0, 10));

    // await ddsReportFormPage.selectActivityType(
    //   (process.env.EUDR_DDS_ACTIVITY_TYPE as
    //     | 'Import'
    //     | 'Export'
    //     | 'Trade'
    //     | 'Domestic production') ?? 'Domestic production',
    // );

    // await ddsReportFormPage.expectActivityCountryState(
    //   (process.env.EUDR_DDS_ACTIVITY_TYPE as
    //     | 'Import'
    //     | 'Export'
    //     | 'Trade'
    //     | 'Domestic production') ?? 'Domestic production',
    // );

    // await ddsReportFormPage.selectCountryOfActivityWithFallback(
    //   process.env.EUDR_DDS_COUNTRY_OF_ACTIVITY ?? 'Spain',
    // );
    const activityType = await ddsReportFormPage.selectActivityTypeWithFallback(
      getPreferredDdsActivityType(),
    );

    await ddsReportFormPage.expectActivityCountryState(activityType);

    if (activityType !== "Export") {
      await ddsReportFormPage.selectCountryOfActivityWithFallback(
        process.env.EUDR_DDS_COUNTRY_OF_ACTIVITY ?? "Spain",
      );
    }

    if (activityType === "Import") {
      await ddsReportFormPage.selectCountryOfEntryWithFallback(
        process.env.EUDR_DDS_COUNTRY_OF_ENTRY ?? "Spain",
      );
    }

    await ddsReportFormPage.addCommodityRow();

    await ddsReportFormPage.fillFirstCommodityRow({
      productionDate: new Date().toISOString().slice(0, 10),
      netMass: "12",
    });

    await ddsReportFormPage.openSelectFarmersModal();

    await ddsReportFormPage.selectFirstAvailableFarmerLand();

    await ddsReportFormPage.confirmFarmerSelection();

    await ddsReportFormPage.save();

    await ddsReportsPage.expectLoaded();

    await ddsReportsPage.search(tradingCompany);

    await ddsReportsPage.expectAtLeastOneReportRow();
  });
});
