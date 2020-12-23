import { AxiosResponse } from "axios";
import { getTransactionInfo, pay, prepareAmount } from "./axiosWrapper";
import { Customfield } from "./interfaces/customField";
import { PayData } from "./interfaces/payData";
import {
  PaymentMethod,
  PaymentOptionsTotalAmounts,
} from "./interfaces/payments";
import { PrepareAmountData } from "./interfaces/prepareAmountData";
import { PayBody, PrepareAmountBody, BillingInfo } from "./interfaces/requests";
import {
  PayResponse,
  PrepareAmountResponse,
  TransactionResponse,
} from "./interfaces/responses";
import { TransactionData } from "./interfaces/transactionData";
import { Utils } from "./utils";

// export namespace Xpay {
export class Xpay {
  apiKey: string;
  communityId: string;
  apiPaymentId: number;

  private _activePaymentMethods: PaymentMethod[];
  public get activePaymentMethods(): PaymentMethod[] {
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
    this._PaymentOptionsTotalAmounts = {} as PaymentOptionsTotalAmounts;
    // this.apiKey = "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT";
    // this.communityId = "m2J7eBK";
    // this.apiPaymentId = 60;
  }

  preparePayment(amount: number): Promise<PrepareAmountData> {
    const prepareAmountBody: PrepareAmountBody = {
      amount: amount,
      community_id: this.communityId,
    };
    return prepareAmount(prepareAmountBody, this.apiKey).then(
      (response: AxiosResponse<PrepareAmountResponse>) => {
        const preparedPayment = response.data.data;
        // console.log(preparedPayment);
        if (preparedPayment?.total_amount) {
          this._activePaymentMethods?.push(PaymentMethod.CARD);
          this._PaymentOptionsTotalAmounts.card = preparedPayment.total_amount;
        }
        if (preparedPayment?.KIOSK?.total_amount) {
          this._activePaymentMethods?.push(PaymentMethod.KIOSK);
          this._PaymentOptionsTotalAmounts.kiosk =
            preparedPayment.KIOSK.total_amount;
        }
        return preparedPayment;
      }
    );
  }

  makePayment(
    paymentMethod: PaymentMethod,
    billingInfo: BillingInfo,
    customFields: Customfield[]
  ): Promise<PayData> {
    // check if the community have any active payment methods
    // and if the chosen payment method is found in them
    if (
      this._activePaymentMethods.length > 0 &&
      this._activePaymentMethods.includes(paymentMethod)
    ) {
      // if a total amount is found for the chosen payment method
      if (this._PaymentOptionsTotalAmounts[paymentMethod]) {
        if (
          Utils.validateName(billingInfo.name) &&
          Utils.validateEmail(billingInfo.email)
        ) {
          // prepare pay endpoint request body
          const payRequestBody: PayBody = {
            community_id: this.communityId,
            variable_amount_id: this.apiPaymentId,
            currency: "EGP",
            amount: this._PaymentOptionsTotalAmounts[paymentMethod],
            pay_using: paymentMethod,
            billing_data: billingInfo,
            custom_fields: customFields,
          };
          // request payment
          return pay(payRequestBody, this.apiKey).then(
            (response: AxiosResponse<PayResponse>) => {
              const payData = response.data.data;
              // clear current payment settings
              this._PaymentOptionsTotalAmounts = {} as PaymentOptionsTotalAmounts;
              this._activePaymentMethods = [];
              // return payment info
              return payData;
            }
          );
        } else throw new Error("billing info is not valid");
      } else throw new Error("error 2");
    } else throw new Error(`${paymentMethod} is not available`);
  }

  getTransaction(uuid: string): Promise<TransactionData> {
    return getTransactionInfo(uuid, this.apiKey, this.communityId).then(
      (response: AxiosResponse<TransactionResponse>) => {
        const preparedPayment = response.data.data;
        // console.log(preparedPayment);
        return preparedPayment;
      }
    );
  }

  throwError(m: any) {
    console.log(m);
  }
}
// }
