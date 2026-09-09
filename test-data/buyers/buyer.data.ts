import records from './buyer-data.json';
import negativeRecords from './buyer-negative-data.json';
import { LocationFormData } from '@data/locations/location.data';
import { selectTestData } from '@utils/test-data-selection';

export interface BuyerTestData {
  testCaseId: string;
  name: string;
  address: string;
  phoneNo: string;
  status: boolean | null;
  locations: LocationFormData[];
  updates?: {
    address?: string;
    phoneNo?: string;
    status?: boolean;
    location?: Partial<LocationFormData>;
  };
}

export interface NegativeBuyerTestData {
  testCaseId: string;
  scenario: string;
  expectedSource: 'inline' | 'control-invalid' | 'validation-dialog' | 'error-dialog';
  expectedMessage?: string;
  expectedMessagePattern?: string;
  expectedField: string;
  data: BuyerTestData;
}

export function getBuyerData(): BuyerTestData[] {
  return selectTestData(records as BuyerTestData[], 'BUYER_');
}

export const buyerNegativeData = negativeRecords as NegativeBuyerTestData[];
