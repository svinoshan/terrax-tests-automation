export type OperatorTestData = {
  name: string;
  fullAddress: string;
  country: string;
  street: string;
  city: string;
  postalCode: string;
  eoriNumber: string;
  contactEmail: string;
  phoneNumber: string;
  isActive: boolean;
};

export function createOperatorData(): OperatorTestData {
  const suffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(8, 17);

  return {
    name: `Operator E2E-${suffix}`,
    fullAddress: `Colombo, Sri Lanka E2E-${suffix}`,
    country: process.env.EUDR_OPERATOR_COUNTRY ?? 'Sri Lanka',
    street: `Street E2E-${suffix}`,
    city: process.env.EUDR_OPERATOR_CITY ?? 'Colombo 05',
    postalCode: '10650',
    eoriNumber: `EORI-E2E-${suffix}`,
    contactEmail: `operator.e2e.${suffix}@example.com`,
    phoneNumber: '0789876543',
    isActive: true,
  };
}
