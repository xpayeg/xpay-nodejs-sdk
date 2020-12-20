import { Customfield } from "./customField";

export interface PrepareAmountBody {
  community_id: string;
  amount: number;
}

export interface PayBody {
  variable_amount_id: number;
  community_id: string;
  pay_using: string;
  amount: number;
  currency: string;
  custom_fields: Customfield;
  billing_data: BillingInfo;
}

interface BillingInfo {
  name: string;
  email: string;
  phone: string;
}
