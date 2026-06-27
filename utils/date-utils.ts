export function todayIsoDate(): string {
  return new Date().toISOString().split('T')[0];
}

export function timestamp(): string {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
