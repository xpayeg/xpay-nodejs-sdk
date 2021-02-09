# xpay nodejs sdk (xpay-payments-sdk)

## Whats is xpay-payments-sdk

- It is an SDK for using xpay online payment processing services for node js projects

## What can it be used for?

- It can be used to integrate online payment services in your node js app

## Installation

Using npm:

```bash
npm i xpay-payments-sdk
```

## Usage

for CommonJS require

```javascript
const xpay = require("xpay-payments-sdk").Xpay;
const paymentMethod = require("xpay-payments-sdk").PaymentMethod;
```

for ECMA 6 import

```javascript
import {
  Xpay as xpay,
  PaymentMethod as paymentMethod,
} from "xpay-payments-sdk";
```

### processing payment

```javascript
// Initialize a new payment object with your API key, community id and payment id
let payment = new xpay(
  "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
  "m2J7eBK",
  60
);

// Prepare a new payment by calline preparePayment method and passing it the total amount of the user cart, invoice, etc..
payment
  .preparePayment(50)
  .then((res) => {
    // The returned value is of type TransactionData and contains available payment method and total amount for each method in one object
    console.log("transaction data:", res);
    // We recommend reading those values from activePaymentMethods and PaymentOptionsTotalAmounts properties that gets set internally in the payment object after preparePayment() method is executed successfully

    // Read the currently available payment methods from activePaymentMethods
    console.log("activePaymentMethods: ", payment.activePaymentMethods);

    // Read the total amount for each available payment method from PaymentOptionsTotalAmounts
    console.log(
      "PaymentOptionsTotalAmounts: ",
      payment.PaymentOptionsTotalAmounts
    );
  })
  .catch((e) => console.log(e));

// 1- Display the payment methods and it's total amounts to the user
// 2- User chooses the payment method and continue to complete the payment
const chosenMethod = paymentMethodEnums.CARD;
// 3- Get user's billing information from user or from your app data
const billingInformation = {
  name: "John Doe",
  email: "support@xpay.app",
  phone_number: "+201111111111",
};

// Complete payment by calling makePayment() method by passing the the Enum value corresponding to the chosen payment method and a BillingInfo object containing user's billing info
payment.makePayment(chosenMethod, billingInformation).then((res) => {
  // if the request was successful it will return a payData object which contains the data required to complete the payment
  console.log("tx info: ", res);
  // if the chosen payment method is CARD the iframe_url property inside payData will contain a URL value that you navigate your user to (or embed in your app) which contain the creditcard form, Otherwise the value is null.
  console.log("credicard form url: ", res.iframe_url);

  // if the chosen payment method is KIOSK the bill_reference and message properties inside payData will contain AMAN payment refrence that you send/display to your user, Otherwise the value is null.
  console.log("tx info: ", res.bill_reference);
  console.log("tx info: ", res.message);

  // get current transaction data
  console.log("tx info: ", res.transaction_id);
  console.log("tx info: ", res.transaction_uuid);
  console.log("tx info: ", res.status);
});
```

### Get transaction info

```javascript
// Initialize a new payment object with your API key, community id and payment id
let payment = new xpay(
  "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
  "m2J7eBK",
  60
);
// get any transaction info at any time by passing the transaction UUID to getTransaction() method
payment
  .getTransaction("c3b2c863-55e2-4411-aea8-de0bc01a6080")
  .then((res) => {
    console.log("Transaction data:", res);
  })
  .catch((e) => console.log(e));
```

### Saving extra information with the payment using custom fields

Depending on your use case, you might want to save extra information with the payment
ex: cart details, user billing address, etc..
You can do this by passing an optional array of Customfield objects that contains the information you wish to save to makePayment() method
ex:

```javascript
payment.makePayment(
  paymentMethodEnums.KIOSK,
  {
    name: "John Doe",
    email: "support@xpay.app",
    phone_number: "+201111111111",
  },
  [
    { field_label: "field label 1", field_value: "field value 1" },
    { field_label: "field label 2", field_value: "field value 2" },
  ]
);
```

### Switching between testing and production servers

By default when you initialize a new payment object, it defaults to XPay's testing server if you wish you can pass a server settings option to choose which server you wish to process your requests on

#### Testing server

```javascript
let payment = new xpay(
  "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
  "m2J7eBK",
  60
);
```

or

```javascript
let payment = new xpay(
  "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
  "m2J7eBK",
  60,
  ServerSetting.Testing
);
```

#### Production server

