package expo.modules.yoco.data.result

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.yoco.enums.*

class ReceiptInfo : Record {
    @Field
    var authorizationCode: String? = null
    var transactionTime: String? = null

    fun injectValues(receiptInfo: com.yoco.payments.sdk.data.result.ReceiptInfo?): ReceiptInfo {
        this.authorizationCode = receiptInfo?.authorizationCode
        this.transactionTime = receiptInfo?.transactionTime

        return this
    }
}

class PaymentResult : Record {
    @Field
    var resultCode: ResultCode = ResultCode.UNKNOWN

    @Field
    var errorMessage: String? = null

    @Field
    var amountInCents: Long? = null

    @Field
    var tipInCents: Int? = null

    @Field
    var finalAmountInCents: Long? = null

    @Field
    var paymentType: PaymentType? = null

    @Field
    var currency: SupportedCurrency? = null

    @Field
    var transactionId: String? = null

    @Field
    var clientTransactionId: String? = null

    @Field
    var receiptInfo: ReceiptInfo? = null

    fun injectValues(
        resultCode: ResultCode?,
        errorMessage: String?,
        paymentResult: com.yoco.payments.sdk.data.result.PaymentResult?,
    ): PaymentResult {
        if (resultCode != null) {
            this.resultCode = resultCode
        }

        this.errorMessage = errorMessage
        this.amountInCents = paymentResult?.amountInCents
        this.tipInCents = paymentResult?.tipInCents
        this.finalAmountInCents = paymentResult?.finalAmountInCents
        this.paymentType =  PaymentTypeAdaptor(paymentResult?.paymentType.toString()).get()
        this.currency = SupportedCurrencyAdaptor(paymentResult?.currency.toString()).get()
        this.transactionId = paymentResult?.transactionId
        this.clientTransactionId = paymentResult?.clientTransactionId

        this.receiptInfo = ReceiptInfo().injectValues(paymentResult?.receiptInfo)

        return this
    }
}
