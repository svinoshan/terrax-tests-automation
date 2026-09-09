import { expect, Locator, Page, Response } from '@playwright/test';
import { randomUUID } from 'node:crypto';
import { BasePage } from '../common/BasePage';
import { PurchaseCase, PurchaseType, purchaseDate } from '@data/purchase/purchase.data';

interface Envelope<T> { code: number; message: string; data: T }
interface Farmer { farmerId: number; farmerName: string; farmerCode: string }
interface Plot { plotCode: string }
interface Item { itemId: number; itemName?: string; name?: string }
interface Location { locationId: number; facilityName: string; status: boolean }
interface Supplier { supplierId: number; supplierName: string; supplierCode: string; active: boolean }
interface Officer { username: string; name: string }
interface PurchaseMain {
  purchaseId: number; fullPurchaseNo: string; note: string; purchaseType: PurchaseType;
  locationId: number; supplierId: number | null; farmerId: number; plotCode: string;
  purchasingOfficerUsername: string; purchaseDate: string; authorized: boolean; cancel: boolean;
}
interface PurchaseLine { itemId: number; itemName: string; qty: number; unitPrice: number; certifications: string[] }
export interface PurchaseDocument { mainDTO: PurchaseMain; detailsDTOS: PurchaseLine[] }
export interface SavedPurchase { id: number; number: string; document: PurchaseDocument }
type CatalogPage<T> = { content: T[] };
const timeout = 20_000;

/** Seeded shuffle: attempts never revisit the same farmer or plot. */
export class PurchaseRandom {
  private state = 2166136261;
  constructor(readonly seed: string) {
    for (const char of seed) this.state = Math.imul(this.state ^ char.charCodeAt(0), 16777619) >>> 0;
  }
  shuffle<T>(values: readonly T[]): T[] {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i--) {
      this.state = (Math.imul(this.state, 1664525) + 1013904223) >>> 0;
      const j = this.state % (i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }
  pick<T>(values: readonly T[], context: string): T {
    if (!values.length) throw new Error('Purchase prerequisite: no eligible ' + context);
    return this.shuffle(values)[0];
  }
}

export class CreatePurchasePage extends BasePage {
  readonly selections: Record<string, unknown> = {};
  readonly attempts: Array<{ farmer: string; plot?: string; reason: string }> = [];
  private readonly catalogs = new Map<string, Promise<unknown>>();
  private readonly random = new PurchaseRandom(process.env.PURCHASE_RANDOM_SEED || randomUUID());

  constructor(page: Page) {
    super(page);
    this.selections.seed = this.random.seed;
    page.on('response', response => {
      if (response.request().method() !== 'GET') return;
      const path = new URL(response.url()).pathname;
      // Keep failures as values until consumed; do not create unhandled rejections.
      this.catalogs.set(path, this.json<unknown>(response).catch(error => error));
    });
  }
  field(name: string): Locator { return this.page.locator('app-purchase-form').locator('[formcontrolname="' + name + '"]'); }
  line(index: number): Locator { return this.page.locator('app-purchase-form tbody tr:has(select[formcontrolname="itemId"])').nth(index); }
  lineField(index: number, name: string): Locator { return this.line(index).locator('[formcontrolname="' + name + '"]'); }
  action(label: 'Save' | 'Update' | 'Save & Authorized' | 'Update & Authorized' | 'Cancel' | 'Report' | 'Reset'): Locator {
    return this.page.locator('app-purchase-form .page-header button').filter({
      hasText: new RegExp('(?:^|\\s)' + label + '\\s*$', 'i')
    });
  }
  async expectLoaded(): Promise<void> {
    await expect(this.field('purchaseType')).toBeVisible();
    await expect(this.line(0)).toBeVisible();
  }
  async json<T>(response: Response): Promise<T> {
    const body = await response.text();
    if (!response.ok()) throw new Error(response.request().method() + ' ' + new URL(response.url()).pathname + ' failed: HTTP ' + response.status() + ' ' + body);
    const parsed = JSON.parse(body) as Envelope<unknown>;
    if (typeof parsed.code === 'number' && parsed.code >= 400) throw new Error('API failure: ' + body);
    return parsed as T;
  }
  private async catalog<T>(suffix: string): Promise<T> {
    await expect.poll(() => [...this.catalogs.keys()].some(k => k.endsWith(suffix)), {
      timeout, message: 'Waiting for reference API ' + suffix
    }).toBeTruthy();
    const key = [...this.catalogs.keys()].find(k => k.endsWith(suffix))!;
    const result = await this.catalogs.get(key);
    if (result instanceof Error) throw result;
    return (result as Envelope<T>).data;
  }
  private async chooseAutocomplete(field: string, query: string, label: string, endpoint?: string): Promise<void> {
    const input = this.field(field);
    if (endpoint) {
      const [response] = await Promise.all([
        this.page.waitForResponse(r => r.request().method() === 'GET' &&
          new URL(r.url()).pathname.endsWith(endpoint) &&
          new URL(r.url()).searchParams.get('value') === query, { timeout }),
        input.fill(query)
      ]);
      await this.json(response);
    } else {
      await input.fill(query);
    }
    await input.click();
    await this.page.locator('.cdk-overlay-pane [role="option"]').filter({ hasText: label }).click();
    await expect(input).not.toHaveValue('');
  }
  async selectType(type: PurchaseType): Promise<void> { await this.field('purchaseType').selectOption(type); }

