import { test as base, expect } from "@playwright/test";
import { LoginPage } from "@pages/auth/LoginPage";
import { DashboardPage } from "@pages/dashboard/DashboardPage";
import { AppShell } from "@pages/common/AppShell";
import { FarmerListPage } from "@pages/farmer/FarmerListPage";
import { FarmerProfilePage } from "@pages/farmer/FarmerProfilePage";
import { CropsListPage } from "@pages/crops/CropsListPage";
import { CreateCropPage } from "@pages/crops/CreateCropPage";
import { CustomersPage } from "@pages/customers/CustomersPage";
import { CreateCustomerPage } from "@pages/customers/CreateCustomerPage";
import { MainUnitPage } from "@pages/unit-info/MainUnitPage";
import { SubUnitPage } from "@pages/unit-info/SubUnitPage";
import { PurchaseListPage } from "@pages/purchase/PurchaseListPage";
import { CreatePurchasePage } from "@pages/purchase/CreatePurchasePage";
import { DispatchListPage } from "@pages/dispatch/DispatchListPage";
import { CreateDispatchPage } from "@pages/dispatch/CreateDispatchPage";
import { AuditListPage } from "@pages/audit/AuditListPage";
import { CreateAuditPage } from "@pages/audit/CreateAuditPage";
import { AuditSubModulePage } from "@pages/audit/AuditSubModulePage";
import { CheckListPage } from "@pages/audit/CheckListPage";

type PageFixtures = {
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  appShell: AppShell;
  farmerListPage: FarmerListPage;
  farmerProfilePage: FarmerProfilePage;
  cropsListPage: CropsListPage;
  createCropPage: CreateCropPage;
  customersPage: CustomersPage;
  createCustomerPage: CreateCustomerPage;
  mainUnitPage: MainUnitPage;
  subUnitPage: SubUnitPage;
  purchaseListPage: PurchaseListPage;
  createPurchasePage: CreatePurchasePage;
  dispatchListPage: DispatchListPage;
  createDispatchPage: CreateDispatchPage;
  auditListPage: AuditListPage;
  createAuditPage: CreateAuditPage;
  auditSubModulePage: AuditSubModulePage;
  checkListPage: CheckListPage;
};

export const test = base.extend<PageFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  appShell: async ({ page }, use) => {
    await use(new AppShell(page));
  },

  farmerListPage: async ({ page }, use) => {
    await use(new FarmerListPage(page));
  },

  farmerProfilePage: async ({ page }, use) => {
    await use(new FarmerProfilePage(page));
  },

  cropsListPage: async ({ page }, use) => {
    await use(new CropsListPage(page));
  },

  createCropPage: async ({ page }, use) => {
    await use(new CreateCropPage(page));
  },

  customersPage: async ({ page }, use) => {
    await use(new CustomersPage(page));
  },

  createCustomerPage: async ({ page }, use) => {
    await use(new CreateCustomerPage(page));
  },

  mainUnitPage: async ({ page }, use) => {
    await use(new MainUnitPage(page));
  },

  subUnitPage: async ({ page }, use) => {
    await use(new SubUnitPage(page));
  },

  purchaseListPage: async ({ page }, use) => {
    await use(new PurchaseListPage(page));
  },

  createPurchasePage: async ({ page }, use) => {
    await use(new CreatePurchasePage(page));
  },

  dispatchListPage: async ({ page }, use) => {
    await use(new DispatchListPage(page));
  },

  createDispatchPage: async ({ page }, use) => {
    await use(new CreateDispatchPage(page));
  },

  auditListPage: async ({ page }, use) => {
    await use(new AuditListPage(page));
  },

  createAuditPage: async ({ page }, use) => {
    await use(new CreateAuditPage(page));
  },

  auditSubModulePage: async ({ page }, use) => {
    await use(new AuditSubModulePage(page));
  },

  checkListPage: async ({ page }, use) => {
    await use(new CheckListPage(page));
  },
});

export { expect };
