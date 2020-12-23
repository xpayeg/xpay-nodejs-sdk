// const axios = require('axios').default;
import axios, { AxiosPromise, AxiosResponse } from "axios";
import { PayBody, PrepareAmountBody } from "./interfaces/requests";
import { PrepareAmountData } from "./interfaces/prepareAmountData";
import {
  PayResponse,
  PrepareAmountResponse,
  TransactionResponse,
} from "./interfaces/responses";
import { PayData } from "./interfaces/payData";
import { TransactionData } from "./interfaces/transactionData";

// prepare amount endpoint

const prepareAmountUrl =
  "https://staging.xpay.app/api/v1/payments/prepare-amount/";

export function prepareAmount(
  prepareAmountBody: PrepareAmountBody,
  apiKey: string
): AxiosPromise<PrepareAmountResponse> {
  return axios({
    method: "post",
    url: prepareAmountUrl,
    data: {
      ...prepareAmountBody,
    },
    headers: {
      "x-api-key": apiKey,
    },
  });
}

// pay endpoint

var payUrl = "https://staging.xpay.app/api/v1/payments/pay/variable-amount";

export function pay(
  payBody: PayBody,
  apiKey: string
): AxiosPromise<PayResponse> {
  return axios({
    method: "post",
    url: payUrl,
    data: {
      ...payBody,
    },
    headers: {
      "x-api-key": apiKey,
    },
  });
}

// transaction endpoint

var TransactionInfoUrl =
  "https://staging.xpay.app/api/v1/communities/{community_id}/transactions/{transaction_uuid}/";

export function getTransactionInfo(
  uuid: string,
  apiKey: string,
  communityId: string
): AxiosPromise<TransactionResponse> {
  TransactionInfoUrl = TransactionInfoUrl.replace("{community_id}", communityId);
  TransactionInfoUrl = TransactionInfoUrl.replace("{transaction_uuid}", uuid);
  console.log(TransactionInfoUrl);
  
  return axios({
    method: "get",
    url: TransactionInfoUrl,
    headers: {
      "x-api-key": apiKey,
    },
  });
}
