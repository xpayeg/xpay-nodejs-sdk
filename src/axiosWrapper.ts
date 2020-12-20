// const axios = require('axios').default;
import axios, { AxiosResponse } from "axios";
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
  apiKey: string,
  success = (prepareAmountData: PrepareAmountData) => {}
) {
  axios({
    method: "post",
    url: prepareAmountUrl,
    data: {
      ...prepareAmountBody,
    },
    headers: {
      "x-api-key": apiKey,
    },
  })
    .then((data: AxiosResponse<PrepareAmountResponse>) => {
      success(data.data.data);
    })
    .catch((e) => {
      console.log("error", e.response);
    });
}

// pay endpoint

var payUrl = "https://staging.xpay.app/api/v1/payments/pay/variable-amount";

export function pay(
  payBody: PayBody,
  apiKey: string,
  success = (payData: PayData) => {}
) {
  axios({
    method: "post",
    url: payUrl,
    data: {
      ...payBody,
    },
    headers: {
      "x-api-key": apiKey,
    },
  })
    .then((data: AxiosResponse<PayResponse>) => {
      success(data.data.data);
    })
    .catch((e) => {
      console.log("error", e.response);
    });
}

// transaction endpoint

var TransactionInfoUrl =
  "https://staging.xpay.app/api/v1/communities/{community_id}/transactions/{transaction_uuid}/";

export function getTransactionInfo(
  uuid: string,
  apiKey: string,
  communityId: string,
  success = (TransactionData: TransactionData) => {}
) {
  TransactionInfoUrl.replace("{community_id}", communityId);
  TransactionInfoUrl.replace("{transaction_uuid}", uuid);
  axios({
    method: "get",
    url: TransactionInfoUrl,
    headers: {
      "x-api-key": apiKey,
    },
  })
    .then((data: AxiosResponse<TransactionResponse>) => {
      success(data.data.data);
    })
    .catch((e) => {
      console.log("error", e.response);
    });
}
