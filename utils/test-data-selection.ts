export interface IdentifiedTestData {
  testCaseId: string;
}

export function selectTestData<T extends IdentifiedTestData>(
  records: T[],
  modulePrefix: string,
): T[] {
  const requestedIds = (process.env.TEST_CASE_IDS || '')
    .split(',')
    .map(value => value.trim())
    .filter(Boolean);

  let selected: T[];
  if (requestedIds.length > 0) {
    const moduleIds = requestedIds.filter(id => id.startsWith(modulePrefix));
    selected = records.filter(record => moduleIds.includes(record.testCaseId));

    const missing = moduleIds.filter(id => !records.some(record => record.testCaseId === id));
    if (missing.length > 0) throw new Error(`Unknown ${modulePrefix} test case ID(s): ${missing.join(', ')}`);
  } else {
    const offset = parseNonNegativeInteger('TEST_DATA_OFFSET', 0);
    const limit = parseNonNegativeInteger('TEST_DATA_LIMIT', 0);
    selected = limit > 0 ? records.slice(offset, offset + limit) : records.slice(offset);
  }

  console.log(`[${modulePrefix}] selected ${selected.length} record(s): ${selected.map(item => item.testCaseId).join(', ') || 'none'}`);
  return selected;
}

function parseNonNegativeInteger(name: string, fallback: number): number {
  const raw = process.env[name];
  if (!raw) return fallback;
  const parsed = Number(raw);
  if (!Number.isInteger(parsed) || parsed < 0) throw new Error(`${name} must be a non-negative integer; received "${raw}"`);
  return parsed;
}
