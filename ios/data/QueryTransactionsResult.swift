import ExpoModulesCore
import YocoSDK

struct QueryTransactionsResult: Record {
    init() {}

    @Field
    var resultCode: String = "UNKNOWN"

    @Field
    var errorMessage: String? = nil
    
    @Field
    var transactions: [PaymentResult]? = nil

    init(
        resultCode: ResultCodeEnum,
        errorMessage: String? = nil,
        transactions: [PaymentResult]? = nil
    ) {
        self.resultCode = resultCode.rawValue
        self.errorMessage = errorMessage
        self.transactions = transactions
    }
}
