import { test } from '@fixtures/auth.fixture';
import {
  createFarmerOrganizationalData,
  createFarmerProfileData,
} from '@data/farmer/farmer-profile.data';
import {
  FarmerCommonRequiredField,
  FarmerOrganizationalRequiredField,
} from '@pages/farmer/FarmerProfilePage';

const commonValidationScenarios: {
  testCaseId: string;
  scenario: string;
  missingField: FarmerCommonRequiredField;
}[] = [
  {
    testCaseId: 'FARMER_VAL_001',
    scenario: 'Missing Name with initials',
    missingField: 'nameWithInitials',
  },
  {
    testCaseId: 'FARMER_VAL_002',
    scenario: 'Missing Full name',
    missingField: 'fullName',
  },
  {
    testCaseId: 'FARMER_VAL_003',
    scenario: 'Missing Address',
    missingField: 'address',
  },
  {
    testCaseId: 'FARMER_VAL_004',
    scenario: 'Missing Country',
    missingField: 'country',
  },
  {
    testCaseId: 'FARMER_VAL_005',
    scenario: 'Missing City',
    missingField: 'city',
  },
  {
    testCaseId: 'FARMER_VAL_006',
    scenario: 'Missing Field officer',
    missingField: 'fieldOfficer',
  },
  {
    testCaseId: 'FARMER_VAL_007',
    scenario: 'Missing Supplier type',
    missingField: 'supplierType',
  },
];

const organizationalValidationScenarios: {
  testCaseId: string;
  scenario: string;
  missingField: FarmerOrganizationalRequiredField;
}[] = [
  {
    testCaseId: 'FARMER_VAL_008',
    scenario: 'Missing Main unit',
    missingField: 'mainUnit',
  },
  {
    testCaseId: 'FARMER_VAL_009',
    scenario: 'Missing Sub unit',
    missingField: 'subUnit',
  },
  {
    testCaseId: 'FARMER_VAL_010',
    scenario: 'Missing Farmer code',
    missingField: 'farmerCodeEUJAS',
  },
  {
    testCaseId: 'FARMER_VAL_011',
    scenario: 'Missing Risk status',
    missingField: 'riskStatus',
  },
];

test.describe('@validation Farmer Profile - required fields', () => {
  test.beforeEach(async ({ authenticatedUser, farmerListPage, farmerProfilePage }) => {
    await farmerListPage.open();
    await farmerListPage.clickAddFarmer();
    await farmerProfilePage.expectLoaded();
  });

  for (const scenario of commonValidationScenarios) {
    test(`${scenario.testCaseId} - ${scenario.scenario}`, async ({ farmerProfilePage }) => {
      const profileData = createFarmerProfileData();
      const orgData = createFarmerOrganizationalData();

      await farmerProfilePage.fillCommonInfoExcept(profileData, [scenario.missingField]);
      await farmerProfilePage.fillOrganizationalInfo(orgData);

      await farmerProfilePage.save();

      await farmerProfilePage.expectLoaded();
      await farmerProfilePage.expectCommonFieldInvalid(scenario.missingField);
    });
  }

  for (const scenario of organizationalValidationScenarios) {
    test(`${scenario.testCaseId} - ${scenario.scenario}`, async ({ farmerProfilePage }) => {
      const profileData = createFarmerProfileData();
      const orgData = createFarmerOrganizationalData();

      await farmerProfilePage.fillCommonInfo(profileData);
      await farmerProfilePage.fillOrganizationalInfoExcept(orgData, [scenario.missingField]);

      await farmerProfilePage.save();

      await farmerProfilePage.expectLoaded();
      await farmerProfilePage.expectOrganizationalFieldInvalid(scenario.missingField);
    });
  }
});
