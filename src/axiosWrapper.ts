import axios, { AxiosPromise } from "axios";
import { ServerSetting } from "./interfaces/payments";
import { PayBody, PrepareAmountBody } from "./interfaces/requests";
import {
  PayResponse,
  PrepareAmountResponse,
  TransactionResponse,
} from "./interfaces/responses";

// prepare amount endpoint

let prepareAmountUrl =
  "https://staging.xpay.app/api/v1/payments/prepare-amount/";

export function prepareAmount(
  prepareAmountBody: PrepareAmountBody,
  apiKey: string,
  server: ServerSetting
): AxiosPromise<PrepareAmountResponse> {
  if (server === ServerSetting.PRODUCTION) {
    prepareAmountUrl = prepareAmountUrl.replace("staging", "community");
  }
  return axios({
    method: "post",
    url: prepareAmountUrl,
    data: {
      ...prepareAmountBody,
    },
    headers: {
      "x-api-key": apiKey,
    },
  }).catch((error) => {
    if (
      error.response &&
      (error.response.status?.toString() === "400" ||
        error.response.status?.toString() === "403")
    ) {
      throw new Error(JSON.stringify(error.response.data?.status?.errors[0]));
    } else if (error.request) {
      throw new Error(
        "The request was made but no response was received, check your network connection"
      );
    } else throw error;
  });
}

// pay endpoint

let payUrl = "https://staging.xpay.app/api/v1/payments/pay/variable-amount";

export function pay(
  payBody: PayBody,
  apiKey: string,
  server: ServerSetting
): AxiosPromise<PayResponse> {
  if (server === ServerSetting.PRODUCTION) {
    payUrl = payUrl.replace("staging", "community");
  }
  return axios({
    method: "post",
    url: payUrl,
    data: {
      ...payBody,
    },
    headers: {
      "x-api-key": apiKey,
    },
  }).catch((error) => {
    if (
      error.response &&
      (error.response.status?.toString() === "400" ||
        error.response.status?.toString() === "403")
    ) {
      throw new Error(JSON.stringify(error.response.data?.status?.errors[0]));
    } else if (error.request) {
      throw new Error(
        "The request was made but no response was received, check your network connection"
      );
    } else throw error;
  });
}

// transaction endpoint

let TransactionInfoUrl =
  "https://staging.xpay.app/api/v1/communities/{community_id}/transactions/{transaction_uuid}/";

export function getTransactionInfo(
  uuid: string,
  apiKey: string,
  communityId: string,
  server: ServerSetting
): AxiosPromise<TransactionResponse> {
  TransactionInfoUrl = TransactionInfoUrl.replace(
    "{community_id}",
    communityId
  );
  TransactionInfoUrl = TransactionInfoUrl.replace("{transaction_uuid}", uuid);
  if (server === ServerSetting.PRODUCTION) {
    TransactionInfoUrl = TransactionInfoUrl.replace("staging", "community");
  }
  return axios({
    method: "get",
    url: TransactionInfoUrl,
    headers: {
      "x-api-key": apiKey,
    },
  });
}

function handleErrors(error: any) {
  if (
    error.response &&
    (error.response.status?.toString() === "400" ||
      error.response.status?.toString() === "403")
  ) {
    throw new Error(JSON.stringify(error.response.data?.status?.errors[0]));
  } else if (error.request) {
    throw new Error(
      "The request was made but no response was received, check your network connection"
    );
  } else throw error;
}
