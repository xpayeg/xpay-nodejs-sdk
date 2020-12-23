import { Xpay } from "../dist/xpay";
import { PaymentMethod } from "../dist/interfaces/payments";

let payment = new Xpay(
  "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
  "m2J7eBK",
  60
);

console.log("script started!");

payment.customFields = [
  { field_label: "field label 1", field_value: "field value 1" },
  { field_label: "field label 2", field_value: "field value 2" },
];

payment
  .preparePayment(50)
  .then((res) => {
    // console.log("preparedPaymentData: ", res);
    printPaymentSettings();
  })
  .then(() => {
    return payment.makePayment(
      PaymentMethod.KIOSK,
      {
        name: "Islam Rostom",
        email: "irostom@xpay.app",
        phone_number: "01119045759",
      }
      // [{ field_label: "hello", field_value: "you" }]
    );
  })
  .then((res) => {
    console.log("tx info: ", res);
    printPaymentSettings();
  })
  .catch((e) => {
    // console.log("error", e.response.data.status.errors[0]);
    console.log("error", e);
    throw new Error(e);
  });
console.log("bye, world!");

function printPaymentSettings() {
  console.log(
    "PaymentOptionsTotalAmounts: ",
    payment.PaymentOptionsTotalAmounts
  );
  console.log("activePaymentMethods: ", payment.activePaymentMethods);
  console.log("custom fields: ", payment.customFields);
}
