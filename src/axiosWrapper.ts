import axios, { AxiosPromise } from "axios";
import { PayData } from "./interfaces/payData";
import { ServerSetting } from "./interfaces/payments";
import { PrepareAmountData } from "./interfaces/prepareAmountData";
import { PayBody, PrepareAmountBody } from "./interfaces/requests";
import {
  PayResponse,
  PrepareAmountResponse,
  TransactionResponse,
} from "./interfaces/responses";
import { TransactionData } from "./interfaces/transactionData";

export namespace AxiosWrapper {
  axios.interceptors.response.use(
    (res) => res,
    (error) => {
      if (
        error.response &&
        (error.response.status?.toString() === "400" ||
          error.response.status?.toString() === "403" ||
          error.response.status?.toString() === "404")
      ) {
        return Promise.reject(
          Error(JSON.stringify(error.response.data?.status?.errors[0]))
        );
      } else if (error.response) {
        return Promise.reject(
          Error(
            `server responsed with the following code: ${error.response?.status} and the following message: ${error.response?.statusText}`
          )
        );
      } else if (error.request) {
        return Promise.reject(
          Error(
            "The request was made but no response was received, check your network connection"
          )
        );
      } else Promise.reject(error);
    }
  );

  // prepare amount endpoint

  let prepareAmountUrl =
    "https://staging.xpay.app/api/v1/payments/prepare-amount/";

  export function prepareAmount(
    prepareAmountBody: PrepareAmountBody,
    apiKey: string,
    server: ServerSetting
  ): Promise<PrepareAmountData> {
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
    }).then((data) => data.data.data);
  }

  // pay endpoint

  let payUrl = "https://staging.xpay.app/api/v1/payments/pay/variable-amount";

  export function pay(
    payBody: PayBody,
    apiKey: string,
    server: ServerSetting
  ): Promise<PayData> {
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
    }).then((data) => data.data.data);
  }

  // transaction endpoint

  let TransactionInfoUrl =
    "https://staging.xpay.app/api/v1/communities/{community_id}/transactions/{transaction_uuid}/";

  export function getTransactionInfo(
    uuid: string,
    apiKey: string,
    communityId: string,
    server: ServerSetting
  ): Promise<TransactionData> {
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
    }).then((data) => data.data.data);
  }
}
