import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '../common/BasePage';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator('input[formcontrolname="username"]');
    this.passwordInput = page.locator('input[formcontrolname="password"]');
    this.signInButton = page.locator('button.btn-login').filter({ hasText: /sign in/i });
  }

  async open(): Promise<void> {
    await this.goto('/signin');
    await expect(this.page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
  }

  async expectLoginPageVisible(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.signInButton).toBeVisible();
  }
}
