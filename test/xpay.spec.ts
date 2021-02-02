import { AxiosWrapper } from "../src/axiosWrapper";
import { PaymentMethod, ServerSetting } from "../src/interfaces/payments";
import { Xpay } from "../src/xpay";
jest.mock("../src/AxiosWrapper");
const mockedAxiosWrapper = AxiosWrapper as jest.Mocked<typeof AxiosWrapper>;

describe("preparePayment method execute successfuly", () => {
  beforeAll(() => {
    mockedAxiosWrapper.prepareAmount.mockResolvedValue({
      total_amount: 50,
      total_amount_currency: "EGP",
      KIOSK: { total_amount: 50, total_amount_currency: "EGP" },
    });
  });

  test("returns a promise of prepare amount data successfuly", () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    return payment.preparePayment(50).then((data) => {
      expect(data).toStrictEqual({
        total_amount: 50,
        total_amount_currency: "EGP",
        KIOSK: { total_amount: 50, total_amount_currency: "EGP" },
      });
    });
  });

  test("sets activePaymentMethods property successfuly", () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    return payment.preparePayment(50).then((data) => {
      expect(payment.activePaymentMethods).toStrictEqual(["card", "kiosk"]);
    });
  });

  test("sets PaymentOptionsTotalAmounts property successfuly", () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    return payment.preparePayment(50).then((data) => {
      expect(payment.PaymentOptionsTotalAmounts).toStrictEqual({
        card: 50,
        kiosk: 50,
      });
    });
  });
});

describe("makePayment method execute successfuly", () => {
  beforeAll(() => {
    mockedAxiosWrapper.prepareAmount.mockResolvedValue({
      total_amount: 50,
      total_amount_currency: "EGP",
      KIOSK: { total_amount: 50, total_amount_currency: "EGP" },
    });

    mockedAxiosWrapper.pay.mockResolvedValue({
      iframe_url: null,
      transaction_id: 4647,
      transaction_status: "PENDING",
      transaction_uuid: "a9228983-8b98-47a2-b593-6eb5b71d06d8",
      message:
        "Please goto the nearest Aman kiosk and pay using this number: 375786263",
      bill_reference: 375786263,
    });
  });

  test("returns a promise of payData successfuly", async () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    await payment.preparePayment(50);

    return payment
      .makePayment(PaymentMethod.KIOSK, {
        name: "John Doe",
        email: "support@xpay.app",
        phone_number: "+201111111111",
      })
      .then((data) => {
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

  test("sends a customfield object with the payload if passed to the method", async () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    await payment.preparePayment(50);

    return payment
      .makePayment(
        PaymentMethod.KIOSK,
        {
          name: "John Doe",
          email: "support@xpay.app",
          phone_number: "+201111111111",
        },
        [
          { field_label: "field label 1", field_value: "field value 1" },
          { field_label: "field label 2", field_value: "field value 2" },
        ]
      )
      .then((data) => {
        expect(mockedAxiosWrapper.pay).toHaveBeenCalledWith(
          {
            community_id: payment.communityId,
            variable_amount_id: payment.apiPaymentId,
            currency: "EGP",
            amount: 50,
            pay_using: "kiosk",
            billing_data: {
              name: "John Doe",
              email: "support@xpay.app",
              phone_number: "+201111111111",
            },
            custom_fields: [
              { field_label: "field label 1", field_value: "field value 1" },
              { field_label: "field label 2", field_value: "field value 2" },
            ],
          },
          payment.apiKey,
          ServerSetting.Testing
        );
      });
  });

  test("sends the basic payload successfuly", async () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    await payment.preparePayment(50);

    return payment
      .makePayment(PaymentMethod.KIOSK, {
        name: "John Doe",
        email: "support@xpay.app",
        phone_number: "+201111111111",
      })
      .then((data) => {
        expect(mockedAxiosWrapper.pay).toHaveBeenCalledWith(
          {
            community_id: payment.communityId,
            variable_amount_id: payment.apiPaymentId,
            currency: "EGP",
            amount: 50,
            pay_using: "kiosk",
            billing_data: {
              name: "John Doe",
              email: "support@xpay.app",
              phone_number: "+201111111111",
            },
          },
          payment.apiKey,
          ServerSetting.Testing
        );
      });
  });

  test("sends the basic payload successfuly", async () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    await payment.preparePayment(50);

    return payment
      .makePayment(PaymentMethod.KIOSK, {
        name: "John Doe",
        email: "support@xpay.app",
        phone_number: "+201111111111",
      })
      .then((data) => {
        expect(payment.activePaymentMethods).toStrictEqual([]);
        expect(payment.PaymentOptionsTotalAmounts).toStrictEqual({});
      });
  });
});

