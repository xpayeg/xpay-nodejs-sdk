export interface PrepareAmountData {
  total_amount?: number;
  total_amount_currency?: string;
  CASH?: TotalAmount;
  KIOSK?: TotalAmount;
}

interface TotalAmount {
  total_amount: number;
  total_amount_currency: string;
}
