import { requireNativeModule } from "expo";
import {
  PaymentParameters,
  PaymentResult,
  QueryTransactionsResult,
  RefundResult,
  StaffMember,
} from "./ReactNativeYoco.types";
import {
  PaymentType,
  ResultCodes,
  SupportedCurrency,
} from "./ReactNativeYocoEnums";

declare class ReactNativeYocoModule {
  initialise(): void;
  configure(secret: string): void;
  getDeviceType(): string;
  pairTerminal(): Promise<ResultCodes>;
  charge(
    amountInCents: number,
    paymentType: PaymentType,
    currency: SupportedCurrency,
    tipInCents: number | null | undefined,
    paymentParameters: PaymentParameters | undefined
  ): Promise<PaymentResult>;
  getPaymentResult: (
    transactionId: string,
    showResult: boolean
  ) => Promise<PaymentResult>;
  refund: (
    transactionId: string,
    amountInCents: number,
    userInfo: Record<string, any> | undefined,
    staffMember: StaffMember | undefined
  ) => Promise<RefundResult>;
  queryTransactions: (
    receiptNumber: string
  ) => Promise<QueryTransactionsResult>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<ReactNativeYocoModule>("ReactNativeYoco");
