import { test } from "@fixtures/auth.fixture";

test.describe("@validation Farmer Risk Analysis", () => {
  test("RISK_ANALYSIS_VAL_001 - incomplete checklist cannot be submitted", async ({
    authenticatedUser,
    riskAnalysisPage,
  }) => {
    void authenticatedUser;

    await riskAnalysisPage.open();

    await riskAnalysisPage.clickCreateNew();

    await riskAnalysisPage.selectFirstAvailableFarmer();

    await riskAnalysisPage.openChecklistTab();

    await riskAnalysisPage.submitExpectChecklistIncomplete();
  });
});