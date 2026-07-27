import { test } from "@fixtures/auth.fixture";

test.describe("@smoke Farmer Risk Analysis Template", () => {
  test("RISK_TEMPLATE_SMOKE_001 - Risk Analysis Template page opens", async ({
    authenticatedUser,
    riskAnalysisTemplatePage,
  }) => {
    void authenticatedUser;

    await riskAnalysisTemplatePage.open();

    await riskAnalysisTemplatePage.expectLoaded();
  });

  test("RISK_TEMPLATE_SMOKE_002 - Add new opens Create template panel", async ({
    authenticatedUser,
    riskAnalysisTemplatePage,
  }) => {
    void authenticatedUser;

    await riskAnalysisTemplatePage.open();

    await riskAnalysisTemplatePage.openCreatePanel();

    await riskAnalysisTemplatePage.expectCreatePanelLoaded();

    await riskAnalysisTemplatePage.closePanel();
  });
});