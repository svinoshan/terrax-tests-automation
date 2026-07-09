export type FarmerProfileTestData = {
  nameWithInitials: string;
  fullName: string;
  fixedPhone: string;
  mobilePhone: string;
  nic: string;
  address: string;
  country: string;
  city: string;
  fieldOfficer: string;
  gender: string;
  contactPerson: string;
  contactPersonPhone: string;
  supplierType: string;
};

export type FarmerOrganizationalTestData = {
  applicationDate: string;
  mainUnit: string;
  subUnit: string;
  farmerCodeEUJAS: string;
  farmerCodeNOP: string;
  cbRefNo: string;
  remark: string;
  riskStatus: string;
};

export type FarmerLandTestData = {
  plotType: string;
  plotCode: string;
  landName: string;
  landExtend: string;
  purchaseStatus: string;
  certifications: string[];
  landDocsAvailable: string;
  landDocumentation: string;
  refNumber: string;
  extraEvidence: string;
};

export type FarmerCropTestData = {
  plotCode: string;
  cropName: string;
  noOfPlants: string;
};

export type FarmerEuNopJasTestData = {
  plotCode: string;
  startDateOrg: string;
  startDateConv: string;
  fieldStatusEujas: string;
  fieldStatusNop: string;
  fertilizerTypeUsed: string;
  harvestStatusEujas: string;
  harvestStatusNop: string;
  lastDateUse: string;
};

export type FarmerDossierTestData = {
  plotCode: string;
  documentName: string;
  filePath: string;
};

export const supplierTypeOptions = ["Farmer", "Collector", "Supplier"] as const;
export const riskStatusOptions = ["Normal", "Marginal", "High"] as const;

export function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

// export function uniqueFarmerSuffix(): string {
//   return new Date()
//     .toISOString()
//     .replace(/[-:.TZ]/g, "")
//     .slice(8, 14);
// }

export function uniqueFarmerSuffix(): string {
  const timestamp = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(8, 17);

  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0");

  return `${timestamp}${random}`;
}

export function createFarmerProfileData(): FarmerProfileTestData {
  const suffix = uniqueFarmerSuffix();

  return {
    nameWithInitials: `K.M. Silva E2E-${suffix}`,
    fullName: `Kamal Malinda Silva E2E-${suffix}`,
    fixedPhone: "0252772246",
    mobilePhone: "0712458591",
    //nic: `728078${suffix.slice(-3)}V`,
    nic: `9${Date.now().toString().slice(-8)}V`,
    address: `No. 9, Temple Road, Mihintale E2E-${suffix}`,
    country: "Sri Lanka",
    city: "Anuradhapura",
    fieldOfficer: "cdenuwan@controlunion.com",
    gender: "Male",
    contactPerson: "A. Perera",
    contactPersonPhone: "0702571945",
    supplierType: randomItem(supplierTypeOptions),
  };
}

export function createFarmerOrganizationalData(): FarmerOrganizationalTestData {
  const suffix = uniqueFarmerSuffix();

  return {
    applicationDate: "2026-06-01",
    mainUnit: "F1307",
    subUnit: "G0001",
    farmerCodeEUJAS: `FRM-E2E-${suffix}`,
    farmerCodeNOP: `NOP-E2E-${suffix}`,
    cbRefNo: `CB-E2E-${suffix}`,
    remark: `Automation remark E2E-${suffix}`,
    riskStatus: randomItem(riskStatusOptions),
  };
}

export function createFarmerLandData(): FarmerLandTestData {
  const suffix = uniqueFarmerSuffix();

  return {
    plotType: "Main Plot",
    plotCode: "A",
    landName: `Farm Block E2E-${suffix}`,
    landExtend: "2.55",
    purchaseStatus: "Active",
    certifications: ["EU - EU Organic Certification", "FT - Fairtrade"],
    landDocsAvailable: "Yes",
    landDocumentation: "Land ownership",
    refNumber: `DEED-E2E-${suffix}`,
    extraEvidence: `Automation evidence E2E-${suffix}`,
  };
}

export function createFarmerCropData(plotCode = "A"): FarmerCropTestData {
  return {
    plotCode,
    cropName: "Banana",
    noOfPlants: "50",
  };
}

export function createFarmerEuNopJasData(
  plotCode = "A",
): FarmerEuNopJasTestData {
  return {
    plotCode,
    startDateOrg: "2026-06-02",
    startDateConv: "2026-06-02",
    fieldStatusEujas: "IC1",
    fieldStatusNop: "ORG",
    fertilizerTypeUsed: "Organic liquid fertilizer",
    harvestStatusEujas: "ORG",
    harvestStatusNop: "CONV",
    lastDateUse: "2026-06-25",
  };
}

export function createFarmerDossierData(plotCode = "A"): FarmerDossierTestData {
  const suffix = uniqueFarmerSuffix();

  return {
    plotCode,
    documentName: `Land Certificate E2E-${suffix}`,
    filePath: "test-data/files/dummy_land_certificate_10_pages.pdf",
  };
}
