import YocoSDK

enum PaymentType: String {
    case unknown = "UNKNOWN"
    case card = "CARD"
    case cash = "CASH"
    case qr = "QR"
}

class PaymentTypeAdapter {
    private var paymentType: PaymentType
    
    init(_ value: String) {
        paymentType = PaymentType(rawValue: value) ?? .unknown
    }
    
    func get() -> PaymentType {
        return paymentType
    }
    
    func toYoco() -> YocoPaymentType {
        let result = YocoPaymentType.allCases.first {
            "\($0)" == self.paymentType.rawValue.lowercased()
        }
        return result ?? .card
    }
}
