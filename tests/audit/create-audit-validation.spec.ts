import { test } from "@fixtures/auth.fixture";
import { createAuditData } from "@data/audit/audit.data";
import { AuditRequiredField } from "@pages/audit/CreateAuditPage";

const auditValidationScenarios: {
  testCaseId: string;
  scenario: string;
  missingField: AuditRequiredField;
}[] = [
  {
    testCaseId: "AUDIT_VAL_001",
    scenario: "Missing Field officer",
    missingField: "fieldOfficer",
  },
  {
    testCaseId: "AUDIT_VAL_002",
    scenario: "Missing Plan date",
    missingField: "planDate",
  },
  {
    testCaseId: "AUDIT_VAL_003",
    scenario: "Missing Audit number",
    missingField: "auditNumber",
  },
  {
    testCaseId: "AUDIT_VAL_004",
    scenario: "Missing selected farmer rows",
    missingField: "farmerRows",
  },
];

test.describe("@validation Create Audit", () => {
  for (const scenario of auditValidationScenarios) {
    test(`${scenario.testCaseId} - ${scenario.scenario}`, async ({
      authenticatedUser,
      auditListPage,
      createAuditPage,
    }) => {
      void authenticatedUser;

      test.fail(
        scenario.missingField === "farmerRows",
        "BUG/Clarification: Audit can be saved without selected farmer rows. Confirm whether farmer row selection is mandatory.",
      );

      const auditData = createAuditData();

      await auditListPage.open();
      await auditListPage.clickAddNew();

      await createAuditPage.expectLoaded();

      await createAuditPage.fillFormExcept(auditData, [scenario.missingField]);

      await createAuditPage.clickSaveExpectValidation();

      await createAuditPage.expectValidationMessage(scenario.missingField);
    });
  }
});
