import { test } from "@fixtures/auth.fixture";

test.describe("@smoke EUDR DDS Reports", () => {
  test("EUDR_DDS_SMOKE_001 - DDS Reports list opens and shows expected columns", async ({
    authenticatedUser,
    ddsReportsPage,
  }) => {
    void authenticatedUser;

    await ddsReportsPage.open();
    await ddsReportsPage.expectLoaded();
  });

  test("EUDR_DDS_SMOKE_002 - Add new opens Create DDS Report form", async ({
    authenticatedUser,
    ddsReportsPage,
    ddsReportFormPage,
  }) => {
    void authenticatedUser;

    await ddsReportsPage.open();
    await ddsReportsPage.clickAddNew();

    await ddsReportFormPage.expectCreateLoaded();
  });
});
