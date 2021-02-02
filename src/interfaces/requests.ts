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
  billing_data: BillingInfo;
  custom_fields?: Customfield[];
}

export interface BillingInfo {
  name: string;
  email: string;
  phone_number: string;
}
