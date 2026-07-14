import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "../common/BasePage";
import { AppShell } from "../common/AppShell";
import { CheckListTestData } from "@data/audit/checklist.data";

export class CheckListPage extends BasePage {
  private readonly appShell: AppShell;

  readonly pageTitle: Locator;
  readonly checkListInput: Locator;
  readonly saveButton: Locator;

  readonly addCheckListButton: Locator;
  readonly editCheckListButton: Locator;
  readonly addControlPointButton: Locator;
  readonly refreshButton: Locator;

  readonly nameInput: Locator;
  readonly modalAddButton: Locator;
  readonly modalUpdateButton: Locator;
  readonly modalClearButton: Locator;

  readonly cpNoInput: Locator;
  readonly controlPointInput: Locator;
  readonly naCheckbox: Locator;
  readonly cpSaveButton: Locator;
  readonly cpUpdateButton: Locator;

  constructor(page: Page) {
    super(page);

    this.appShell = new AppShell(page);

    this.pageTitle = page.getByRole("heading", { name: /All check list/i });

    this.checkListInput = page
      .getByRole("combobox", { name: /Pick one/i })
      .first();

    this.saveButton = page.getByRole("button", { name: /\+?\s*Save/i }).first();

    // Checklist buttons are icon-only. The visible plus comes from <i class="fa fa-plus">.
    this.addCheckListButton = page
      .locator("button.action-square-btn")
      .filter({ has: page.locator("i.fa-plus, .fa-plus") })
      .first();

    this.editCheckListButton = page
      .locator("button.action-square-btn")
      .filter({ has: page.locator("i.fa-pen, .fa-pen, i.fa-edit, .fa-edit") })
      .first();

    this.addControlPointButton = page
      .locator("button.action-square-btn")
      .filter({ has: page.locator("i.fa-plus, .fa-plus") })
      .last();

    this.refreshButton = page
      .locator("button.action-square-btn")
      .filter({
        has: page.locator("i.fa-refresh, .fa-refresh, i.fa-sync, .fa-sync"),
      })
      .last();

    this.nameInput = page.getByRole("textbox", { name: /EnterName/i });
    this.modalAddButton = page.getByRole("button", { name: /^Add$/i });
    this.modalUpdateButton = page.getByRole("button", { name: /^Update$/i });
    this.modalClearButton = page.getByRole("button", { name: /^Clear$/i });

    this.cpNoInput = page.getByRole("textbox", {
      name: /Enter cpno/i,
    });

    this.controlPointInput = page.getByRole("textbox", {
      name: /Enter control point/i,
    });

    this.naCheckbox = page.getByRole("checkbox").last();

    this.cpSaveButton = page.getByRole("button", { name: /^Save$/i });
    this.cpUpdateButton = page.getByRole("button", { name: /^Update$/i });
  }

  async open(): Promise<void> {
    await this.appShell.openAuditCheckList();
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.pageTitle).toBeVisible({ timeout: 30000 });
    await expect(this.checkListInput).toBeVisible({ timeout: 10000 });

    await expect(
      this.page.getByRole("columnheader", { name: /Drag/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /CP No/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Control Point/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Level/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /NA/i }),
    ).toBeVisible();

