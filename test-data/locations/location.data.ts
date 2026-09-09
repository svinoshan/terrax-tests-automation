import records from './location-data.json';
import negativeRecords from './location-negative-data.json';
import { selectTestData } from '@utils/test-data-selection';

export type LocationType = 'FACTORY' | 'WAREHOUSE' | 'COLLECTION_CENTER' | 'DRYING_CENTER' | 'PROCESSING_CENTER';

export interface LocationFormData {
  facilityName: string;
  locationType: LocationType | null;
  phoneNumber: string;
  address: string;
  coordinates?: string;
  status: boolean | null;
  updates?: Partial<LocationFormData>;
}

export interface LocationTestData extends LocationFormData { testCaseId: string; }

export interface NegativeLocationTestData {
  testCaseId: string;
  scenario: string;
  expectedSource: 'inline' | 'control-invalid' | 'validation-dialog' | 'error-dialog';
  expectedMessage?: string;
  expectedMessagePattern?: string;
  expectedField: string;
  data: LocationFormData;
}

export function getLocationData(): LocationTestData[] {
  return selectTestData(records as LocationTestData[], 'LOCATION_');
}

export const locationNegativeData = negativeRecords as NegativeLocationTestData[];
