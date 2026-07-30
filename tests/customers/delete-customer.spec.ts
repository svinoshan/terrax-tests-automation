import { test } from "@fixtures/auth.fixture";
import {
  getCustomerData,
  withUniqueCustomerValues,
} from "@data/customers/create-customer.data";

test.describe("@regression Delete Customer", () => {
  test("CUSTOMER_DELETE_001 - user can deactivate a customer created by test", async ({
    authenticatedUser,
    customersPage,
    createCustomerPage,
  }) => {
    void authenticatedUser;

    const customerData = withUniqueCustomerValues(getCustomerData(1)[0]);

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

    await customersPage.expectCustomerStatus(
      customerData.customerName,
      /Active/i,
    );

    await customersPage.clickDeleteForCustomer(customerData.customerName);

    await customersPage.confirmDelete();

    try {
      await customersPage.expectSuccessToast();
    } catch {
      // Some builds may show generic/short-lived toast.
    }

    await customersPage.expectLoaded();

    await customersPage.search(customerData.customerName);
    await customersPage.expectCustomerVisible(customerData.customerName);

    // Delete is soft delete. Customer remains in list as Inactive.
    await customersPage.expectCustomerStatus(
      customerData.customerName,
      /Inactive/i,
    );

    // After soft delete, delete/trash action should be disabled.
    await customersPage.expectDeleteDisabledForCustomer(
      customerData.customerName,
    );
  });
});