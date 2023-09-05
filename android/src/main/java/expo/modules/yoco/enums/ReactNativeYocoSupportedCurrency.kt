package expo.modules.yoco.enums

import expo.modules.kotlin.types.Enumerable

enum class SupportedCurrency(val value: String): Enumerable {
    UNKNOWN("UNKNOWN"),
    ZAR("ZAR");
}

class SupportedCurrencyAdaptor(value: String) {
    private var currency = SupportedCurrency.UNKNOWN

    init {
        this.currency = when (value) {
            "ZAR" -> SupportedCurrency.ZAR
            else -> SupportedCurrency.UNKNOWN
        }
    }

    fun get(): SupportedCurrency {
        return this.currency
    }

    /**
     * Function to get the Yoco Payment UI enum from SupportedCurrency enum
     * Defaults to ZAR if invalid
     */
    fun toYoco(): com.yoco.payment_ui_sdk.data.enums.SupportedCurrency {
        return when (this.currency) {
            SupportedCurrency.ZAR -> com.yoco.payment_ui_sdk.data.enums.SupportedCurrency.ZAR
            else -> com.yoco.payment_ui_sdk.data.enums.SupportedCurrency.ZAR
        }
    }
}