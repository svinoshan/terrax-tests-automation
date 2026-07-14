import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class AuditResultSummaryPage extends BasePage {
  private readonly appShell: AppShell;

  readonly checkListInput: Locator;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);

    this.checkListInput = page
      .getByRole('combobox', { name: /Check List Name/i })
      .first();
  }

  async open(): Promise<void> {
    await this.appShell.openAuditResultSummary();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.checkListInput).toBeVisible({ timeout: 30000 });

    await expect(
      this.page.getByRole('columnheader', { name: /Control point/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Total count/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Total yes/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Total no/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Total na/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Yes percentage/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /No percentage/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Na percentage/i }),
    ).toBeVisible();
  }

  async selectCheckListWithFallback(preferredCheckList?: string): Promise<string> {
    const tried = new Set<string>();

    if (preferredCheckList) {
      try {
        await this.checkListInput.click();

        const preferredOption = this.page
          .getByRole('option')
          .filter({ hasText: preferredCheckList })
          .first();

        await expect(preferredOption).toBeVisible({ timeout: 5000 });

        const selectedText = (await preferredOption.innerText())
          .replace(/\s+/g, ' ')
          .trim();

        await preferredOption.click();

        return selectedText;
      } catch {
        tried.add(preferredCheckList);
        await this.page.keyboard.press('Escape').catch(() => {});
      }
    }

    await this.checkListInput.click();

    const options = this.page.getByRole('option');
    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .filter((text) => !tried.has(text));

    if (optionTexts.length === 0) {
      throw new Error('No Audit Result Summary checklist options found.');
    }

    const optionText = optionTexts[0];

    await this.page
      .getByRole('option')
      .filter({ hasText: optionText })
      .first()
      .click();

    return optionText;
  }

  async expectSummaryRowsVisible(): Promise<void> {
    await expect(
      this.page.getByRole('row').filter({ hasText: /\d+|%|Header|Major|Minor|Recommended/i }).first(),
    ).toBeVisible({ timeout: 30000 });
  }
}
