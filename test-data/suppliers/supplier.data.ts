import records from './supplier-data.json';
import negativeRecords from './supplier-negative-data.json';
import { LocationFormData } from '@data/locations/location.data';
import { selectTestData } from '@utils/test-data-selection';

export interface SupplierTestData {
  testCaseId: string;
  supplierCode: string;
  supplierName: string;
  country: string | null;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  registrationNo: string;
  taxNo: string;
  description?: string;
  active: boolean | null;
  locations: LocationFormData[];
  updates?: {
    contactPerson?: string;
    phone?: string;
    email?: string;
    address?: string;
    description?: string;
    active?: boolean;
    location?: Partial<LocationFormData>;
  };
}

export interface NegativeSupplierTestData {
  testCaseId: string;
  scenario: string;
  expectedSource: 'inline' | 'control-invalid' | 'validation-dialog' | 'error-dialog';
  expectedMessage?: string;
  expectedMessagePattern?: string;
  expectedField: string;
  duplicateField?: keyof SupplierTestData;
  secondAttemptOverrides?: Partial<SupplierTestData>;
  data: SupplierTestData;
}

export function getSupplierData(): SupplierTestData[] {
  return selectTestData(records as SupplierTestData[], 'SUPPLIER_');
}

export const supplierNegativeData = negativeRecords as NegativeSupplierTestData[];
