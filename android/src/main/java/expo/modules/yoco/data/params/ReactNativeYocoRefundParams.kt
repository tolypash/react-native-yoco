package expo.modules.yoco.data.params

import com.yoco.payment_ui_sdk.data.YocoStaff
import com.yoco.payment_ui_sdk.data.delegates.ReceiptDelegate
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class RefundParams : Record {
    @Field
    var amountInCents: Long = 0

    @Field
    var receiptDelegate: ReceiptDelegate? = null

    @Field
    var userInfo: Any? = null

    @Field
    var staffMember: YocoStaff? = null

    fun injectValues(amountInCents: Long, receiptDelegate: ReceiptDelegate?, userInfo: Any?, staffMember: YocoStaff?) {
        this.amountInCents = amountInCents
        this.receiptDelegate = receiptDelegate
        this.userInfo = userInfo
        this.staffMember = staffMember
    }
}