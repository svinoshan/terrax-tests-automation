export type RiskAnalysisChecklistItem = {
  riskLevel: string;
  mitigationStrategy: string;
  remark: string;
  riskAfterMitigation: string;
};

export type RiskAnalysisTestData = {
  analysisDate: string;
  beforeOverallRisk: string;
  afterOverallRisk: string;
  checklist: RiskAnalysisChecklistItem[];
};

export function createRiskAnalysisData(): RiskAnalysisTestData {
  const today = new Date().toISOString().slice(0, 10);

  return {
    analysisDate: today,
    beforeOverallRisk: "Negligible risk",
    afterOverallRisk: "Non negligible risk",
    checklist: [
      {
        riskLevel: "Negligible Risk",
        mitigationStrategy: "Automation mitigation 01",
        remark: "Automation remark 01",
        riskAfterMitigation: "Negligible Risk",
      },
      {
        riskLevel: "Non Negligible Risk",
        mitigationStrategy: "Automation mitigation 02",
        remark: "Automation remark 02",
        riskAfterMitigation: "Non Negligible Risk",
      },
      {
        riskLevel: "N/A",
        mitigationStrategy: "Automation mitigation 03",
        remark: "Automation remark 03",
        riskAfterMitigation: "N/A",
      },
    ],
  };
}