import { test } from "@fixtures/auth.fixture";

test.describe("@regression EUDR DDS Reports", () => {
  test("EUDR_DDS_QR_DOWNLOAD_001 - user can download DDS QR code", async ({
    authenticatedUser,
    ddsReportsPage,
  }) => {
    void authenticatedUser;

    await ddsReportsPage.open();
    await ddsReportsPage.expectAtLeastOneReportRow();

    await ddsReportsPage.downloadFirstQrCode();
  });
});
