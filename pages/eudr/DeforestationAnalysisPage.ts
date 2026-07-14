import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";

export class DeforestationAnalysisPage extends BasePage {
  private readonly appShell: AppShell;

  readonly searchInput: Locator;
  readonly submitTab: Locator;
  readonly resultTab: Locator;
  readonly filterButton: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.searchInput = page
      .getByRole("searchbox", { name: /Search/i })
      .or(page.getByPlaceholder("Search"))
      .first();

    this.submitTab = page.getByText(/^Submit$/i).first();
    this.resultTab = page.getByText(/^result$/i).first();

    this.filterButton = page.getByRole("button", {
      description: /Farmer Filter/i,
      exact: true,
    });
  }

  async open(): Promise<void> {
    await this.appShell.openEudrDeforestationAnalysis();
    await this.expectSubmitLoaded();
  }

  async expectSubmitLoaded(): Promise<void> {
    await expect(this.submitTab).toBeVisible({ timeout: 30000 });
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Plot code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Land name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Location type/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Last analysis date/i }),
    ).toBeVisible();
  }

  async search(value: string): Promise<void> {
    await this.expectSubmitLoaded();

    await this.searchInput.fill("");
    await this.searchInput.fill(value);

    await this.page.waitForTimeout(500);
  }

  async expectAtLeastOneSubmitRow(): Promise<void> {
    await expect(
      this.page
        .getByRole("row")
        .filter({ hasText: /Polygon|Point/i })
        .first(),
    ).toBeVisible({ timeout: 30000 });
  }

  async selectFirstSubmitRow(): Promise<void> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: /Polygon|Point/i })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    const checkbox = row.getByRole("checkbox").first();

    await expect(checkbox).toBeVisible({ timeout: 10000 });
    await checkbox.check();

    await expect(checkbox).toBeChecked();
  }

  async unselectFirstSubmitRow(): Promise<void> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: /Polygon|Point/i })
      .first();

    await expect(row).toBeVisible({ timeout: 30000 });

    const checkbox = row.getByRole("checkbox").first();

    await checkbox.uncheck();

    await expect(checkbox).not.toBeChecked();
  }

  async openResultTab(): Promise<void> {
    await expect(this.resultTab).toBeVisible({ timeout: 10000 });
    await this.resultTab.click();

    await this.expectResultLoaded();
  }

  async expectResultLoaded(): Promise<void> {
    await expect(this.searchInput).toBeVisible({ timeout: 15000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Farmer code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Plot code/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Land name/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Location type/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", {
        name: /Analysis submitted date|Analysis summited date/i,
      }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Analysis date/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Analysis status/i }),
    ).toBeVisible();
  }

  async openFilterPanel(): Promise<void> {
    await expect(this.filterButton).toBeVisible({ timeout: 10000 });
    await this.filterButton.click();

    await expect(
      this.page.getByRole("combobox", { name: /Select main unit/i }),
    ).toBeVisible({ timeout: 10000 });
  }

  async selectMainUnitWithFallback(
    preferredMainUnit?: string,
  ): Promise<string> {
    const mainUnitInput = this.page.getByRole("combobox", {
      name: /Select main unit/i,
    });

    await mainUnitInput.click();

    const options = this.page.getByRole("option");
    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    let selectedOption = optionTexts[0];

    if (preferredMainUnit) {
      const matchingOption = optionTexts.find((text) =>
        text.includes(preferredMainUnit),
      );

      if (matchingOption) {
        selectedOption = matchingOption;
      }
    }

    await this.page
      .getByRole("option")
      .filter({ hasText: selectedOption })
      .first()
      .click();

    return selectedOption;
  }

  async selectSubUnitWithFallback(
    preferredSubUnit?: string,
  ): Promise<string | null> {
    const subUnitInput = this.page.getByRole("combobox", {
      name: /Select sub unit/i,
    });

    await subUnitInput.click();

    const options = this.page.getByRole("option");

    const hasOptions = await options
      .first()
      .isVisible({ timeout: 5000 })
      .catch(() => false);

    if (!hasOptions) {
      await this.page.keyboard.press("Escape").catch(() => {});
      return null;
    }

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean);

    let selectedOption = optionTexts[0];

    if (preferredSubUnit) {
      const matchingOption = optionTexts.find((text) =>
        text.includes(preferredSubUnit),
      );

      if (matchingOption) {
        selectedOption = matchingOption;
      }
    }

    await this.page
      .getByRole("option")
      .filter({ hasText: selectedOption })
      .first()
      .click();

    return selectedOption;
  }

  async closeFilterPanel(): Promise<void> {
    await this.page
      .locator(".cdk-overlay-backdrop")
      .click()
      .catch(() => {});
  }
}
