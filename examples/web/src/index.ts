import { Xpay } from "../../../dist/index";
// const Able = require("../../../dist");

let xpay = new Xpay("Cce74Y3B.J0P4tItq7hGu2ddhCB0WF5ND1eTubkpT", "m2J7eBK", 60);
console.log("hello, world!");
xpay.preparePayment(50);
console.log("bye, world!");
