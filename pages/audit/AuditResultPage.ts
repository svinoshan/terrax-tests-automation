import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';
import { AppShell } from '../common/AppShell';

export class AuditResultPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly farmerInput: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    super(page);
    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole('heading', { name: /^Audit result$/i });

    this.farmerInput = page
      .getByRole('combobox', { name: /Pick one/i })
      .first();

    this.searchButton = page.getByRole('button', { name: /Search/i }).first();
  }

  async open(): Promise<void> {
    await this.appShell.openAuditResult();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.farmerInput).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByRole('columnheader', { name: /Audit date/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Audit ref no/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Farmer name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Farmer code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Plot code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Audit by/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Audit type/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole('columnheader', { name: /Action/i }),
    ).toBeVisible();
  }

  async selectFarmerWithFallback(preferredFarmer?: string): Promise<string> {
    const tried = new Set<string>();

    if (preferredFarmer) {
      try {
        await this.farmerInput.click();

        const preferredOption = this.page
          .getByRole('option')
          .filter({ hasText: preferredFarmer })
          .first();

        await expect(preferredOption).toBeVisible({ timeout: 5000 });

        const selectedText = (await preferredOption.innerText())
          .replace(/\s+/g, ' ')
          .trim();

        await preferredOption.click();

        return selectedText;
      } catch {
        tried.add(preferredFarmer);
        await this.page.keyboard.press('Escape').catch(() => {});
      }
    }

    await this.farmerInput.click();

    const options = this.page.getByRole('option');
    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, ' ').trim())
      .filter(Boolean)
      .filter((text) => !tried.has(text));

    if (optionTexts.length === 0) {
      throw new Error('No Audit Result farmer options found.');
    }

    const optionText = optionTexts[0];

    await this.page
      .getByRole('option')
      .filter({ hasText: optionText })
      .first()
      .click();

    return optionText;
  }

  async searchByFarmer(preferredFarmer?: string): Promise<string> {
    const selectedFarmer = await this.selectFarmerWithFallback(preferredFarmer);

    await expect(this.searchButton).toBeVisible({ timeout: 10000 });
    await this.searchButton.click();

    await expect(
      this.page.getByRole('row').filter({ hasText: /CUSTOM-|AUT-|AQR-|\d+/ }).first(),
    ).toBeVisible({ timeout: 30000 });

    return selectedFarmer;
  }

  async expectAtLeastOneResultRow(): Promise<void> {
    await expect(
      this.page.getByRole('row').filter({ hasText: /CUSTOM-|AUT-|AQR-|\d+/ }).first(),
    ).toBeVisible({ timeout: 30000 });
  }

  async openFirstAuditResultDetails(): Promise<void> {
    const firstDetailsButton = this.page
      .locator('tbody tr .me-2.p-2, tbody tr button, tbody tr a')
      .first();

    await expect(firstDetailsButton).toBeVisible({ timeout: 10000 });
    await firstDetailsButton.click();

    await expect(
      this.page.getByRole('heading', { name: /^Audit result$/i }).last(),
    ).toBeVisible({ timeout: 15000 });

    await expect(this.page.getByText(/Farmer Info/i)).toBeVisible({
      timeout: 10000,
    });

    await expect(this.page.getByText(/Audit Info/i)).toBeVisible({
      timeout: 10000,
    });
  }

  async closeAuditResultDetails(): Promise<void> {
    const closeButton = this.page.getByRole('button', { name: /Close/i }).last();

    await expect(closeButton).toBeVisible({ timeout: 10000 });
    await closeButton.click();

    await expect(closeButton).toBeHidden({ timeout: 10000 }).catch(() => {});
  }

  async openFirstAuditResultPrintPopup(): Promise<Page | null> {
    const popupPromise = this.page
      .waitForEvent('popup', { timeout: 15000 })
      .catch(() => null);

    const printButton = this.page
      .locator('tbody tr .p-2.action-icon-btn.text-primary, tbody tr button, tbody tr a')
      .last();

    await expect(printButton).toBeVisible({ timeout: 10000 });
    await printButton.click();

    const popup = await popupPromise;

    if (popup) {
      await popup.waitForLoadState('domcontentloaded', { timeout: 30000 }).catch(() => {});
    }

    return popup;
  }
}
