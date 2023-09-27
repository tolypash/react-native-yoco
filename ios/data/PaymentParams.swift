import ExpoModulesCore

struct PaymentParams: Record {
    @Field
    var note: String? = nil

    @Field
    var billId: String? = nil

    @Field
    var receiptNumber: String? = nil
}
