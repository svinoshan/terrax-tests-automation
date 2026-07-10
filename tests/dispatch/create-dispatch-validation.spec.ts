import { test } from "@fixtures/auth.fixture";
import { createDispatchData } from "@data/dispatch/dispatch.data";
import { DispatchHeaderRequiredField } from "@pages/dispatch/CreateDispatchPage";

const headerValidationScenarios: {
  testCaseId: string;
  scenario: string;
  missingField: DispatchHeaderRequiredField;
}[] = [
  {
    testCaseId: "DISPATCH_VAL_001",
    scenario: "Missing Dispatch to",
    missingField: "dispatchTo",
  },
  {
    testCaseId: "DISPATCH_VAL_002",
    scenario: "Missing Dispatch date",
    missingField: "dispatchDate",
  },
  {
    testCaseId: "DISPATCH_VAL_003",
    scenario: "Missing Vehicle no",
    missingField: "vehicleNo",
  },
  {
    testCaseId: "DISPATCH_VAL_004",
    scenario: "Missing Dispatch by",
    missingField: "dispatchBy",
  },
];

test.describe("@validation Create Dispatch", () => {
  for (const scenario of headerValidationScenarios) {
    test(`${scenario.testCaseId} - ${scenario.scenario}`, async ({
      authenticatedUser,
      dispatchListPage,
      createDispatchPage,
    }) => {
      void authenticatedUser;

      test.fail(
        scenario.missingField === "dispatchDate",
        'BUG: Missing Dispatch date shows generic "Something went wrong" dialog instead of field validation.',
      );

      const dispatchData = createDispatchData();

      await dispatchListPage.open();
      await dispatchListPage.clickAddNew();

      await createDispatchPage.expectLoaded();

      await createDispatchPage.fillHeaderExcept(dispatchData, [
        scenario.missingField,
      ]);

      await createDispatchPage.clickSaveExpectValidation();

      await createDispatchPage.expectHeaderValidationMessage(
        scenario.missingField,
      );
    });
  }
});
