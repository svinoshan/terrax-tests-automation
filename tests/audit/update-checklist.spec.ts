import { test } from '@fixtures/auth.fixture';
import { createCheckListData } from '@data/audit/checklist.data';

test.describe('@regression Update Check List', () => {
  test('CHECKLIST_UPDATE_001 - user can update checklist control point', async ({
    authenticatedUser,
    checkListPage,
  }) => {
    void authenticatedUser;

    const checkListData = createCheckListData();

    const updatedControlPoint = `${checkListData.controlPoint} Updated`;

    await checkListPage.open();

    await checkListPage.createCheckList(checkListData.checkListName);

    await checkListPage.selectCheckList(checkListData.checkListName);

    await checkListPage.addControlPoint(checkListData);

    await checkListPage.expectControlPointVisible(
      checkListData.controlPoint,
    );

    await checkListPage.updateControlPoint({
      originalControlPoint: checkListData.controlPoint,
      updatedControlPoint,
      updatedLevel: 'Minor',
      isNa: true,
    });

    await checkListPage.expectControlPointVisible(updatedControlPoint);

    await checkListPage.expectControlPointRowContains(
      updatedControlPoint,
      /Minor/i,
    );
  });
});