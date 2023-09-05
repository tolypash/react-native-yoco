package expo.modules.yoco.enums

import com.yoco.payment_ui_sdk.data.result.PaymentResultInfo
import expo.modules.kotlin.types.Enumerable

enum class ResultCode(val value: String) : Enumerable {
    UNKNOWN("UNKNOWN"),
    ERROR_CANCELLED("ERROR_CANCELLED"),
    ERROR_BLUETOOTH_DISABLED("ERROR_BLUETOOTH_DISABLED"),
    ERROR_INVALID_TOKEN("ERROR_INVALID_TOKEN"),
    ERROR_NO_CONNECTIVITY("ERROR_NO_CONNECTIVITY"),
    ERROR_PERMISSION_DENIED("ERROR_PERMISSION_DENIED"),
    ERROR_PRINT_FAILED("ERROR_PRINT_FAILED"),
    ERROR_REFUND_FAILED("ERROR_REFUND_FAILED"),
    ERROR_TRANSACTION_FAILED("ERROR_TRANSACTION_FAILED"),
    ERROR_TRANSACTION_LOOKUP_FAILED("ERROR_TRANSACTION_LOOKUP_FAILED"),
    IN_PROGRESS("IN_PROGRESS"),
    SUCCESSFUL("SUCCESSFUL");
}

class ResultCodeAdaptor(value: Int) {
    private var resultCode = ResultCode.UNKNOWN

    init {
        this.resultCode = when (value) {
            PaymentResultInfo.ResultCode.ERROR_CANCELLED -> ResultCode.ERROR_CANCELLED
            PaymentResultInfo.ResultCode.ERROR_BLUETOOTH_DISABLED -> ResultCode.ERROR_BLUETOOTH_DISABLED
            PaymentResultInfo.ResultCode.ERROR_PRINT_FAILED -> ResultCode.ERROR_PRINT_FAILED
            PaymentResultInfo.ResultCode.ERROR_INVALID_TOKEN -> ResultCode.ERROR_INVALID_TOKEN
            PaymentResultInfo.ResultCode.ERROR_PERMISSION_DENIED -> ResultCode.ERROR_PERMISSION_DENIED
            PaymentResultInfo.ResultCode.ERROR_NO_CONNECTIVITY -> ResultCode.ERROR_NO_CONNECTIVITY
            PaymentResultInfo.ResultCode.ERROR_REFUND_FAILED -> ResultCode.ERROR_REFUND_FAILED
            PaymentResultInfo.ResultCode.ERROR_TRANSACTION_FAILED -> ResultCode.ERROR_TRANSACTION_FAILED
            PaymentResultInfo.ResultCode.ERROR_TRANSACTION_LOOKUP_FAILED -> ResultCode.ERROR_TRANSACTION_LOOKUP_FAILED
            PaymentResultInfo.ResultCode.IN_PROGRESS -> ResultCode.IN_PROGRESS
            PaymentResultInfo.ResultCode.SUCCESSFUL -> ResultCode.SUCCESSFUL
            else -> ResultCode.UNKNOWN
        }
    }

    fun get(): ResultCode {
        return this.resultCode
    }

    fun isError(): Boolean {
        val string = this.resultCode.toString()

        return string.startsWith("ERROR")
    }
}