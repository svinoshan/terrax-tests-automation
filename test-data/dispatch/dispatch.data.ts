export type DispatchTestData = {
  dispatchToSearch: string;
  dispatchDate: string;
  dispatchBy: string;
  vehicleNo: string;
  note: string;
};

export function createDispatchData(): DispatchTestData {
  const suffix = new Date()
    .toISOString()
    .replace(/[-:.TZ]/g, "")
    .slice(8, 14);

  return {
    dispatchToSearch: process.env.DISPATCH_TO_SEARCH ?? "John",
    dispatchDate: "2026-07-08",
    dispatchBy: `Dispatch User E2E-${suffix}`,
    vehicleNo: `VEH-E2E-${suffix}`,
    note: `Dispatch Note E2E-${suffix}`,
  };
}

export const dispatchConfig = {
  maxDispatchQty: Number(process.env.DISPATCH_MAX_QTY ?? 100),
  dispatchPriceMarkup: Number(process.env.DISPATCH_PRICE_MARKUP ?? 10),
};

export type DispatchLineValueOptions = {
  maxDispatchQty?: number;
  quantityDecimals?: number;
  priceMarkup?: number;
  maxDispatchPrice?: number;
  fallbackDispatchPrice?: number;
};

export const defaultDispatchLineValueOptions: Required<DispatchLineValueOptions> =
  {
    maxDispatchQty: Number(process.env.DISPATCH_MAX_QTY ?? 100),
    quantityDecimals: Number(process.env.DISPATCH_QTY_DECIMALS ?? 2),
    priceMarkup: Number(process.env.DISPATCH_PRICE_MARKUP ?? 10),
    maxDispatchPrice: Number(process.env.DISPATCH_MAX_PRICE ?? 999999),
    fallbackDispatchPrice: Number(process.env.DISPATCH_FALLBACK_PRICE ?? 45),
  };
