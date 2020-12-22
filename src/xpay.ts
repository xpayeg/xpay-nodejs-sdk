import { AxiosResponse } from "axios";
import { prepareAmount } from "./axiosWrapper";
import {
  PaymentMethods,
  PaymentOptionsTotalAmounts,
} from "./interfaces/payments";
import { PrepareAmountBody } from "./interfaces/requests";
import { PrepareAmountResponse } from "./interfaces/responses";

export namespace Xpay {
  export class payment {
    apiKey: string;
    communityId: string;
    apiPaymentId: number;

    private _activePaymentMethods: PaymentMethods[];
    public get activePaymentMethods(): PaymentMethods[] {
      return this._activePaymentMethods;
    }

    private _PaymentOptionsTotalAmounts: PaymentOptionsTotalAmounts;
    public get PaymentOptionsTotalAmounts(): PaymentOptionsTotalAmounts {
      return this._PaymentOptionsTotalAmounts;
    }

    constructor(apiKey: string, communityId: string, apiPaymentId: number) {
      this.apiKey = apiKey;
      this.communityId = communityId;
      this.apiPaymentId = apiPaymentId;
      this._activePaymentMethods = [];
      this._PaymentOptionsTotalAmounts = new PaymentOptionsTotalAmounts();
      // this.apiKey = "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT";
      // this.communityId = "m2J7eBK";
      // this.apiPaymentId = 60;
    }

    preparePayment(amount: number) {
      const prepareAmountBody: PrepareAmountBody = {
        amount: amount,
        community_id: this.communityId,
      };
      return prepareAmount(prepareAmountBody, this.apiKey)
        .then((data: AxiosResponse<PrepareAmountResponse>) => {
          const preparedPayment = data.data.data;
          // console.log(preparedPayment);
          if (preparedPayment?.total_amount) {
            this._activePaymentMethods?.push(PaymentMethods.CARD);
            this._PaymentOptionsTotalAmounts.card =
              preparedPayment.total_amount;
          }
          if (preparedPayment?.KIOSK?.total_amount) {
            this._activePaymentMethods?.push(PaymentMethods.KIOSK);
            this._PaymentOptionsTotalAmounts.kiosk =
              preparedPayment.KIOSK.total_amount;
          }
          return preparedPayment;
        })
        .catch((e) => {
          console.log("error", e.response);
          throw new Error(e);
        });
    }

    printToConsole(m: any) {
      console.log(m);
    }
  }
}
