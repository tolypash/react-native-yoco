package expo.modules.yoco.data.params

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class PaymentParameters : Record {
    @Field
    var note: String? = null

    @Field
    var billId: String? = null

    @Field
    var receiptNumber: String? = null
    
    fun injectValues(note: String?, billId: String?, receiptNumber: String?) {
        this.note = note
        this.billId = billId
        this.receiptNumber = receiptNumber
    }
}