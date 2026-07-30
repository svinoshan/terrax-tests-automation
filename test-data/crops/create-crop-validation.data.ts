import { CropTestData } from "./create-crop.data";

export type CreateCropRequiredField =
  | "cropName"
  | "scientificName"
  | "productForm"
  | "description"
  | "purchaseUom"
  | "typeOfCrop"
  | "category"
  | "plantedUom"
  | "hsCode"
  | "expQtyPerYear"
  | "outTurn";

export type CreateCropValidationDataVariant =
  | "existingMotherCrop"
  | "defaultMotherCrop";

export type CreateCropValidationScenario = {
  testCaseId: string;
  scenario: string;
  missingField: CreateCropRequiredField;
  dataVariant?: CreateCropValidationDataVariant;
};

export const createCropValidationBaseData: CropTestData = {
  testCaseId: "CROP_VALIDATION_BASE",
  scenario:
    "Base data for Create Crop validation tests with existing mother crop",
  cropName: "White Pepper",
  scientificName: "Piper nigrum processed",
  productForm: "Finished goods",
  description: "White pepper crop validation test data",
  purchaseUom: "Kg",
  typeOfCrop: "Perennial",
  category: "Spice",
  plantedUom: "Vine",
  motherCrop: "Green Pepper",
  hsCode: "HS-WP-VALIDATION",
  outTurn: "70",
  active: true,
};

export const createCropDefaultMotherValidationBaseData: CropTestData = {
  testCaseId: "CROP_DEFAULT_MOTHER_VALIDATION_BASE",
  scenario:
    "Base data for Create Crop validation tests with default mother crop",
  cropName: "Primary Black Pepper",
  scientificName: "Piper nigrum",
  productForm: "Raw material",
  description: "Primary black pepper crop validation test data",
  purchaseUom: "Kg",
  typeOfCrop: "Annual",
  category: "Spice",
  plantedUom: "Vine",
  motherCrop: "Default",
  hsCode: "HS-PBP-VALIDATION",
  expQtyPerYear: "1000",
  active: true,
};

export const createCropValidationScenarios: CreateCropValidationScenario[] = [
  {
    testCaseId: "CROP_VAL_001",
    scenario: "Missing Crop name",
    missingField: "cropName",
  },
  {
    testCaseId: "CROP_VAL_002",
    scenario: "Missing Scientific name",
    missingField: "scientificName",
  },
  {
    testCaseId: "CROP_VAL_003",
    scenario: "Missing Product form",
    missingField: "productForm",
  },
  {
    testCaseId: "CROP_VAL_004",
    scenario: "Missing Description",
    missingField: "description",
  },
  {
    testCaseId: "CROP_VAL_005",
    scenario: "Missing Purchase UOM",
    missingField: "purchaseUom",
  },
  {
    testCaseId: "CROP_VAL_006",
    scenario: "Missing Type of crop",
    missingField: "typeOfCrop",
  },
  {
    testCaseId: "CROP_VAL_007",
    scenario: "Missing Category",
    missingField: "category",
  },
  {
    testCaseId: "CROP_VAL_008",
    scenario: "Missing Planted UOM",
    missingField: "plantedUom",
  },
  {
    testCaseId: "CROP_VAL_009",
    scenario: "Missing HS Code",
    missingField: "hsCode",
  },
  {
    testCaseId: "CROP_VAL_010",
    scenario: "Missing Exp qty per year when Mother Crop is Default",
    missingField: "expQtyPerYear",
    dataVariant: "defaultMotherCrop",
  },
  {
    testCaseId: "CROP_VAL_011",
    scenario: "Missing Out turn when Mother Crop is not Default",
    missingField: "outTurn",
    dataVariant: "existingMotherCrop",
  },
];
