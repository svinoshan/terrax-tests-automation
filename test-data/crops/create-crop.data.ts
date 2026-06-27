export type CropTestData = {
  testCaseId: string;
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
  active: boolean;
};

export const cropTestData: CropTestData[] = [
  {
    testCaseId: 'CROP_001',
    cropName: 'Black Pepper',
    scientificName: 'Piper nigrum',
    productForm: 'RAW material',
    description: 'Black pepper crop test data',
    purchaseUom: 'Kg',
    typeOfCrop: 'Annual',
    category: 'Spice',
    plantedUom: 'Vine',
    motherCrop: 'Default',
    hsCode: 'HS-BP',
    active: true,
  },
  {
    testCaseId: 'CROP_002',
    cropName: 'White Pepper',
    scientificName: 'Piper nigrum processed',
    productForm: 'Finished goods',
    description: 'White pepper crop test data',
    purchaseUom: 'Kg',
    typeOfCrop: 'Perennial',
    category: 'Spice',
    plantedUom: 'Vine',
    motherCrop: 'Black Pepper',
    hsCode: 'HS-WP',
    active: true,
  },
  {
    testCaseId: 'CROP_003',
    cropName: 'Green Pepper',
    scientificName: 'Piper nigrum green',
    productForm: 'RAW material',
    description: 'Green pepper crop test data',
    purchaseUom: 'Kg',
    typeOfCrop: 'Annual',
    category: 'Spice',
    plantedUom: 'Vine',
    motherCrop: 'Default',
    hsCode: 'HS-GP',
    active: true,
  },
  {
    testCaseId: 'CROP_004',
    cropName: 'Cinnamon',
    scientificName: 'Cinnamomum verum',
    productForm: 'RAW material',
    description: 'Cinnamon crop test data',
    purchaseUom: 'Kg',
    typeOfCrop: 'Perennial',
    category: 'Spice',
    plantedUom: 'Tree',
    motherCrop: 'Default',
    hsCode: 'HS-CIN',
    active: true,
  },
  {
    testCaseId: 'CROP_005',
    cropName: 'Cardamom',
    scientificName: 'Elettaria cardamomum',
    productForm: 'RAW material',
    description: 'Cardamom crop test data',
    purchaseUom: 'Kg',
    typeOfCrop: 'Perennial',
    category: 'Spice',
    plantedUom: 'Tree',
    motherCrop: 'Default',
    hsCode: 'HS-CAR',
    active: true,
  }
];

export function getCropData(limit?: number): CropTestData[] {
  const envLimit = Number(process.env.TEST_DATA_LIMIT || 0);
  const resolvedLimit = limit || envLimit;

  if (!resolvedLimit) {
    return cropTestData;
  }

  return cropTestData.slice(0, resolvedLimit);
}

export function withUniqueCropValues(data: CropTestData): CropTestData {
  const uniqueSuffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14);

  return {
    ...data,
    cropName: `${data.cropName} ${uniqueSuffix}`,
    hsCode: `${data.hsCode}-${uniqueSuffix}`,
  };
}

// export function withUniqueCropValues(data: CropTestData): CropTestData {
//   const uniqueSuffix = new Date()
//     .toISOString()
//     .replace(/[-:.TZ]/g, '')
//     .slice(0, 14);

//   const e2eSuffix = `E2E-${uniqueSuffix}`;

//   return {
//     ...data,
//     cropName: `${data.cropName} ${e2eSuffix}`,
//     hsCode: `${data.hsCode}-${e2eSuffix}`,
//   };
// }