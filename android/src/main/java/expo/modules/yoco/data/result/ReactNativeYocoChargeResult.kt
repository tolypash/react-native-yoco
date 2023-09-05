package expo.modules.yoco.data.result

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record
import expo.modules.yoco.data.params.PaymentParameters
import expo.modules.yoco.enums.PaymentType
import expo.modules.yoco.enums.ResultCode
import expo.modules.yoco.enums.SupportedCurrency

class ChargeResult : Record {
    @Field
    var resultCode: ResultCode = ResultCode.UNKNOWN

    @Field
    var errorMessage: String? = null

    @Field
    var amountInCents: Long? = null

    @Field
    var paymentType: PaymentType? = null

    @Field
    var currency: SupportedCurrency? = null

    @Field
    var tipInCents: Int? = null

    fun injectValues(
        resultCode: ResultCode?,
        errorMessage: String?,
        amountInCents: Long?,
        paymentType: PaymentType?,
        currency: SupportedCurrency?,
        tipInCents: Int?,
    ) {
        if (resultCode != null) {
            this.resultCode = resultCode
        }

        this.errorMessage = errorMessage
        this.amountInCents = amountInCents
        this.paymentType = paymentType
        this.currency = currency
        this.tipInCents = tipInCents
    }
}


