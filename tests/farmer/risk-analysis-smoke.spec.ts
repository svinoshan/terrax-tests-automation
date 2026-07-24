import { test } from "@fixtures/auth.fixture";

test.describe("@smoke Farmer Risk Analysis", () => {
  test("RISK_ANALYSIS_SMOKE_001 - Risk Analysis result page opens", async ({
    authenticatedUser,
    riskAnalysisPage,
  }) => {
    void authenticatedUser;

    await riskAnalysisPage.open();

    await riskAnalysisPage.expectRiskAnalysisResultLoaded();
  });

  test("RISK_ANALYSIS_SMOKE_002 - Create new opens Create Risk analysis page", async ({
    authenticatedUser,
    riskAnalysisPage,
  }) => {
    void authenticatedUser;

    await riskAnalysisPage.open();

    await riskAnalysisPage.clickCreateNew();

    await riskAnalysisPage.expectCreateRiskAnalysisLoaded();
  });
});