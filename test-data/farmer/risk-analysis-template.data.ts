export type RiskAnalysisTemplateTestData = {
  riskFactor: string;
  description: string;
  updatedDescription: string;
};

export function createRiskAnalysisTemplateData(): RiskAnalysisTemplateTestData {
  const unique = Date.now().toString();

  return {
    riskFactor: `E2E Risk Factor ${unique}`,
    description: `Automation risk template description ${unique}`,
    updatedDescription: `Automation risk template description ${unique} Updated`,
  };
}