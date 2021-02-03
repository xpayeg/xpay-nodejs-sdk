"use strict";
exports.__esModule = true;
var index_1 = require("../../dist/index");
var payments_1 = require("../../dist/interfaces/payments");
// console.log("script started!");
var payment = new index_1.Xpay("Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT", "m2J7eBK", 60);
processPayment();
// getTransaction();
// console.log(Utils.validateName("john doe"));
// console.log(Utils.validateEmail("support@xpay.app"));
// console.log(Utils.validatePhone("+201111111111"));
function getTransaction() {
    payment
        .getTransaction("c3b2c863-55e2-4411-aea8-de0bc01a6080")
        .then(function (res) {
        console.log("Transaction data:", res);
    })["catch"](function (e) { return console.log(e); });
}
function processPayment() {
    payment
        .preparePayment(50)
        .then(function (res) {
        console.log(res);
        printPaymentSettings();
    })
        .then(function () {
        return payment.makePayment(payments_1.PaymentMethod.KIOSK, {
            name: "Islam Rostom",
            email: "irostom@xpay.app",
            phone_number: "+201119045759"
        }, [
            { field_label: "field label 1", field_value: "field value 1" },
            { field_label: "field label 2", field_value: "field value 2" },
        ]);
    })
        .then(function (res) {
        console.log("tx info: ", res);
        printPaymentSettings();
    })["catch"](function (error) {
        var _a, _b;
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log((_b = (_a = error.response.data) === null || _a === void 0 ? void 0 : _a.status) === null || _b === void 0 ? void 0 : _b.errors[0]);
            console.log(error.response.status);
            console.log(error.response.statusText);
        }
        else if (error.request) {
            console.log("The request was made but no response was received");
            console.log("Request: ", error.request);
        }
        else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
        }
    });
}
function printPaymentSettings() {
    console.log("PaymentOptionsTotalAmounts: ", payment.PaymentOptionsTotalAmounts);
    console.log("activePaymentMethods: ", payment.activePaymentMethods);
}
