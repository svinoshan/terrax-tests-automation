import { test } from "@fixtures/auth.fixture";
import { createOperatorData } from "@data/eudr/operator.data";
import { OperatorRequiredField } from "@pages/eudr/OperatorFormPage";

const validationScenarios: {
  testCaseId: string;
  scenario: string;
  missingField: OperatorRequiredField;
}[] = [
  {
    testCaseId: "EUDR_OPERATOR_VAL_001",
    scenario: "Missing Name",
    missingField: "name",
  },
  {
    testCaseId: "EUDR_OPERATOR_VAL_002",
    scenario: "Missing Full address",
    missingField: "fullAddress",
  },
  {
    testCaseId: "EUDR_OPERATOR_VAL_003",
    scenario: "Missing Country",
    missingField: "country",
  },
  {
    testCaseId: "EUDR_OPERATOR_VAL_004",
    scenario: "Missing Street",
    missingField: "street",
  },
  {
    testCaseId: "EUDR_OPERATOR_VAL_005",
    scenario: "Missing City",
    missingField: "city",
  },
  {
    testCaseId: "EUDR_OPERATOR_VAL_006",
    scenario: "Missing Postal code",
    missingField: "postalCode",
  },
  {
    testCaseId: "EUDR_OPERATOR_VAL_007",
    scenario: "Missing EORI Number",
    missingField: "eoriNumber",
  },
  {
    testCaseId: "EUDR_OPERATOR_VAL_008",
    scenario: "Missing Contact email",
    missingField: "contactEmail",
  },
  {
    testCaseId: "EUDR_OPERATOR_VAL_009",
    scenario: "Missing Phone number",
    missingField: "phoneNumber",
  },
];

test.describe("@validation EUDR Operator", () => {
  for (const scenario of validationScenarios) {
    test(`${scenario.testCaseId} - ${scenario.scenario}`, async ({
      authenticatedUser,
      operatorsListPage,
      operatorFormPage,
    }) => {
      void authenticatedUser;

      test.fail(
        ["street", "city", "postalCode", "phoneNumber"].includes(
          scenario.missingField,
        ),
        "BUG/Clarification: Field is visually marked required, but no inline validation message appears.",
      );

      const operatorData = createOperatorData();

      await operatorsListPage.open();
      await operatorsListPage.clickAddNew();

      await operatorFormPage.expectCreateLoaded();

      await operatorFormPage.fillFormExcept(operatorData, [
        scenario.missingField,
      ]);

      await operatorFormPage.clickSaveExpectValidation();

      await operatorFormPage.expectValidationMessage(scenario.missingField);
    });
  }
});
