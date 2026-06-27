export type EnvironmentName = 'dev' | 'qa' | 'staging' | 'prod';

export const environments: Record<EnvironmentName, { baseURL: string }> = {
  dev: {
    baseURL: process.env.BASE_URL || 'http://20.6.73.65',
  },
  qa: {
    baseURL: process.env.BASE_URL || 'http://20.6.73.65',
  },
  staging: {
    baseURL: process.env.BASE_URL || 'http://20.6.73.65',
  },
  prod: {
    baseURL: process.env.BASE_URL || 'http://20.6.73.65',
  },
};

export function getEnvironment(): { baseURL: string } {
  const environmentName = (process.env.TEST_ENV || 'dev') as EnvironmentName;
  return environments[environmentName] || environments.dev;
}
