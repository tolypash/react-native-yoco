package expo.modules.yoco.data.result

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.yoco.enums.ResultCode

class QueryTransactionsResult : Record {
    @Field
    var resultCode: ResultCode = ResultCode.UNKNOWN

    @Field
    var errorMessage: String? = null

    @Field
    var transactions: List<PaymentResult>? = null

    fun injectValues(
        resultCode: ResultCode?,
        errorMessage: String?,
        transactions: List<PaymentResult>?,
    ): QueryTransactionsResult {
        if (resultCode != null) {
            this.resultCode = resultCode
        }

        this.errorMessage = errorMessage
        this.transactions = transactions

        return this
    }
}


