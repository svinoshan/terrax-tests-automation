import { test } from "@fixtures/auth.fixture";
import { createRiskAnalysisData } from "@data/farmer/risk-analysis.data";

test.describe("@regression Farmer Risk Analysis", () => {
  test("RISK_ANALYSIS_CREATE_001 - user can create risk analysis for selected farmer", async ({
    authenticatedUser,
    riskAnalysisPage,
  }) => {
    void authenticatedUser;

    const riskAnalysisData = createRiskAnalysisData();

    await riskAnalysisPage.open();

    await riskAnalysisPage.clickCreateNew();

    const selectedFarmerCode =
      await riskAnalysisPage.selectFirstAvailableFarmer();

    await riskAnalysisPage.completeChecklist(riskAnalysisData);

    await riskAnalysisPage.submit();

    await riskAnalysisPage.expectCreatedResult(selectedFarmerCode);
  });
});