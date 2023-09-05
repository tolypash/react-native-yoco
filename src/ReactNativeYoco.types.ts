import { PaymentType, SupportedCurrency } from "./ReactNativeYocoEnums";

export type ChangeEventPayload = {
  value: string;
};

export type ConfigureParams = {
  secret: string;
};

export type PaymentParameters = {
  receiptDelegate?: unknown;
  userInfo?: Record<string, unknown>;
  staffMember?: unknown; // YocoStaff
  note?: string;
  billId?: string;
  receiptNumber?: string;
};

export type ChargeParams = {
  amountInCents: number;
  paymentType: PaymentType;
  currency: SupportedCurrency;
  /** Pass undefined or null to not ask for tip, 0 to ask and pass a valid number to include tip in amount */
  tipInCents?: number | null;
  paymentParameters?: PaymentParameters;
};

export type ChargeResult = {
  resultCode?: string;
  errorMessage?: string;
  amountInCents?: number;
  paymentType?: PaymentType;
  currency?: SupportedCurrency;
  tipInCents?: number;
};

export type GetPaymentResultParams = {
  transactionId: string;
};

export type PaymentResult = {
  resultCode?: string;
  errorMessage?: string;
  amountInCents?: number;
  paymentType?: PaymentType;
  currency?: SupportedCurrency;
  tipInCents?: number;
  finalAmountInCents?: number;
  clientTransactionId?: string;
};