  async prepare(data: PurchaseCase, note: string): Promise<void> {
    await this.expectLoaded();
    await this.selectType(data.purchaseType);
    await this.field('date').fill(purchaseDate(data.purchaseDate));
    await this.field('date').blur();
    await this.field('note').fill(note);
    const locations = await this.catalog<CatalogPage<Location>>('/locations/unassigned');
    const location = this.random.pick(locations.content.filter(x => x.status), 'receiving locations');
    await this.chooseAutocomplete('location', location.facilityName, location.facilityName, '/locations/unassigned');
    this.selections.location = location;

    if (data.purchaseType === 'FARMER_GROUP') {
      await this.chooseFarmerWithItems(data.lines.length);
    } else {
      const suppliers = await this.catalog<CatalogPage<Supplier>>('/suppliers/list');
      const supplier = this.random.pick(suppliers.content.filter(x => x.active), 'suppliers');
      await this.chooseAutocomplete('supplier', supplier.supplierCode, supplier.supplierCode, '/suppliers/list');
      this.selections.supplier = supplier;
      await this.catalog<Item[]>('/items/by_mother');
    }
    // Farmer selection auto-populates the officer, so select our officer last.
    const officers = await this.catalog<CatalogPage<Officer>>('/users/all');
    const officer = this.random.pick(officers.content, 'purchasing officers');
    await this.chooseAutocomplete('user', officer.username, officer.name);
    this.selections.officer = officer;
    await this.fillLines(data);
  }

  private async chooseFarmerWithItems(requiredItems: number): Promise<void> {
    const farmers = this.random.shuffle(await this.catalog<Farmer[]>('/farmers/filter'));
    const limit = Number(process.env.PURCHASE_MAX_FARMER_ATTEMPTS || 20);
    if (!Number.isInteger(limit) || limit < 1) throw new Error('PURCHASE_MAX_FARMER_ATTEMPTS must be a positive integer');
    for (const farmer of farmers.slice(0, limit)) {
      const [landResponse] = await Promise.all([
        this.page.waitForResponse(r => new URL(r.url()).pathname.endsWith('/farmer/lands/purchase') &&
          new URL(r.url()).searchParams.get('farmerId') === String(farmer.farmerId), { timeout }),
        this.chooseAutocomplete('farmer', farmer.farmerCode, farmer.farmerCode)
      ]);
      const plots = (await this.json<Envelope<Plot[]>>(landResponse)).data;
      if (!plots.length) this.attempts.push({ farmer: farmer.farmerCode, reason: 'No plots' });
      for (const plot of this.random.shuffle(plots)) {
        const [itemResponse] = await Promise.all([
          this.page.waitForResponse(r => new URL(r.url()).pathname.endsWith('/crops/byFarmer') &&
            new URL(r.url()).searchParams.get('farmerID') === String(farmer.farmerId) &&
            new URL(r.url()).searchParams.get('plotCode') === plot.plotCode, { timeout }),
          this.chooseAutocomplete('land', plot.plotCode, plot.plotCode)
        ]);
        const items = (await this.json<Envelope<Item[]>>(itemResponse)).data;
        if (new Set(items.map(x => x.itemId)).size >= requiredItems) {
          this.selections.farmer = farmer;
          this.selections.plot = plot;
          this.attempts.push({ farmer: farmer.farmerCode, plot: plot.plotCode, reason: 'Selected' });
          return;
        }
        this.attempts.push({ farmer: farmer.farmerCode, plot: plot.plotCode, reason: 'Insufficient distinct items: ' + items.length });
      }
    }
    throw new Error('Purchase prerequisite: no farmer/plot with ' + requiredItems + ' distinct items after ' +
      Math.min(limit, farmers.length) + ' farmers. Attempts: ' + JSON.stringify(this.attempts));
  }

