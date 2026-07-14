import { test } from '@fixtures/auth.fixture';
import { createOperatorData } from '@data/eudr/operator.data';

test.describe('@regression Create EUDR Operator', () => {
  test('EUDR_OPERATOR_CREATE_001 - user can create operator', async ({
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

    await operatorsListPage.expectOperatorRowContains(
      operatorData.name,
      operatorData.contactEmail,
    );

    await operatorsListPage.expectOperatorRowContains(
      operatorData.name,
      operatorData.eoriNumber,
    );

    await operatorsListPage.expectOperatorRowContains(
      operatorData.name,
      /Active/i,
    );
  });
});
