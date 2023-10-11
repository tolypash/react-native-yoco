package expo.modules.yoco.data.params

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class StaffMember : Record {
    @Field
    var name: String = ""

    @Field
    var staffNumber: String = ""
}