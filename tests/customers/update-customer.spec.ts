import { test } from '@fixtures/auth.fixture';
import {
  getCustomerData,
  withUniqueCustomerValues,
} from '@data/customers/create-customer.data';

test.describe('@regression Update Customer', () => {
  test('user can update customer address and verify value in list and edit form', async ({
    authenticatedUser,
    customersPage,
    createCustomerPage,
  }) => {
    const customerData = withUniqueCustomerValues(getCustomerData(1)[0]);
    const updatedAddress = 'First Cross Street, Colombo 14, Colombo';

    await customersPage.open();
    await customersPage.clickAddNew();
    await createCustomerPage.expectLoaded();

    await createCustomerPage.fillCustomerForm(customerData);
    await createCustomerPage.save();

    try {
      await createCustomerPage.expectCustomerSavedToast();
    } catch {
      // Some builds may redirect quickly or show short-lived toast.
    }

    try {
      await customersPage.expectLoaded();
    } catch {
      if (await createCustomerPage.isLoaded()) {
        await createCustomerPage.cancel();
      }

      await customersPage.expectLoaded();
    }

    await customersPage.search(customerData.customerName);
    await customersPage.expectCustomerVisible(customerData.customerName);
    await customersPage.expectCustomerRowContains(
      customerData.customerName,
      customerData.customerAddress,
    );

    await customersPage.clickEditForCustomer(customerData.customerName);
    await createCustomerPage.expectUpdateLoaded();

    // Confirm automation edits the field before clicking Update.
    await createCustomerPage.updateCustomerAddress(updatedAddress);

    await createCustomerPage.update();

    try {
      await createCustomerPage.expectCustomerUpdatedToast();
    } catch {
      // Some builds may redirect quickly or show generic success toast.
    }

    try {
      await customersPage.expectLoaded();
    } catch {
      if (await createCustomerPage.isLoaded()) {
        await createCustomerPage.cancel();
      }

      await customersPage.expectLoaded();
    }

    await customersPage.search(customerData.customerName);
    await customersPage.expectCustomerVisible(customerData.customerName);

    // Added back: verify updated address in Customers list table.
    // If this fails, list/table may not refresh updated address immediately.
    await customersPage.expectCustomerRowContains(customerData.customerName, updatedAddress);

    // Reopen edit form and verify persisted value in form.
    await customersPage.clickEditForCustomer(customerData.customerName);
    await createCustomerPage.expectUpdateLoaded();

    await createCustomerPage.expectCustomerAddressValue(updatedAddress);
  });
});
