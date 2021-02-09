import { AxiosWrapper } from "./axiosWrapper";
import { Customfield } from "./interfaces/customField";
import { PayData } from "./interfaces/payData";
import {
  PaymentMethod,
  PaymentOptionsTotalAmounts,
  ServerSetting,
} from "./interfaces/payments";
import { PrepareAmountData } from "./interfaces/prepareAmountData";
import { PayBody, PrepareAmountBody, BillingInfo } from "./interfaces/requests";
import { TransactionData } from "./interfaces/transactionData";
import { Utils } from "./utils";

export class Xpay {
  apiKey: string;
  communityId: string;
  apiPaymentId: number;
  serverSetting: ServerSetting;

  private _activePaymentMethods: PaymentMethod[];
  public get activePaymentMethods(): PaymentMethod[] {
    return this._activePaymentMethods;
  }

  private _PaymentOptionsTotalAmounts: PaymentOptionsTotalAmounts;
  public get PaymentOptionsTotalAmounts(): PaymentOptionsTotalAmounts {
    return this._PaymentOptionsTotalAmounts;
  }

  constructor(
    apiKey: string,
    communityId: string,
    apiPaymentId: number,
    serverSetting?: ServerSetting
  ) {
    this.apiKey = apiKey;
    this.communityId = communityId;
    this.apiPaymentId = apiPaymentId;
    this.serverSetting = serverSetting ? serverSetting : ServerSetting.TESTING;
    this._activePaymentMethods = [];
    this._PaymentOptionsTotalAmounts = {} as PaymentOptionsTotalAmounts;
  }

  preparePayment(amount: number): Promise<PrepareAmountData> {
    const prepareAmountBody: PrepareAmountBody = {
      amount: amount,
      community_id: this.communityId,
    };
    return AxiosWrapper.prepareAmount(
      prepareAmountBody,
      this.apiKey,
      this.serverSetting
    ).then((response: PrepareAmountData) => {
      const preparedPayment = response;
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
    });
  }

  makePayment(
    paymentMethod: PaymentMethod,
    billingInfo: BillingInfo,
    customFields?: Customfield[]
  ): Promise<PayData> {
    /* check if the community have any active payment methods
    and if the chosen payment method is found in them and
    if a total amount is found for the chosen payment method */
    if (
      this._activePaymentMethods.length > 0 &&
      this._activePaymentMethods.includes(paymentMethod) &&
      this._PaymentOptionsTotalAmounts[paymentMethod]
    ) {
      if (Utils.validateName(billingInfo.name)) {
        if (Utils.validateEmail(billingInfo.email)) {
          if (Utils.validatePhone(billingInfo.phone_number)) {
            // prepare pay endpoint request body
            const payRequestBody: PayBody = {
              community_id: this.communityId,
              variable_amount_id: this.apiPaymentId,
              currency: "EGP",
              amount: this._PaymentOptionsTotalAmounts[paymentMethod],
              pay_using: paymentMethod,
              billing_data: billingInfo,
            };

            if (customFields) {
              payRequestBody.custom_fields = customFields;
            }

            // request payment
            return AxiosWrapper.pay(
              payRequestBody,
              this.apiKey,
              this.serverSetting
            ).then((response: PayData) => {
              // clear current payment settings
              this._PaymentOptionsTotalAmounts = {} as PaymentOptionsTotalAmounts;
              this._activePaymentMethods = [];
              // return payment info
              return response;
              // return response.data.data;
            });
          } else {
            throw new Error(
              `Phone number: "${billingInfo.phone_number}" provided in billing info is not valid`
            );
          }
        } else {
          throw new Error(
            `E-mail: "${billingInfo.email}" provided in billing info is not valid`
          );
        }
      } else {
        throw new Error(
          `Name: "${billingInfo.name}" provided in billing info is not valid`
        );
      }
    } else {
      throw new Error(
        `payment method selected: "${paymentMethod}" is not available in your community active payment methods: [${this._activePaymentMethods}]`
      );
    }
  }

  getTransaction(uuid: string): Promise<TransactionData> {
    return AxiosWrapper.getTransactionInfo(
      uuid,
      this.apiKey,
      this.communityId,
      this.serverSetting
    ).then((response) => {
      return response;
    });
  }
}
