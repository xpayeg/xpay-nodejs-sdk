import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { AxiosWrapper } from "../src/axiosWrapper";
import { ServerSetting } from "../src/interfaces/payments";
import { PayBody, PrepareAmountBody } from "../src/interfaces/requests";
import { PrepareAmountResponse } from "../src/interfaces/responses";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const communityId = "m2J7eBK";

const apiKey = "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT";

const server = ServerSetting.TESTING;

const prepareAmountBody: PrepareAmountBody = {
  amount: 50,
  community_id: communityId,
};

const payBody: PayBody = {
  variable_amount_id: 60,
  community_id: communityId,
  pay_using: "kiosk",
  amount: 50,
  currency: "EGP",
  billing_data: {
    name: "John Doe",
    email: "support@xpay.app",
    phone_number: "+201111111111",
  },
};

describe("AxiosWrapper methods execute successfuly", () => {
  test("prepareAmount returns a promise of prepareAmountData successfuly", () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        status: {
          code: 200,
          message: "success",
          errors: [],
        },
        data: {
          total_amount: 50.0,
          total_amount_currency: "EGP",
          KIOSK: {
            total_amount: 50.0,
            total_amount_currency: "EGP",
          },
        },
        count: null,
        next: null,
        previous: null,
      },
      status: 200,
    });

    return expect(
      AxiosWrapper.prepareAmount(prepareAmountBody, apiKey, server)
    ).resolves.toStrictEqual({
      total_amount: 50.0,
      total_amount_currency: "EGP",
      KIOSK: {
        total_amount: 50.0,
        total_amount_currency: "EGP",
      },
    });
  });

  test("pay returns a promise of payData successfuly", () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        status: {
          code: 200,
          message: "success",
          errors: [],
        },
        data: {
          iframe_url: null,
          transaction_id: 4647,
          transaction_status: "PENDING",
          transaction_uuid: "a9228983-8b98-47a2-b593-6eb5b71d06d8",
          message:
            "Please goto the nearest Aman kiosk and pay using this number: 375786263",
          bill_reference: 375786263,
        },
        count: null,
        next: null,
        previous: null,
      },
      status: 200,
    });

    return AxiosWrapper.pay(payBody, apiKey, server).then((data) => {
      expect(data).toStrictEqual({
        iframe_url: null,
        transaction_id: 4647,
        transaction_status: "PENDING",
        transaction_uuid: "a9228983-8b98-47a2-b593-6eb5b71d06d8",
        message:
          "Please goto the nearest Aman kiosk and pay using this number: 375786263",
        bill_reference: 375786263,
      });
    });
  });

  test("getTransaction returns a promise of TransactionData successfuly", () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        status: {
          code: 200,
          message: "success",
          errors: [],
        },
        data: {
          created: "2020-12-02T17:05:43.020966+02:00",
          id: 4442,
          uuid: "c3b2c863-55e2-4411-aea8-de0bc01a6080",
          member_id: null,
          total_amount: "225.50",
          total_amount_currency: "EGP",
          payment_for: "API_PAYMENT",
          quantity: null,
          status: "SUCCESSFUL",
          custom_fields_json: [
            { field_label: "color", field_value: "Pink" },
            { field_label: "size", field_value: "38" },
          ],
          total_amount_piasters: 22550,
        },
        count: null,
        next: null,
        previous: null,
      },
      status: 200,
    });

    return AxiosWrapper.getTransactionInfo(
      "c3b2c863-55e2-4411-aea8-de0bc01a6080",
      apiKey,
      communityId,
      server
    ).then((data) => {
      expect(data).toStrictEqual({
        created: "2020-12-02T17:05:43.020966+02:00",
        id: 4442,
        uuid: "c3b2c863-55e2-4411-aea8-de0bc01a6080",
        member_id: null,
        total_amount: "225.50",
        total_amount_currency: "EGP",
        payment_for: "API_PAYMENT",
        quantity: null,
        status: "SUCCESSFUL",
        custom_fields_json: [
          { field_label: "color", field_value: "Pink" },
          { field_label: "size", field_value: "38" },
        ],
        total_amount_piasters: 22550,
      });
    });
  });
});

describe("AxiosWrapper methods throws error", () => {

  // TODO
    
});
