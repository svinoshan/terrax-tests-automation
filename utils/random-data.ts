export function uniqueId(prefix = 'AUTO'): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
}

export function randomEmail(prefix = 'auto'): string {
  return `${prefix}.${Date.now()}@example.com`;
}

export function randomPhone(): string {
  return `07${Math.floor(10000000 + Math.random() * 89999999)}`;
}
