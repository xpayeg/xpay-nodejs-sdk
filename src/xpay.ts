import { prepareAmount } from "./axiosWrapper";
import { PrepareAmountData } from "./interfaces/prepareAmountData";
import { PrepareAmountBody } from "./interfaces/requests";

export class Xpay {
  apiKey: string;
  communityId: string;
  apiPaymentId: number;
  constructor(apiKey: string, communityId: string, apiPaymentId: number) {
    this.apiKey = apiKey;
    this.communityId = communityId;
    this.apiPaymentId = apiPaymentId;
    // this.apiKey = "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT";
    // this.communityId = "m2J7eBK";
    // this.apiPaymentId = 60;
  }

  preparePayment(amount: number) {
    const prepareAmountBody: PrepareAmountBody = {
      amount: amount,
      community_id: this.communityId,
    };
    prepareAmount(prepareAmountBody, this.apiKey, this.printToConsole);
  }

  printToConsole(m: any) {
    console.log(m);
  }
}
