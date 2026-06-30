export type CropExpectedStatus = 'pass' | 'known-bug';

export type CropTestData = {
  testCaseId: string;
  scenario: string;
  cropName: string;
  scientificName: string;
  productForm: string;
  description: string;
  purchaseUom: string;
  typeOfCrop: string;
  category: string;
  plantedUom: string;
  motherCrop: string;
  hsCode: string;
  outTurn?: string;
  active: boolean;
  expectedStatus: CropExpectedStatus;
  bugNote?: string;
};

export const cropTestData: CropTestData[] = [
  {
    testCaseId: 'CROP_001',
    scenario: 'Create crop with existing mother crop and out turn',
    cropName: 'White Pepper',
    scientificName: 'Piper nigrum processed',
    productForm: 'Finished goods',
    description: 'White pepper crop test data',
    purchaseUom: 'Kg',
    typeOfCrop: 'Perennial',
    category: 'Spice',
    plantedUom: 'Vine',
    motherCrop: 'Green Pepper',
    hsCode: 'HS-WP',
    outTurn: '70',
    active: true,
    expectedStatus: 'pass',
  },
  {
    testCaseId: 'CROP_002',
    scenario: 'Create crop with default mother crop and without out turn',
    cropName: 'Black Pepper',
    scientificName: 'Piper nigrum',
    productForm: 'Raw material',
    description: 'Black pepper crop test data',
    purchaseUom: 'Kg',
    typeOfCrop: 'Annual',
    category: 'Spice',
    plantedUom: 'Vine',
    motherCrop: 'Default',
    hsCode: 'HS-BP',
    active: true,
    expectedStatus: 'known-bug',
    bugNote: 'Application currently appears unable to save when Mother Crop is Default and Out turn is not filled/enabled.',
  },
];

export function getCropData(limit?: number): CropTestData[] {
  const envLimit = Number(process.env.TEST_DATA_LIMIT || 0);
  const resolvedLimit = limit || envLimit;

  if (!resolvedLimit) {
    return cropTestData;
  }

  return cropTestData.slice(0, resolvedLimit);
}

export function getCreatableCropData(limit?: number): CropTestData[] {
  const data = cropTestData.filter((crop) => crop.expectedStatus === 'pass');
  const envLimit = Number(process.env.TEST_DATA_LIMIT || 0);
  const resolvedLimit = limit || envLimit;

  if (!resolvedLimit) {
    return data;
  }

  return data.slice(0, resolvedLimit);
}

export function getKnownBugCropData(): CropTestData[] {
  return cropTestData.filter((crop) => crop.expectedStatus === 'known-bug');
}

export function withUniqueCropValues(data: CropTestData): CropTestData {
  const uniqueSuffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14);

  const e2eSuffix = `E2E-${uniqueSuffix}`;

  return {
    ...data,
    cropName: `${data.cropName} ${e2eSuffix}`,
    hsCode: `${data.hsCode}-${e2eSuffix}`,
  };
}
