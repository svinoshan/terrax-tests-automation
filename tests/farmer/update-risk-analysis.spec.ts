import { test } from "@fixtures/auth.fixture";
import { createRiskAnalysisData } from "@data/farmer/risk-analysis.data";

test.describe("@regression Farmer Risk Analysis Update", () => {
  test("RISK_ANALYSIS_UPDATE_001 - user can update existing risk analysis", async ({
    authenticatedUser,
    riskAnalysisPage,
  }) => {
    void authenticatedUser;

    const createData = createRiskAnalysisData();

    await riskAnalysisPage.open();

    await riskAnalysisPage.clickCreateNew();

    await riskAnalysisPage.selectFirstAvailableFarmer();

    await riskAnalysisPage.completeChecklist(createData);

    await riskAnalysisPage.submit();

    await riskAnalysisPage.expectRiskAnalysisResultLoaded();

    await riskAnalysisPage.selectLatestRiskAnalysisResult();

    await riskAnalysisPage.clickEdit();

    const updateData = {
      ...createData,
      beforeOverallRisk: "Negligible risk",
      afterOverallRisk: "Negligible risk",
      checklist: [
        {
          riskLevel: "Non Negligible Risk",
          mitigationStrategy: "Automation mitigation 01 updated",
          remark: "Automation remark 01 updated",
          riskAfterMitigation: "Non Negligible Risk",
        },
        {
          riskLevel: "Negligible Risk",
          mitigationStrategy: "Automation mitigation 02 updated",
          remark: "Automation remark 02 updated",
          riskAfterMitigation: "Negligible Risk",
        },
        {
          riskLevel: "Non Negligible Risk",
          mitigationStrategy: "Automation mitigation 03 updated",
          remark: "Automation remark 03 updated",
          riskAfterMitigation: "Non Negligible Risk",
        },
      ],
    };

    await riskAnalysisPage.completeChecklist(updateData);

    await riskAnalysisPage.submit();

    await riskAnalysisPage.expectRiskAnalysisResultLoaded();

    await riskAnalysisPage.selectLatestRiskAnalysisResult();

    await riskAnalysisPage.expectResultContainsUpdatedValues();
  });
});