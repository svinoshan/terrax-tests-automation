import { test } from '@fixtures/auth.fixture';
import { createPurchaseNoteData } from '@data/purchase/purchase.data';
import { purchaseValidationFarmer } from '@data/purchase/purchase-validation.data';
import {
  PurchaseHeaderRequiredField,
  PurchaseLineRequiredField,
} from '@pages/purchase/CreatePurchasePage';

test.setTimeout(120000);

const headerValidationScenarios: {
  testCaseId: string;
  scenario: string;
  missingField: PurchaseHeaderRequiredField;
}[] = [
  {
    testCaseId: 'PURCHASE_VAL_001',
    scenario: 'Missing Farmer',
    missingField: 'farmer',
  },
  {
    testCaseId: 'PURCHASE_VAL_002',
    scenario: 'Missing Purchasing officer',
    missingField: 'purchasingOfficer',
  },
  {
    testCaseId: 'PURCHASE_VAL_003',
    scenario: 'Missing Plot code',
    missingField: 'plotCode',
  },
  {
    testCaseId: 'PURCHASE_VAL_004',
    scenario: 'Missing Purchase date',
    missingField: 'purchaseDate',
  },
];

const lineValidationScenarios: {
  testCaseId: string;
  scenario: string;
  missingField: PurchaseLineRequiredField;
}[] = [
  {
    testCaseId: 'PURCHASE_VAL_005',
    scenario: 'Missing Item',
    missingField: 'item',
  },
  {
    testCaseId: 'PURCHASE_VAL_006',
    scenario: 'Missing Purchase qty',
    missingField: 'purchaseQty',
  },
  // {
  //   testCaseId: 'PURCHASE_VAL_007',
  //   scenario: 'Missing Unit price',
  //   missingField: 'unitPrice',
  // },
];

test.describe('@validation Create Purchase', () => {
  for (const scenario of headerValidationScenarios) {
    test(`${scenario.testCaseId} - ${scenario.scenario}`, async ({
      authenticatedUser,
      purchaseListPage,
      createPurchasePage,
    }) => {
      void authenticatedUser;

      const purchaseData = createPurchaseNoteData();

      await purchaseListPage.open();
      await purchaseListPage.clickAddNew();

      await createPurchasePage.expectLoaded();

      await createPurchasePage.fillHeaderExcept(
        purchaseValidationFarmer.farmerSearchText,
        purchaseValidationFarmer.plotCode,
        purchaseData,
        [scenario.missingField],
      );

      await createPurchasePage.clickSaveExpectValidation();
      await createPurchasePage.expectHeaderValidationMessage(
        scenario.missingField,
      );
    });
  }

  for (const scenario of lineValidationScenarios) {
    test(`${scenario.testCaseId} - ${scenario.scenario}`, async ({
      authenticatedUser,
      purchaseListPage,
      createPurchasePage,
    }) => {
      void authenticatedUser;

      const purchaseData = createPurchaseNoteData();

      await purchaseListPage.open();
      await purchaseListPage.clickAddNew();

      await createPurchasePage.expectLoaded();

      await createPurchasePage.fillHeader(
        purchaseValidationFarmer.farmerSearchText,
        purchaseValidationFarmer.plotCode,
        purchaseData,
      );

      await createPurchasePage.openAddLineDialogAfterValidHeader();

      await createPurchasePage.fillPurchaseLineExcept(
        purchaseData,
        [scenario.missingField],
      );

      await createPurchasePage.clickModalSaveExpectValidation();
      await createPurchasePage.expectLineValidationMessage(
        scenario.missingField,
      );
    });
  }
});