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
    
    init(code: ResultCodeEnum) {
        self.resultCode = code.rawValue
    }

    init(result: YocoSDK.PaymentResult) {
        self.resultCode = ResultCodeAdapter(result.result).get().rawValue
        self.currency = CurrencyAdapter("\(result.currency)").get().rawValue
        if let paymentType = result.paymentType {
            self.paymentType = PaymentTypeAdapter("\(paymentType)").get().rawValue
        }
        self.amountInCents = result.amountInCents
        self.tipInCents = result.tipInCents
        self.finalAmountInCents = result.finalAmountInCents
        self.transactionId = result.transactionID
        self.receiptInfo = ReceiptInfo(receiptInfo: result.receiptInfo).toDictionary()
    }
}
