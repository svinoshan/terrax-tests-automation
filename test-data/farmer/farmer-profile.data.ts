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

export const supplierTypeOptions = ['Farmer', 'Collector', 'Supplier'] as const;
export const riskStatusOptions = ['Normal', 'Marginal', 'High'] as const;

export function randomItem<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function uniqueFarmerSuffix(): string {
  return new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(8, 14);
}

export function createFarmerProfileData(): FarmerProfileTestData {
  const suffix = uniqueFarmerSuffix();

  return {
    nameWithInitials: `K.M. Silva E2E-${suffix}`,
    fullName: `Kamal Malinda Silva E2E-${suffix}`,
    fixedPhone: '0252772246',
    mobilePhone: '0712458591',
    nic: `728078${suffix.slice(-3)}V`,
    address: `No. 9, Temple Road, Mihintale E2E-${suffix}`,
    country: 'Sri Lanka',
    city: 'Anuradhapura',
    fieldOfficer: 'cdenuwan@controlunion.com',
    gender: 'Male',
    contactPerson: 'A. Perera',
    contactPersonPhone: '0702571945',
    supplierType: randomItem(supplierTypeOptions),
  };
}

export function createFarmerOrganizationalData(): FarmerOrganizationalTestData {
  const suffix = uniqueFarmerSuffix();

  return {
    applicationDate: '2026-06-01',
    mainUnit: 'F1307',
    subUnit: 'G0001',
    farmerCodeEUJAS: `FRM-E2E-${suffix}`,
    farmerCodeNOP: `NOP-E2E-${suffix}`,
    cbRefNo: `CB-E2E-${suffix}`,
    remark: `Automation remark E2E-${suffix}`,
    riskStatus: randomItem(riskStatusOptions),
  };
}
