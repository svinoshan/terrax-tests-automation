export function getEnv(name: string, fallback = ''): string {
  return process.env[name] || fallback;
}

export function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
