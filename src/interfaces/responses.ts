import { PrepareAmountData } from "./prepareAmountData";
import { PayData } from "./payData";
import { TransactionData } from "./transactionData";
 interface Response {
  status: {
    code: number;
    message: string;
    errors: any[];
  };
  count: string | null;
  next: string | null;
  previous: string | null;
}

export interface PrepareAmountResponse extends Response {
  data: PrepareAmountData;
}

export interface PayResponse extends Response {
  data: PayData;
}

export interface TransactionResponse extends Response {
  data: TransactionData;
}