Note that the values provided for API key, community ID and PAyment ID is for testing purposes only and won't work on the production server, you need to pass your own credentails obtained from our production dashboard using your community admin account.

```javascript
let payment = new xpay(
  "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
  "m2J7eBK",
  60,
  ServerSetting.Production
);
```

## More Examples

Check the example folder for more examples

## API reference

### Classes

#### Xpay

##### Constructor

| Name          | Type          | Notes                                                                      |
| ------------- | ------------- | -------------------------------------------------------------------------- |
| apiKey        | string        | [How to create an API key](https://xpayeg.github.io/docs/api-key)          |
| communityId   | string        | [How to get your community ID](https://xpayeg.github.io/docs/community-id) |
| apiPaymentId  | number        | [How to create API payment ID](https://xpayeg.github.io/docs/api-payments) |
| serverSetting | ServerSetting | [ServerSetting](#serversetting)                                            |

Note:

Make sure to set the values of apiKey, communityId, apiPaymentId with values from the production dashboard when setting serverSetting to production.

##### properties

| Name                       | Describtion                                                                                                         | Type                                                      | Notes         |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------------- |
| activePaymentMethods       | Available payment methods available for your community.                                                             | [PaymentMethod[]](#paymentmethods)                        | **Read only** |
| PaymentOptionsTotalAmounts | Total amount for the prepared amount after adding fees (if any) for each payment method available to your community | [PaymentOptionsTotalAmounts](#paymentoptionstotalamounts) | **Read only** |

##### Methods

###### preparePayment

This methods takes the total amount you want to charge the user(in EGP) and does the following:

1. Gets the active payment methods available to your community and set them in activePaymentMethods.
2. Gets the total amount including fees (if any) for each active payment method and set them in PaymentOptionsTotalAmounts.
3. Returns a **Promise** of PrepareAmountData object which represents the total amount including fees (if any) for each active payment method.

###### makePayment

This methods takes the following inputs

| Name          | Type                             | Notes    |
| ------------- | -------------------------------- | -------- |
| paymentMethod | [PaymentMethod](#paymentmethods) | required |
| billingInfo   | [BillingInfo](#billinginfo)      | required |
| customFields  | [Customfield[]](#customfield)    | Optional |

and does the following:

1. Returns a **promise** of PayData which contains payment information like the credit card from url or the reference number for Aman payments.
2. Clear activePaymentMethods list and PaymentOptionsTotalAmounts properties.

###### getTransaction

This methods takes the UUID of the transaction you want to retrieve its data and returns a **promise** of TransactionData which contains transaction info like status, creation date and time, customFields that were saved with the transaction, etc..

---

### Enums

### ServerSetting

#### Values

- TESTING
- PRODUCTION

### PaymentMethods

#### Values

- CARD
- KIOSK

---

### Interfaces

### PaymentOptionsTotalAmounts

| Name  | Type           |
| ----- | -------------- |
| card  | Number or Null |
| kiosk | Number or Null |

### BillingInfo

| Name  | Type   | Regex pattern                                                        |
| ----- | ------ | -------------------------------------------------------------------- |
| name  | string | `/^[a-zA-Z\u0621-\u064A-]{3,}(?:\s[a-zA-Z\u0621-\u064A-]{3,})+\$/`   |
| email | string | `/^[a-z0-9._%+-]+@[a-z.-]+[.][a-z]{2,4}$/`                           |
| phone | string | [E.164 international standard ](https://en.wikipedia.org/wiki/E.164) |

### CustomField

| Name        | Type   |
| ----------- | ------ |
| field_label | String |
| field_value | String |

### PrepareAmountData

| Name                  | Type                        |
| --------------------- | --------------------------- |
| total_amount          | number                      |
| total_amount_currency | String                      |
| KIOSK                 | [TotalAmount](#totalamount) |

### TotalAmount

| Name                  | Type   |
| --------------------- | ------ |
| total_amount          | number |
| total_amount_currency | String |

### PayData

| Property name      | Type    |
| ------------------ | ------- |
| iframe_url         | string  |
| transaction_id     | integer |
| transaction_uuid   | string  |
| transaction_status | string  |
| message            | string  |
| bill_reference     | number  |

### TransactionData

| Name                  | Type           |
| --------------------- | -------------- |
| created               | string         |
| id                    | number         |
| uuid                  | string         |
| member_id             | string or null |
| total_amount          | string         |
| total_amount_currency | string         |
| payment_for           | string         |
| quantity              | string or null |
| status                | string         |
| custom_fields_json    | Customfield[]  |
| total_amount_piasters | number         |
