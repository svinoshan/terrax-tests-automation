import { expect, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class AuditSubModulePage extends BasePage {
  private readonly appShell: AppShell;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);
  }

  async openCheckList(): Promise<void> {
    await this.appShell.openAuditCheckList();

    await expect(this.page).toHaveURL(/\/home\/check-list\/all/i, {
      timeout: 30000,
    });
  }

  async openAuditResult(): Promise<void> {
    await this.appShell.openAuditResult();

    await expect(this.page).toHaveURL(/\/home\/audit\/result/i, {
      timeout: 30000,
    });
  }

  async openAuditResultSummary(): Promise<void> {
    await this.appShell.openAuditResultSummary();

    await expect(this.page).toHaveURL(/\/home\/audit\/result-summary/i, {
      timeout: 30000,
    });
  }

  async expectPageLoaded(expectedText: RegExp): Promise<void> {
    await expect(this.page.getByText(expectedText).first()).toBeVisible({
      timeout: 30000,
    });
  }
}