import records from './purchase-data.json';
import { selectTestData } from '@utils/test-data-selection';
export type PurchaseType = 'FARMER_GROUP' | 'SUPPLIER';
export interface PurchaseLineData { qty: number; unitPrice: number; certificationCount?: number }
export interface PurchaseCase {
  testCaseId: string;
  purchaseType: PurchaseType;
  purchaseDate: string;
  lines: PurchaseLineData[];
  updates: { qty: number; unitPrice: number };
}
export function getPurchaseData(): PurchaseCase[] {
  return selectTestData(records as PurchaseCase[], 'PURCHASE_');
}
export function purchaseDate(value: string): string {
  if (value !== 'today') return value;
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Colombo' }).format(new Date());
}
