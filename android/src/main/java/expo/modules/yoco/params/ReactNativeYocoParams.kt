package expo.modules.yoco.params

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class PaymentParameters : Record {
    @Field
    val note: String? = null

    @Field
    val billId: String? = null

    @Field
    val receiptNumber: String? = null
}