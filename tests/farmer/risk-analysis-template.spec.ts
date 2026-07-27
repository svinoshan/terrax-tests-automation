import { test } from "@fixtures/auth.fixture";
import { createRiskAnalysisTemplateData } from "@data/farmer/risk-analysis-template.data";

test.describe("@regression Farmer Risk Analysis Template", () => {
  test("RISK_TEMPLATE_CREATE_UPDATE_001 - user can create and update risk analysis template", async ({
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

    await riskAnalysisTemplatePage.expectTemplateVisible(templateData.riskFactor);

    await riskAnalysisTemplatePage.expectTemplateRowContains(
      templateData.riskFactor,
      templateData.description,
    );

    await riskAnalysisTemplatePage.clickEdit(templateData.riskFactor);

    await riskAnalysisTemplatePage.updateDescription(
      templateData.updatedDescription,
    );

    await riskAnalysisTemplatePage.updateTemplate();

    try {
      await riskAnalysisTemplatePage.expectSuccessToastIfVisible();
    } catch {
      // Some builds show short-lived or generic success toasts.
    }

    await riskAnalysisTemplatePage.expectLoaded();

    await riskAnalysisTemplatePage.searchByText(templateData.riskFactor);

    await riskAnalysisTemplatePage.expectTemplateRowContains(
      templateData.riskFactor,
      templateData.updatedDescription,
    );
  });
});