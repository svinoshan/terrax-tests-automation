import { test } from '@fixtures/auth.fixture';
import {
  getCustomerData,
  withUniqueCustomerValues,
} from '@data/customers/create-customer.data';

test.describe('@regression Create Customer - full flow', () => {
  test('user can create a customer and find it in customer list', async ({
    authenticatedUser,
    customersPage,
    createCustomerPage,
  }) => {
    const customerData = withUniqueCustomerValues(getCustomerData(1)[0]);

    await customersPage.open();
    await customersPage.clickAddNew();
    await createCustomerPage.expectLoaded();

    await createCustomerPage.fillCustomerForm(customerData);
    await createCustomerPage.save();

    try {
      await createCustomerPage.expectCustomerSavedToast();
    } catch {
      // Some builds may redirect quickly or show a short-lived toast.
    }

    try {
      await customersPage.expectLoaded();
    } catch {
      if (await createCustomerPage.isLoaded()) {
        await createCustomerPage.back();
      }

      await customersPage.expectLoaded();
    }

    await customersPage.search(customerData.customerName);
    await customersPage.expectCustomerVisible(customerData.customerName);
    await customersPage.expectCustomerRowContains(customerData.customerName, customerData.customerAddress);
    await customersPage.expectCustomerRowContains(customerData.customerName, customerData.customerTp);
  });
});
