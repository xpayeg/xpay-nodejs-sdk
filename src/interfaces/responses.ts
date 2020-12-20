import { PrepareAmountData } from "./prepareAmountData";
import { PayData } from "./payData";
import { TransactionData } from "./transactionData";

interface Response {
  status: {
    code: number;
    message: string;
    errors: [];
  };
  count: string;
  next: string;
  previous: string;
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
