import { Customfield } from "./customField";

export interface TransactionData {
  created: string;
  id: number;
  uuid: string;
  member_id: string | null;
  total_amount: string;
  total_amount_currency: string;
  payment_for: string;
  quantity: string | null;
  status: string;
  custom_fields_json: Customfield[];
  total_amount_piasters: number;
}
