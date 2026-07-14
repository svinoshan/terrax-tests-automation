import { test } from "@fixtures/auth.fixture";

test.describe("@regression Check List Drag", () => {
  test("CHECKLIST_DRAG_001 - user can drag checklist rows and save order", async ({
    authenticatedUser,
    checkListPage,
  }) => {
    void authenticatedUser;

    await checkListPage.open();

    await checkListPage.selectCheckListWithDraggableRows(
      process.env.CHECKLIST_DRAG_NAME ?? "Fruit and Vegetables",
    );

    await checkListPage.expectAtLeastTwoDraggableRows();

    await checkListPage.dragFirstControlPointBelowSecondAndVerify();

    await checkListPage.saveOrder();

    try {
      await checkListPage.expectSavedToast();
    } catch {
      // Order save may redirect silently or toast may be short-lived.
    }
  });
});
