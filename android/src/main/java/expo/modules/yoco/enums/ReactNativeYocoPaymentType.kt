package expo.modules.yoco.enums

import expo.modules.kotlin.types.Enumerable

enum class PaymentType(val value: String) : Enumerable {
    UNKNOWN("UNKNOWN"),
    CARD("CARD"),
    CASH("CASH"),
}

class PaymentTypeAdaptor(value: String) {
    private var paymentType = PaymentType.UNKNOWN

    init {
        this.paymentType = when (value) {
            "CARD" -> PaymentType.CARD
            "CASH" -> PaymentType.CASH
            else -> PaymentType.UNKNOWN
        }
    }

    fun get(): PaymentType {
        return this.paymentType
    }

    /**
     * Function to get the Yoco Payment UI enum from PaymentType enum
     * Defaults to CARD if invalid
     */
    fun toYoco(): com.yoco.payments.sdk.data.enums.PaymentType {
        return when (this.paymentType) {
            PaymentType.CARD -> com.yoco.payments.sdk.data.enums.PaymentType.CARD
            PaymentType.CASH -> com.yoco.payments.sdk.data.enums.PaymentType.CASH
            else -> com.yoco.payments.sdk.data.enums.PaymentType.CARD
        }
    }
}