describe("getTransaction method execute successfuly", () => {
  beforeAll(() => {
    mockedAxiosWrapper.getTransactionInfo.mockResolvedValue({
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

  test("returns a promise of TransactionData successfuly", async () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    return payment
      .getTransaction("c3b2c863-55e2-4411-aea8-de0bc01a6080")
      .then((data) => {
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

describe("getTransaction method execute successfuly", () => {
  beforeAll(() => {
    mockedAxiosWrapper.getTransactionInfo.mockResolvedValue({
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

  test("returns a promise of TransactionData successfuly", async () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    return payment
      .getTransaction("c3b2c863-55e2-4411-aea8-de0bc01a6080")
      .then((data) => {
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

describe("makePayment method throws", () => {
  beforeAll(() => {
    mockedAxiosWrapper.prepareAmount.mockResolvedValue({
      KIOSK: { total_amount: 50, total_amount_currency: "EGP" },
    });

    mockedAxiosWrapper.pay.mockResolvedValue({
      iframe_url: null,
      transaction_id: 4647,
      transaction_status: "PENDING",
      transaction_uuid: "a9228983-8b98-47a2-b593-6eb5b71d06d8",
      message:
        "Please goto the nearest Aman kiosk and pay using this number: 375786263",
      bill_reference: 375786263,
    });
  });

  test("phone number exception when phone number provided is not valid", async () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    await payment.preparePayment(50);
    return expect(() =>
      payment.makePayment(PaymentMethod.KIOSK, {
        name: "John Doe",
        email: "support@xpay.app",
        phone_number: "+20111111111",
      })
    ).toThrow(
      'Phone number: "+20111111111" provided in billing info is not valid'
    );
  });

  test("Full name exception when name provided is not valid", async () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    await payment.preparePayment(50);
    return expect(() =>
      payment.makePayment(PaymentMethod.KIOSK, {
        name: "John",
        email: "support@xpay.app",
        phone_number: "+201111111111",
      })
    ).toThrow('Name: "John" provided in billing info is not valid');
  });

  test("Email address exception when email provided is not valid", async () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    await payment.preparePayment(50);
    return expect(() =>
      payment.makePayment(PaymentMethod.KIOSK, {
        name: "John Doe",
        email: "support@xpay",
        phone_number: "+201111111111",
      })
    ).toThrow('E-mail: "support@xpay" provided in billing info is not valid');
  });

  test("Payment method exception when payment method provided is not available", async () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    await payment.preparePayment(50);
    return expect(() =>
      payment.makePayment(PaymentMethod.CARD, {
        name: "John Doe",
        email: "support@xpay",
        phone_number: "+201111111111",
      })
    ).toThrow(
      'payment method selected: "card" is not available in your community active payment methods: [kiosk]'
    );
  });
});

describe("Xpay class rethrow axioWrapper errors", () => {
  beforeAll(() => {
    mockedAxiosWrapper.prepareAmount.mockRejectedValue(
      JSON.stringify({
        community_id: ["Not found"],
      })
    );

    mockedAxiosWrapper.pay.mockRejectedValue(
      "server responsed with the following code: 401 and the following message: Unauthorized"
    );
  });

  test("community id is not found", () => {
    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
      "m2J7eBK",
      60
    );

    return payment.preparePayment(50).catch((e) => {
      expect(e).toStrictEqual(
        JSON.stringify({
          community_id: ["Not found"],
        })
      );
    });
  });

  test("unauthorized", async () => {
    mockedAxiosWrapper.prepareAmount.mockResolvedValue({
      total_amount: 50,
      total_amount_currency: "EGP",
      KIOSK: { total_amount: 50, total_amount_currency: "EGP" },
    });

    let payment = new Xpay(
      "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubk",
      "m2J7eBK",
      60
    );
    await payment.preparePayment(50);

    return payment
      .makePayment(PaymentMethod.KIOSK, {
        name: "John Doe",
        email: "support@xpay.app",
        phone_number: "+201111111111",
      })
      .catch((e) => {
        expect(e).toStrictEqual(
          "server responsed with the following code: 401 and the following message: Unauthorized"
        );
      });
  });
});