  async fillLines(data: PurchaseCase): Promise<void> {
    const items = await this.catalog<Item[]>(data.purchaseType === 'FARMER_GROUP' ? '/crops/byFarmer' : '/items/by_mother');
    const unique = [...new Map(items.map(item => [item.itemId, item])).values()];
    const selected = this.random.shuffle(unique).slice(0, data.lines.length);
    if (selected.length < data.lines.length) throw new Error('Purchase prerequisite: insufficient distinct items');
    this.selections.items = selected;
    for (let i = 0; i < data.lines.length; i++) {
      if (i > 0) await this.page.getByRole('button', { name: /add line/i }).click();
      await expect(this.lineField(i, 'itemId').locator('option[value="' + selected[i].itemId + '"]')).toHaveCount(1);
      if (data.purchaseType === 'FARMER_GROUP') {
        const [response] = await Promise.all([
          this.page.waitForResponse(r => new URL(r.url()).pathname.endsWith('/purchase/details/sum') &&
            new URL(r.url()).searchParams.get('itemID') === String(selected[i].itemId), { timeout }),
          this.lineField(i, 'itemId').selectOption(String(selected[i].itemId))
        ]);
        await this.json(response);
      } else {
        await this.lineField(i, 'itemId').selectOption(String(selected[i].itemId));
        const codes = (await this.catalog<Array<{ certCode: string }>>('/certifications')).map(c => c.certCode);
        const count = data.lines[i].certificationCount || 0;
        if (count > codes.length) throw new Error('Purchase prerequisite: insufficient certifications');
        if (count) {
          await this.lineField(i, 'certifications').click();
          const chosen = this.random.shuffle(codes).slice(0, count);
          for (const code of chosen) await this.page.getByRole('option', { name: code, exact: true }).click();
          await this.page.keyboard.press('Escape');
          this.selections['certifications_' + i] = chosen;
        }
      }
      await this.lineField(i, 'qty').fill(String(data.lines[i].qty));
      await this.lineField(i, 'unitPrice').fill(String(data.lines[i].unitPrice));
      await expect(this.line(i).locator('td').nth(data.purchaseType === 'FARMER_GROUP' ? 6 : 5))
        .toHaveText((data.lines[i].qty * data.lines[i].unitPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    }
  }

  async submit(authorize = false, update = false): Promise<{ document: PurchaseDocument; response: Response }> {
    const method = update ? 'PUT' : 'POST';
    const [response] = await Promise.all([
      this.page.waitForResponse(r => r.request().method() === method &&
        new URL(r.url()).pathname.endsWith('/purchase/main'), { timeout }),
      this.action((update ? 'Update' : 'Save') + (authorize ? ' & Authorized' : '') as 'Save').click()
    ]);
    const result = await this.json<Envelope<null>>(response);
    expect(result.code, result.message).toBe(update ? 204 : 201);
    await expect(this.page).toHaveURL(/\/purchase\/all/);
    return { document: response.request().postDataJSON() as PurchaseDocument, response };
  }

  async createAndIdentify(authorize = false): Promise<SavedPurchase> {
    const { document, response } = await this.submit(authorize);
    const endpoint = response.url();
    const headers = await response.request().allHeaders();
    delete headers['content-length'];
    // The create API returns no ID. Resolve the exact generated note using
    // paginated list results and its unique note, never the first matching farmer.
    const maxPages = 20;
    for (let page = 0; page < maxPages; page++) {
      const listResponse = await this.page.request.get(endpoint + '/all', { headers,
        params: { value: '', purchaseType: document.mainDTO.purchaseType, page, size: 100 } });
      expect(listResponse.ok()).toBeTruthy();
      const list = await listResponse.json() as Envelope<{ content: PurchaseMain[]; totalPages: number }>;
      expect(list.code).toBe(200);
      for (const row of list.data.content) {
        if (row.purchaseDate?.slice(0, 10) !== document.mainDTO.purchaseDate.slice(0, 10)) continue;
        const detailResponse = await this.page.request.get(endpoint, { headers, params: { grnID: row.purchaseId } });
        expect(detailResponse.ok()).toBeTruthy();
        const detail = await detailResponse.json() as Envelope<PurchaseDocument>;
        expect(detail.code).toBe(200);
        if (detail.data.mainDTO.note === document.mainDTO.note) {
          const saved = { id: row.purchaseId, number: detail.data.mainDTO.fullPurchaseNo, document };
          this.selections.savedPurchase = { id: saved.id, number: saved.number };
          this.expectDocumentMatches(detail.data, document);
          return saved;
        }
      }
      if (page + 1 >= list.data.totalPages) break;
    }
    throw new Error('Created purchase could not be uniquely identified within 2000 records; see submitted note in report');
  }

  async expectPersisted(saved: SavedPurchase): Promise<void> {
    await expect(this.field('recNo')).toHaveValue(saved.number, { timeout });
    await expect(this.field('note')).toHaveValue(saved.document.mainDTO.note);
    await expect(this.field('purchaseType')).toHaveValue(saved.document.mainDTO.purchaseType);
    await expect.poll(async () => {
      const value = await this.field('date').inputValue();
      return new Date(value).toLocaleDateString('en-CA');
    }).toBe(saved.document.mainDTO.purchaseDate.slice(0, 10));
    const location = this.selections.location as Location | undefined;
    const officer = this.selections.officer as Officer | undefined;
    if (location) await expect(this.field('location')).toHaveValue(location.facilityName);
    if (officer) await expect(this.field('user')).toHaveValue(officer.name);
    if (saved.document.mainDTO.purchaseType === 'SUPPLIER') {
      const supplier = this.selections.supplier as Supplier | undefined;
      if (supplier) await expect(this.field('supplier')).toHaveValue(supplier.supplierName);
    } else {
      const farmer = this.selections.farmer as Farmer | undefined;
      if (farmer) await expect(this.field('farmer')).toHaveValue(farmer.farmerName);
      await expect(this.field('land')).toHaveValue(saved.document.mainDTO.plotCode);
    }
    await expect(this.page.locator('app-purchase-form tbody tr:has(select[formcontrolname="itemId"])')).toHaveCount(saved.document.detailsDTOS.length);
    for (let i = 0; i < saved.document.detailsDTOS.length; i++) {
      const line = saved.document.detailsDTOS[i];
      await expect(this.lineField(i, 'itemId')).toHaveValue(String(line.itemId));
      await expect.poll(async () => Number(await this.lineField(i, 'qty').inputValue())).toBe(line.qty);
      await expect.poll(async () => Number(await this.lineField(i, 'unitPrice').inputValue())).toBe(line.unitPrice);
      for (const code of line.certifications || []) {
        await expect(this.line(i).locator('td').nth(2)).toContainText(code);
      }
    }
  }
  private expectDocumentMatches(actual: PurchaseDocument, expected: PurchaseDocument): void {
    const keys = ['note', 'purchaseType', 'locationId', 'purchasingOfficerUsername', 'authorized'] as const;
    for (const key of keys) expect(actual.mainDTO[key], 'Persisted purchase ' + key).toEqual(expected.mainDTO[key]);
    if (expected.mainDTO.purchaseType === 'SUPPLIER') {
      expect(actual.mainDTO.supplierId).toBe(expected.mainDTO.supplierId);
    } else {
      expect(actual.mainDTO.farmerId).toBe(expected.mainDTO.farmerId);
      expect(actual.mainDTO.plotCode).toBe(expected.mainDTO.plotCode);
    }
    expect(actual.detailsDTOS).toHaveLength(expected.detailsDTOS.length);
    for (const line of expected.detailsDTOS) {
      const persisted = actual.detailsDTOS.find(x => x.itemId === line.itemId);
      expect(persisted, 'Persisted item ' + line.itemId).toBeDefined();
      expect(Number(persisted!.qty)).toBe(line.qty);
      expect(Number(persisted!.unitPrice)).toBe(line.unitPrice);
      expect([...(persisted!.certifications || [])].sort()).toEqual([...(line.certifications || [])].sort());
    }
  }
  async cancelPurchase(): Promise<void> {
    await this.action('Cancel').click();
    const [response] = await Promise.all([
      this.page.waitForResponse(r => r.request().method() === 'PUT' && new URL(r.url()).pathname.endsWith('/purchase/main/cancel')),
      this.page.getByRole('button', { name: /yes.*cancel/i }).click()
    ]);
    expect((await this.json<Envelope<null>>(response)).code).toBe(204);
    await expect(this.page).toHaveURL(/\/purchase\/all/);
  }
  async openReportPopup(): Promise<Page> {
    const [popup] = await Promise.all([this.page.waitForEvent('popup'), this.action('Report').click()]);
    return popup;
  }
}
