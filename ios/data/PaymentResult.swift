import ExpoModulesCore
import YocoSDK

struct ReceiptInfo: Record {
    init() {}

    @Field
    var authorizationCode: String? = nil

    @Field
    var transactionTime: String? = nil

    init(receiptInfo: YocoSDK.ReceiptInfo?) {
        self.authorizationCode = receiptInfo?.authorizationCode
        self.transactionTime = receiptInfo?.transactionTime
    }
}

struct PaymentResult: Record {
    init() {}

    @Field
    var resultCode: String = "UNKNOWN"

    @Field
    var errorMessage: String? = nil

    @Field
    var amountInCents: Int64? = nil

    @Field
    var tipInCents: Int? = nil

    @Field
    var finalAmountInCents: Int64? = nil

    @Field
    var paymentType: String? = "UNKNOWN"

    @Field
    var currency: String? = "UNKNOWN"

    @Field
    var transactionId: String? = nil

    @Field
    var clientTransactionId: String? = nil

    @Field
    var receiptInfo: [String : Any]? = nil

    init(paymentResult: YocoSDK.PaymentResult) {
        if let paymentType = paymentResult.paymentType {
            self.paymentType = PaymentTypeAdapter("\(paymentType)").get().rawValue
        }

        self.currency = CurrencyAdapter("\(paymentResult.currency)").get().rawValue
        self.resultCode = ResultCodeAdapter(paymentResult.result).get().rawValue
        self.amountInCents = paymentResult.amountInCents
        self.tipInCents = paymentResult.tipInCents
        self.finalAmountInCents = paymentResult.finalAmountInCents
        self.transactionId = paymentResult.transactionID
        self.receiptInfo = ReceiptInfo(receiptInfo: paymentResult.receiptInfo).toDictionary()
    }
}
