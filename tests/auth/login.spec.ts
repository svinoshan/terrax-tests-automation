import { test, expect } from "@fixtures/pages.fixture";
import { requiredEnv } from "@utils/env";

test("@smoke valid user can login and view dashboard", async ({
  loginPage,
  dashboardPage,
}) => {
  await loginPage.open();
  await loginPage.login(
    requiredEnv("APP_USERNAME"),
    requiredEnv("APP_PASSWORD"),
  );
  await dashboardPage.expectLoaded();
});
