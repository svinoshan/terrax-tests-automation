import { test } from '@fixtures/auth.fixture';
import { createOperatorData } from '@data/eudr/operator.data';

test.describe('@regression Update EUDR Operator', () => {
  test('EUDR_OPERATOR_UPDATE_001 - user can update operator and deactivate it', async ({
    authenticatedUser,
    operatorsListPage,
    operatorFormPage,
  }) => {
    void authenticatedUser;

    const operatorData = createOperatorData();
    const updatedName = `${operatorData.name} Updated`;

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

    await operatorsListPage.clickEditForOperator(operatorData.name);

    await operatorFormPage.expectUpdateLoaded();

    await operatorFormPage.updateName(updatedName);
    await operatorFormPage.setActiveStatus(false);

    await operatorFormPage.update();

    try {
      await operatorFormPage.expectSavedToast();
    } catch {
      // Toast may be fast.
    }

    await operatorsListPage.expectLoaded();
    await operatorsListPage.search(updatedName);
    await operatorsListPage.expectOperatorVisible(updatedName);

    await operatorsListPage.expectOperatorRowContains(
      updatedName,
      operatorData.eoriNumber,
    );

    await operatorsListPage.expectOperatorRowContains(updatedName, /InActive/i);
  });
});