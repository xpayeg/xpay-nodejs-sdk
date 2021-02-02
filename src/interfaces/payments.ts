export enum PaymentMethod {
  CARD = "card",
  KIOSK = "kiosk",
}

export interface PaymentOptionsTotalAmounts {
  card: number;
  kiosk: number;
}

export enum ServerSetting {
  Testing = "testing",
  PRODUCTION = "production",
}
