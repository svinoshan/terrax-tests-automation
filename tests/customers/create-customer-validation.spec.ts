import { test } from '@fixtures/auth.fixture';
import {
  getCustomerData,
  withUniqueCustomerValues,
} from '@data/customers/create-customer.data';
import { CustomerRequiredField } from '@pages/customers/CreateCustomerPage';

const validationScenarios: { testCaseId: string; scenario: string; missingField: CustomerRequiredField }[] = [
  {
    testCaseId: 'CUSTOMER_VAL_001',
    scenario: 'Missing customer name',
    missingField: 'customerName',
  },
  {
    testCaseId: 'CUSTOMER_VAL_002',
    scenario: 'Missing customer address',
    missingField: 'customerAddress',
  },
];

test.describe('@validation Create Customer - required fields', () => {
  test.beforeEach(async ({ authenticatedUser, customersPage, createCustomerPage }) => {
    await customersPage.open();
    await customersPage.clickAddNew();
    await createCustomerPage.expectLoaded();
  });

  test('empty form cannot be submitted', async ({ createCustomerPage }) => {
    await createCustomerPage.save();

    await createCustomerPage.expectLoaded();
    await createCustomerPage.expectRequiredControlsInvalid();
    await createCustomerPage.expectRequiredMessagesVisible();
  });

  for (const scenario of validationScenarios) {
    test(`${scenario.testCaseId} - ${scenario.scenario}`, async ({ createCustomerPage }) => {
      const customerData = withUniqueCustomerValues(getCustomerData(1)[0]);

      await createCustomerPage.fillCustomerFormExcept(customerData, [scenario.missingField]);
      await createCustomerPage.save();

      await createCustomerPage.expectLoaded();
      await createCustomerPage.expectFieldInvalid(scenario.missingField);
    });
  }
});
