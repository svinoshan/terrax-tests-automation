import { APIRequestContext, expect } from '@playwright/test';

export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async healthCheck(endpoint = '/'): Promise<void> {
    const response = await this.request.get(endpoint);
    expect(response.status()).toBeLessThan(500);
  }
}
