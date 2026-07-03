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

export function createFarmerProfileData(): FarmerProfileTestData {
  const suffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(8, 14);

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
    supplierType: 'Farmer',
  };
}
