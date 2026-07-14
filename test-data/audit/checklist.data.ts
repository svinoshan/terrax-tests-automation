export type CheckListTestData = {
  checkListName: string;
  updatedCheckListName: string;
  cpNo: string;
  controlPoint: string;
  level: 'Header' | 'Major' | 'Minor' | 'Recommended';
  isNa: boolean;
};

export function createCheckListData(): CheckListTestData {
  const suffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(8, 17);

  return {
    checkListName: `Checklist E2E-${suffix}`,
    updatedCheckListName: `Checklist E2E-${suffix} Updated`,
    cpNo: '1.0',
    controlPoint: `Control point E2E-${suffix}`,
    level: 'Major',
    isNa: false,
  };
}
