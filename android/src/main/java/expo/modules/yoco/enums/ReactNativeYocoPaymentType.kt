package expo.modules.yoco.enums

import expo.modules.kotlin.types.Enumerable

enum class PaymentType(private val value: String) : Enumerable {
    UNKNOWN("UNKNOWN"),
    CARD("CARD"),
    CASH("CASH"),
    QR("QR");
}

class PaymentTypeAdaptor {
    private var paymentType = PaymentType.UNKNOWN

    constructor(value: String) {
        this.paymentType = when (value) {
            "CARD" -> PaymentType.CARD;
            "CASH" -> PaymentType.CASH;
            "QR" -> PaymentType.QR;
            else -> PaymentType.UNKNOWN;
        }
    }

    fun get(): PaymentType {
        return this.paymentType
    }

    /**
     * Function to get the Yoco Payment UI enum from PaymentType enum
     * Defaults to CARD if invalid
     */
    fun toYoco(): com.yoco.payment_ui_sdk.data.enums.PaymentType {
        return when (this.paymentType) {
            PaymentType.CARD -> com.yoco.payment_ui_sdk.data.enums.PaymentType.CARD;
            PaymentType.CASH -> com.yoco.payment_ui_sdk.data.enums.PaymentType.CASH;
            PaymentType.QR -> com.yoco.payment_ui_sdk.data.enums.PaymentType.QR;
            else -> com.yoco.payment_ui_sdk.data.enums.PaymentType.CARD;
        }
    }
}