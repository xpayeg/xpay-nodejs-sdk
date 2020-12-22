export enum PaymentMethod {
  CARD = "card",
  KIOSK = "kiosk",
}

export interface PaymentOptionsTotalAmounts {
  card: number;
  kiosk: number;
}

// export class PaymentOptionsTotalAmounts {
//   card?: number;
//   kiosk?: number;
//   constructor() {}
// }