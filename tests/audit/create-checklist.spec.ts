import { test } from '@fixtures/auth.fixture';
import { createCheckListData } from '@data/audit/checklist.data';

test.describe('@regression Create Check List', () => {
  test('CHECKLIST_CREATE_001 - user can create checklist and add control point', async ({
    authenticatedUser,
    checkListPage,
  }) => {
    void authenticatedUser;

    const checkListData = createCheckListData();

    await checkListPage.open();

    await checkListPage.createCheckList(checkListData.checkListName);

    await checkListPage.selectCheckList(checkListData.checkListName);

    await checkListPage.addControlPoint(checkListData);

    await checkListPage.expectControlPointVisible(checkListData.controlPoint);
  });
});
