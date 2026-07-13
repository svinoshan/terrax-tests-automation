import { test } from "@fixtures/auth.fixture";

test.describe("@smoke Audit", () => {
  test("audit list opens and shows expected columns", async ({
    authenticatedUser,
    auditListPage,
  }) => {
    void authenticatedUser;

    await auditListPage.open();
    await auditListPage.expectLoaded();
  });

  test("add new opens create audit form", async ({
    authenticatedUser,
    auditListPage,
    createAuditPage,
  }) => {
    void authenticatedUser;

    await auditListPage.open();
    await auditListPage.clickAddNew();

    await createAuditPage.expectLoaded();
  });
});
