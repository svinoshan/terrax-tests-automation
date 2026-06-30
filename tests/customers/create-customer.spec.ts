import { test } from '@fixtures/auth.fixture';
import { getCustomerData } from '@data/customers/create-customer.data';

test.describe('@smoke Create Customer - safe tests', () => {
  test.beforeEach(async ({ authenticatedUser, customersPage, createCustomerPage }) => {
    await customersPage.open();
    await customersPage.clickAddNew();
    await createCustomerPage.expectLoaded();
  });

  test('create customer page opens and shows required fields', async ({ createCustomerPage }) => {
    await createCustomerPage.expectFormFieldsVisible();
    await createCustomerPage.expectButtonsVisible();
  });

  test('empty create customer form shows required validation', async ({ createCustomerPage }) => {
    await createCustomerPage.save();

    await createCustomerPage.expectLoaded();
    await createCustomerPage.expectRequiredControlsInvalid();
    await createCustomerPage.expectRequiredMessagesVisible();
  });

  test('back button returns to customers list', async ({ createCustomerPage, customersPage }) => {
    await createCustomerPage.back();

    await customersPage.expectLoaded();
  });

  test('customer form accepts text input', async ({ createCustomerPage }) => {
    const [customer] = getCustomerData(1);

    await createCustomerPage.fillCustomerForm(customer);

    await createCustomerPage.expectFormFieldsVisible();
  });
});
