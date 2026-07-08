export type PurchaseNoteTestData = {
  purchaseDate: string;
  note: string;
  purchaseQty: string;
  unitPrice: string;
};

export function createPurchaseNoteData(): PurchaseNoteTestData {
  const suffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, '')
    .slice(8, 14);

  return {
    purchaseDate: '2026-07-08',
    note: `Purchase note E2E-${suffix}`,
    purchaseQty: '10',
    unitPrice: '100',
  };
}
