"use strict";
exports.__esModule = true;
var xpay_1 = require("../../dist/xpay");
var payments_1 = require("../../dist/interfaces/payments");
var payment = new xpay_1.Xpay("Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT", "m2J7eBK", 60);
console.log("hello, world!");
payment
    .preparePayment(50)
    .then(function (res) {
    console.log("preparedPaymentData: ", res);
    console.log("PaymentOptionsTotalAmounts: ", payment.PaymentOptionsTotalAmounts);
    console.log("activePaymentMethods: ", payment.activePaymentMethods);
})
    .then(function () {
    return payment.makePayment(payments_1.PaymentMethod.KIOSK, {
        name: "Islam Rostom",
        email: "irostom@xpay.app",
        phone_number: "01119045759"
    }, [{ field_label: "hello", field_value: "you" }]);
})
    .then(function (res) {
    console.log("tx: ", res);
})["catch"](function (e) {
    // console.log("error", e.response.data.status.errors[0]);
    console.log("error", e);
    throw new Error(e);
});
console.log("bye, world!");
