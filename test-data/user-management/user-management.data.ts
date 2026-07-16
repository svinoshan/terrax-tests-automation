export type UserManagementTestData = {
  fullName: string;
  email: string;
  telephone: string;
  address: string;
  password: string;
};

export function createUserManagementData(): UserManagementTestData {
  const suffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(8, 17);

  return {
    fullName: `User E2E-${suffix}`,
    email: `user.e2e.${suffix}@example.com`,
    telephone: '0771234567',
    address: `E2E Address ${suffix}`,
    password: 'UserE2E@12345',
  };
}
