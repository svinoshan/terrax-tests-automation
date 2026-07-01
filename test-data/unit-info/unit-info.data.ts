export type MainUnitTestData = {
  mainUnitCode: string;
  description: string;
};

export type SubUnitTestData = {
  mainUnitCode: string;
  mainUnitDescription: string;
  subUnitCode: string;
  description: string;
};

export function uniqueUnitSuffix(): string {
  return new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(8, 14);
}

export function createMainUnitData(): MainUnitTestData {
  const suffix = uniqueUnitSuffix();

  return {
    mainUnitCode: `F${suffix}`,
    description: `Estate Farm E2E-${suffix}`,
  };
}

export function createSubUnitData(mainUnit: MainUnitTestData): SubUnitTestData {
  const suffix = uniqueUnitSuffix();

  return {
    mainUnitCode: mainUnit.mainUnitCode,
    mainUnitDescription: mainUnit.description,
    subUnitCode: `G${suffix}`,
    description: `Estate Sub Unit E2E-${suffix}`,
  };
}
