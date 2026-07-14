import { test } from '@fixtures/auth.fixture';

test.describe('@smoke EUDR Operators', () => {
  test('EUDR_OPERATORS_SMOKE_001 - Operators list opens and shows expected columns', async ({
    authenticatedUser,
    operatorsListPage,
  }) => {
    void authenticatedUser;

    await operatorsListPage.open();
    await operatorsListPage.expectLoaded();
  });

  test('EUDR_OPERATORS_SMOKE_002 - Add new opens Create operator form', async ({
    authenticatedUser,
    operatorsListPage,
    operatorFormPage,
  }) => {
    void authenticatedUser;

    await operatorsListPage.open();
    await operatorsListPage.clickAddNew();

    await operatorFormPage.expectCreateLoaded();
  });
});