    await expect(
      this.page.getByRole("columnheader", { name: /Action/i }),
    ).toBeVisible();
  }

  async openAddCheckListDialog(): Promise<void> {
    await expect(this.addCheckListButton).toBeVisible({ timeout: 10000 });
    await this.addCheckListButton.click();

    await expect(this.nameInput).toBeVisible({ timeout: 10000 });
  }

  async createCheckList(name: string): Promise<void> {
    await this.openAddCheckListDialog();

    await this.nameInput.fill(name);

    await expect(this.modalAddButton).toBeVisible({ timeout: 10000 });
    await this.modalAddButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async selectCheckList(name: string): Promise<void> {
    await this.checkListInput.click();

    const exactOption = this.page
      .getByRole("option")
      .filter({ hasText: name })
      .first();

    await expect(exactOption).toBeVisible({ timeout: 15000 });
    await exactOption.click();

    await expect
      .poll(async () => (await this.checkListInput.inputValue()).trim(), {
        timeout: 10000,
        message: "Expected checklist input to contain selected checklist name",
      })
      .toContain(name);
  }

  private async clickRightMostVisiblePlusButton(): Promise<void> {
    const plusButtons = this.page
      .locator("button.action-square-btn")
      .filter({ has: this.page.locator("i.fa-plus, .fa-plus") });

    await expect
      .poll(
        async () => {
          const count = await plusButtons.count();
          let visibleCount = 0;

          for (let index = 0; index < count; index += 1) {
            if (
              await plusButtons
                .nth(index)
                .isVisible()
                .catch(() => false)
            ) {
              visibleCount += 1;
            }
          }

          return visibleCount;
        },
        {
          timeout: 10000,
          message:
            "Expected checklist add and control-point add plus buttons to be visible",
        },
      )
      .toBeGreaterThan(1);

    const count = await plusButtons.count();

    let rightMostButton: Locator | null = null;
    let rightMostX = -Infinity;

    for (let index = 0; index < count; index += 1) {
      const button = plusButtons.nth(index);

      if (!(await button.isVisible().catch(() => false))) {
        continue;
      }

      const box = await button.boundingBox();

      if (!box) {
        continue;
      }

      if (box.x > rightMostX) {
        rightMostX = box.x;
        rightMostButton = button;
      }
    }

    if (!rightMostButton) {
      throw new Error("Could not find visible rightmost plus button.");
    }

    await rightMostButton.click();
  }

  async openAddControlPointDialog(): Promise<void> {
    await this.clickRightMostVisiblePlusButton();

    await expect(this.cpNoInput).toBeVisible({ timeout: 10000 });
    await expect(this.controlPointInput).toBeVisible({ timeout: 10000 });
  }

  async selectLevel(level: string): Promise<void> {
    const levelControl = this.page
      .locator('mat-select, .mat-mdc-select, [role="combobox"]')
      .filter({ hasText: /Select|Header|Major|Minor|Recommended/i })
      .last();

    await levelControl.click();

    const option = this.page
      .getByRole("option")
      .filter({ hasText: level })
      .first();

    await expect(option).toBeVisible({ timeout: 10000 });
    await option.click();
  }

  async addControlPoint(data: CheckListTestData): Promise<void> {
    await this.openAddControlPointDialog();

    await this.cpNoInput.fill(data.cpNo);

    await this.selectLevel(data.level);

    await this.controlPointInput.fill(data.controlPoint);

    if (data.isNa) {
      await this.naCheckbox.check();
    } else {
      await this.naCheckbox.uncheck().catch(() => {});
    }

    await expect(this.cpSaveButton).toBeVisible({ timeout: 10000 });
    await this.cpSaveButton.click();

    await expect(
      this.page.getByRole("row").filter({ hasText: data.controlPoint }).first(),
    ).toBeVisible({ timeout: 15000 });
  }

  async expectControlPointVisible(controlPoint: string): Promise<void> {
    await expect(
      this.page.getByRole("row").filter({ hasText: controlPoint }).first(),
    ).toBeVisible({ timeout: 15000 });
  }

  async expectCheckListHasRows(): Promise<void> {
    await expect(
      this.page
        .getByRole("row")
        .filter({ hasText: /Header|Major|Minor|Recommended/i })
        .first(),
    ).toBeVisible({ timeout: 15000 });
  }

  private checklistRows(): Locator {
    return this.page
      .locator("tbody tr")
      .filter({ has: this.page.locator(".cdk-drag-handle") });
  }

  private checklistMovableRows(): Locator {
    // Prefer non-header rows because Header rows can be grouped/structured differently.
    return this.checklistRows().filter({
      hasText: /Major|Minor|Recommended/i,
    });
  }

  async getDraggableRowCount(): Promise<number> {
    return await this.checklistRows().count();
  }

  async getMovableRowCount(): Promise<number> {
    return await this.checklistMovableRows().count();
  }

  async waitForDraggableRows(minCount = 2): Promise<void> {
    await expect
      .poll(async () => await this.getDraggableRowCount(), {
        timeout: 15000,
        message: `Expected checklist to have at least ${minCount} draggable rows`,
      })
      .toBeGreaterThan(minCount - 1);
  }

  async expectAtLeastTwoDraggableRows(): Promise<void> {
    await this.waitForDraggableRows(2);
  }

  async getControlPointTextAtIndex(index: number): Promise<string> {
    const row = this.checklistMovableRows().nth(index);

    await expect(row).toBeVisible({ timeout: 10000 });

    const controlPointText = await row.locator("td").nth(2).innerText();

    return controlPointText.replace(/\s+/g, " ").trim();
  }

  async selectCheckListWithDraggableRows(
    preferredCheckListName?: string,
  ): Promise<string> {
    const tried = new Set<string>();

    if (preferredCheckListName) {
      try {
        await this.selectCheckList(preferredCheckListName);
        await this.waitForDraggableRows(2);
        return preferredCheckListName;
      } catch {
        tried.add(preferredCheckListName);
      }
    }

    await this.checkListInput.click();

    const options = this.page.getByRole("option");
    await expect(options.first()).toBeVisible({ timeout: 15000 });

    const optionTexts = (await options.allInnerTexts())
      .map((text) => text.replace(/\s+/g, " ").trim())
      .filter(Boolean)
      .filter((text) => !tried.has(text));

    await this.page.keyboard.press("Escape").catch(() => {});

    for (const optionText of optionTexts) {
      try {
        await this.selectCheckList(optionText);
        await this.waitForDraggableRows(2);
        return optionText;
      } catch {
        tried.add(optionText);
      }
    }

    throw new Error(
      `No checklist with at least two draggable rows found. Tried: ${Array.from(
        tried,
      ).join(", ")}`,
    );
  }

  async dragFirstControlPointBelowSecond(): Promise<void> {
    await this.waitForDraggableRows(2);

    await expect
      .poll(async () => await this.getMovableRowCount(), {
        timeout: 10000,
        message: "Expected at least two movable non-header checklist rows",
      })
      .toBeGreaterThan(1);

    const rows = this.checklistMovableRows();

    const sourceRow = rows.nth(0);
    const targetRow = rows.nth(1);

    await expect(sourceRow).toBeVisible({ timeout: 10000 });
    await expect(targetRow).toBeVisible({ timeout: 10000 });

    const sourceHandle = sourceRow.locator(".cdk-drag-handle").first();
    const targetHandle = targetRow.locator(".cdk-drag-handle").first();

    await expect(sourceHandle).toBeVisible({ timeout: 10000 });
    await expect(targetHandle).toBeVisible({ timeout: 10000 });

    const sourceBox = await sourceHandle.boundingBox();
    const targetBox = await targetHandle.boundingBox();

    if (!sourceBox || !targetBox) {
      throw new Error("Could not calculate checklist drag handle positions.");
    }

    await this.page.mouse.move(
      sourceBox.x + sourceBox.width / 2,
      sourceBox.y + sourceBox.height / 2,
    );

    await this.page.mouse.down();

    await this.page.mouse.move(
      targetBox.x + targetBox.width / 2,
      targetBox.y + targetBox.height + 30,
      { steps: 25 },
    );

    await this.page.mouse.up();

    await this.page.waitForTimeout(500);
  }

  async dragFirstControlPointBelowSecondAndVerify(): Promise<{
    beforeFirst: string;
    beforeSecond: string;
    afterFirst: string;
  }> {
    await this.expectAtLeastTwoDraggableRows();

    const beforeFirst = await this.getControlPointTextAtIndex(0);
    const beforeSecond = await this.getControlPointTextAtIndex(1);

    await this.dragFirstControlPointBelowSecond();

    await expect
      .poll(async () => await this.getControlPointTextAtIndex(0), {
        timeout: 10000,
        message: "Expected first checklist row to change after drag",
      })
      .not.toBe(beforeFirst);

    const afterFirst = await this.getControlPointTextAtIndex(0);

    return {
      beforeFirst,
      beforeSecond,
      afterFirst,
    };
  }

  async saveOrder(): Promise<void> {
    await expect(this.saveButton).toBeVisible({ timeout: 10000 });
    await this.saveButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});
  }

  async expectSavedToast(): Promise<void> {
    await expect(this.page.getByText(/Success|success/i).first()).toBeVisible({
      timeout: 10000,
    });
  }

  async clickEditForControlPoint(controlPoint: string): Promise<void> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: controlPoint })
      .first();

    await expect(row).toBeVisible({ timeout: 15000 });

    await row.locator(".p-2.action-icon-btn, button, a").first().click();
  }

  async updateControlPoint(data: {
    originalControlPoint: string;
    updatedControlPoint: string;
    updatedLevel: "Header" | "Major" | "Minor" | "Recommended";
    isNa: boolean;
  }): Promise<void> {
    await this.clickEditForControlPoint(data.originalControlPoint);

    await expect(this.controlPointInput).toBeVisible({ timeout: 10000 });

    await this.controlPointInput.click();
    await this.controlPointInput.press(
      process.platform === "darwin" ? "Meta+A" : "Control+A",
    );
    await this.controlPointInput.press("Backspace");
    await this.controlPointInput.fill(data.updatedControlPoint);

    await this.selectLevel(data.updatedLevel);

    if (data.isNa) {
      await this.naCheckbox.check();
    } else {
      await this.naCheckbox.uncheck().catch(() => {});
    }

    await expect(this.cpUpdateButton).toBeVisible({ timeout: 10000 });
    await this.cpUpdateButton.click();

    await this.page
      .waitForLoadState("networkidle", { timeout: 30000 })
      .catch(() => {});

    await this.expectControlPointVisible(data.updatedControlPoint);
  }

  async expectControlPointRowContains(
    controlPoint: string,
    expectedText: string | RegExp,
  ): Promise<void> {
    const row = this.page
      .getByRole("row")
      .filter({ hasText: controlPoint })
      .first();

    await expect(row).toBeVisible({ timeout: 15000 });
    await expect(row).toContainText(expectedText);
  }
}
