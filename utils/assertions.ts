import { expect, Locator } from '@playwright/test';

export async function expectVisible(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
}

export async function expectTextVisible(locator: Locator, text: string | RegExp): Promise<void> {
  await expect(locator).toContainText(text);
}
