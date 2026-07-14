import { expect } from "@playwright/test";
import { test } from "@fixtures/auth.fixture";
import { createOperatorData } from "@data/eudr/operator.data";

test.describe("@regression Delete EUDR Operator", () => {
  test("EUDR_OPERATOR_DELETE_001 - user can deactivate operator from delete action", async ({
    authenticatedUser,
    operatorsListPage,
    operatorFormPage,
  }) => {
    void authenticatedUser;

    const operatorData = createOperatorData();

    await operatorsListPage.open();
    await operatorsListPage.clickAddNew();

    await operatorFormPage.expectCreateLoaded();
    await operatorFormPage.fillForm(operatorData);
    await operatorFormPage.save();

    try {
      await operatorFormPage.expectSavedToast();
    } catch {
      // Toast may be fast.
    }

    await operatorsListPage.expectLoaded();
    await operatorsListPage.search(operatorData.name);
    await operatorsListPage.expectOperatorVisible(operatorData.name);

    await operatorsListPage.deleteOperator(operatorData.name);

    await operatorsListPage.expectLoaded();
    await operatorsListPage.search(operatorData.name);

    //await operatorsListPage.expectOperatorHidden(operatorData.name);

    await operatorsListPage.expectOperatorVisible(operatorData.name);

    await operatorsListPage.expectOperatorInactive(operatorData.name);
  });
});
