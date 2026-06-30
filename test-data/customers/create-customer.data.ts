export type CustomerTestData = {
  testCaseId: string;
  customerName: string;
  customerAddress: string;
  customerTp: string;
  active: boolean;
};

export const customerTestData: CustomerTestData[] = [
  {
    testCaseId: 'CUSTOMER_001',
    customerName: 'John Doe',
    customerAddress: 'First Cross Street, Colombo 10',
    customerTp: '0789034567',
    active: true,
  },
  {
    testCaseId: 'CUSTOMER_002',
    customerName: 'Nimal Perera',
    customerAddress: 'Galle Road, Colombo 03',
    customerTp: '0771234567',
    active: true,
  },
];

export function getCustomerData(limit?: number): CustomerTestData[] {
  const envLimit = Number(process.env.TEST_DATA_LIMIT || 0);
  const resolvedLimit = limit || envLimit;

  if (!resolvedLimit) {
    return customerTestData;
  }

  return customerTestData.slice(0, resolvedLimit);
}

export function withUniqueCustomerValues(data: CustomerTestData): CustomerTestData {
  const uniqueSuffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(0, 14);

  const e2eSuffix = `E2E-${uniqueSuffix}`;

  return {
    ...data,
    customerName: `${data.customerName} ${e2eSuffix}`,
  };
}
