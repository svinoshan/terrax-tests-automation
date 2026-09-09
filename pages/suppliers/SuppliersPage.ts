import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from '@pages/common/BasePage';
import { AppShell } from '@pages/common/AppShell';
import { SupplierTestData } from '@data/suppliers/supplier.data';
import { LocationDialog } from '@pages/common/LocationDialog';

export class SuppliersPage extends BasePage {
  private readonly shell:AppShell;readonly locationDialog:LocationDialog;
  constructor(page:Page){super(page);this.shell=new AppShell(page);this.locationDialog=new LocationDialog(page);}
  async open():Promise<void>{await this.shell.openSuppliers();await expect(this.page).toHaveURL(/\/home\/supplier\/all/);await expect(this.page.getByRole('heading',{name:/^suppliers$/i})).toBeVisible();}
  async openCreate():Promise<void>{await this.page.getByText(/add new/i).first().click();await expect(this.panel()).toBeVisible();}
  panel():Locator{return this.page.locator('app-supplier-form .side-panel-wrapper.show-panel').last();}
  field(name:string):Locator{return this.panel().locator(`[formcontrolname="${name}"]`);}
  async fill(data:SupplierTestData):Promise<void>{await this.field('supplierCode').fill(data.supplierCode);await this.field('supplierName').fill(data.supplierName);if(data.country)await this.field('countryId').selectOption({label:data.country});await this.field('contactPerson').fill(data.contactPerson);await this.field('phone').fill(data.phone);await this.field('email').fill(data.email||'');await this.field('address').fill(data.address);await this.field('registrationNo').fill(data.registrationNo);await this.field('taxNo').fill(data.taxNo);await this.field('description').fill(data.description||'');if(typeof data.active==='boolean')await this.setSwitch(this.field('active'),data.active);for(const location of data.locations||[]){await this.panel().getByRole('button',{name:/add/i}).click();await this.locationDialog.fill(location);await this.locationDialog.save();}}
  async save():Promise<void>{await this.panel().locator('.side-panel-footer button.btn-success').click();}
  async update():Promise<void>{await this.panel().locator('.side-panel-footer button.btn-success').click();}
  async search(value:string):Promise<void>{await this.page.locator('[formcontrolname="filterValue"]').fill(value);await this.page.waitForTimeout(900);}
  async row(code:string):Promise<Locator>{const row=this.page.getByRole('row').filter({hasText:code}).first();await expect(row).toBeVisible({timeout:20_000});return row;}
  async edit(code:string):Promise<void>{const row=await this.row(code);await row.locator('td').last().locator('a').first().click();await expect(this.panel()).toBeVisible();await expect(this.field('supplierCode')).toHaveValue(code,{timeout:15_000});}
  async expectRowContains(code:string,value:string):Promise<void>{await expect(await this.row(code)).toContainText(value);}
  async editFirstLocation():Promise<void>{await this.panel().locator('.location-summary').first().getByRole('button',{name:/edit/i}).click();}
  async expectInline(message:string):Promise<void>{await expect(this.panel().getByText(message).first()).toBeVisible();}
  async setStatus(status:boolean):Promise<void>{await this.setSwitch(this.field('active'),status);}
  async delete(code:string):Promise<void>{const row=await this.row(code);await row.locator('td').last().locator('a').last().click();await this.page.getByRole('button',{name:/yes, delete it!/i}).click();}
  async expectStatus(code:string,status:'Active'|'Inactive'):Promise<void>{await expect((await this.row(code)).getByRole('cell').nth(5)).toContainText(status);}
  private async setSwitch(locator:Locator,expected:boolean):Promise<void>{if((await locator.isChecked())!==expected)await locator.click();}
}
