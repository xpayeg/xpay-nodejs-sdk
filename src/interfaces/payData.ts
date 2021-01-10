export interface PayData {
  iframe_url: string | null;
  transaction_id: number;
  transaction_status: string;
  transaction_uuid: string;
  message?: string;
  bill_reference?: number;
}
