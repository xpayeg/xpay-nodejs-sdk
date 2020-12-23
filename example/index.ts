import { Xpay } from "../dist/xpay";
import { PaymentMethod } from "../dist/interfaces/payments";
import { Utils } from "../dist/utils";

console.log("script started!");

let payment = new Xpay(
  "Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT",
  "m2J7eBK",
  60
);

// processPayment();
// getTransaction();

// console.log(Utils.validateName("john doe"));
// console.log(Utils.validateEmail("support@xpay.app"));
console.log(Utils.validatePhone("+201111111111"));

function getTransaction() {
  payment
    .getTransaction("c3b2c863-55e2-4411-aea8-de0bc01a6080")
    .then((res) => {
      console.log("Transaction data:", res);
    })
    .catch((e) => console.log(e));
}

function processPayment() {
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
          phone_number: "+201119045759",
        },
        [
          { field_label: "field label 1", field_value: "field value 1" },
          { field_label: "field label 2", field_value: "field value 2" },
        ]
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
}

function printPaymentSettings() {
  console.log(
    "PaymentOptionsTotalAmounts: ",
    payment.PaymentOptionsTotalAmounts
  );
  console.log("activePaymentMethods: ", payment.activePaymentMethods);
}
