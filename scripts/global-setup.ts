import { chromium, FullConfig } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { LoginPage } from '../pages/auth/LoginPage';

async function globalSetup(config: FullConfig): Promise<void> {
  dotenv.config();

  const username = process.env.APP_USERNAME;
  const password = process.env.APP_PASSWORD;
  const baseURL = process.env.BASE_URL || 'http://20.6.73.65';

  if (!username || !password) {
    console.warn('APP_USERNAME or APP_PASSWORD is missing. Skipping auth storage setup.');
    return;
  }

  const storageStatePath = path.resolve(process.cwd(), 'auth/storageState.json');
  fs.mkdirSync(path.dirname(storageStatePath), { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ baseURL });

  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(username, password);
  await page.waitForLoadState('networkidle');

  await page.context().storageState({ path: storageStatePath });
  await browser.close();
}

export default globalSetup;
