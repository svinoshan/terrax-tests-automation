import { test } from "@fixtures/auth.fixture";

test.describe("@validation Farmer Risk Analysis Template", () => {
  test("RISK_TEMPLATE_VAL_001 - empty template form shows required validation", async ({
    authenticatedUser,
    riskAnalysisTemplatePage,
  }) => {
    void authenticatedUser;

    await riskAnalysisTemplatePage.open();

    await riskAnalysisTemplatePage.openCreatePanel();

    await riskAnalysisTemplatePage.submitEmptyTemplateExpectValidation();
  });
});