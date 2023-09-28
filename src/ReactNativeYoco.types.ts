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

export type GetPaymentResultParams = {
  transactionId: string;
  /** Show result, success or error (more info: https://developer.yoco.com/in-person/android/show-transaction-result-android) */
  showResult?: boolean;
};

export type ReceiptInfo = {
  authorizationCode?: string;
  transactionTime?: string;
};

export type PaymentResult = {
  resultCode?: string;
  errorMessage?: string;
  amountInCents?: number;
  tipInCents?: number;
  finalAmountInCents?: number;
  paymentType?: PaymentType;
  currency?: SupportedCurrency;
  transactionId?: string;
  clientTransactionId?: string;
  receiptInfo?: ReceiptInfo;
};

export type QueryTransactionsParams = {
  receiptNumber: string;
};

export type QueryTransactionsResult = {
  resultCode?: string;
  errorMessage?: string;
  transactions?: PaymentResult[];
};

export type StaffMember = {
  name: string; // Name of the staff member who is initiating the payment.
  staffNumber: number; // A unique identifier for the staff member.
};

export type RefundParams = {
  transactionId: string;
  amountInCents: number; // An amount in cents to be refunded of the full amount
  userInfo?: Record<string, any>; // Store data you would like to receive back on completion of the payment. This data only exists locally.
  staffMember?: StaffMember; // A staff member object that can be used to assign staff member meta data to the transaction.
};

export type RefundResult = PaymentResult & {};
