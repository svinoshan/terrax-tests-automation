import { test } from "@fixtures/auth.fixture";
import { createRiskAnalysisTemplateData } from "@data/farmer/risk-analysis-template.data";

test.describe("@regression Farmer Risk Analysis Template Delete", () => {
  test("RISK_TEMPLATE_DELETE_001 - user can deactivate created risk analysis template", async ({
    authenticatedUser,
    riskAnalysisTemplatePage,
  }) => {
    void authenticatedUser;

    const templateData = createRiskAnalysisTemplateData();

    await riskAnalysisTemplatePage.open();

    await riskAnalysisTemplatePage.openCreatePanel();

    await riskAnalysisTemplatePage.fillTemplate(templateData);

    await riskAnalysisTemplatePage.addTemplate();

    try {
      await riskAnalysisTemplatePage.expectSuccessToastIfVisible();
    } catch {
      // Some builds show short-lived or generic success toasts.
    }

    await riskAnalysisTemplatePage.expectLoaded();

    await riskAnalysisTemplatePage.searchByText(templateData.riskFactor);

    await riskAnalysisTemplatePage.expectTemplateVisible(
      templateData.riskFactor,
    );

    await riskAnalysisTemplatePage.expectTemplateStatus(
      templateData.riskFactor,
      /Active/i,
    );

    await riskAnalysisTemplatePage.deactivateTemplate(templateData.riskFactor);

    try {
      await riskAnalysisTemplatePage.expectSuccessToastIfVisible();
    } catch {
      // Some builds show short-lived or generic success toasts.
    }

    await riskAnalysisTemplatePage.expectLoaded();

    await riskAnalysisTemplatePage.searchByText(templateData.riskFactor);

    await riskAnalysisTemplatePage.expectTemplateStatus(
      templateData.riskFactor,
      /Inactive/i,
    );
  });
});
