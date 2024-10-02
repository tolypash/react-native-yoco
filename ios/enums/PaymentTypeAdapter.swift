import ExpoModulesCore
import YocoSDK

enum PaymentTypeEnum: String, Enumerable {
    case UNKNOWN
    case CARD
    case CASH
    case QR
}

struct PaymentTypeAdapter {
    private var paymentType: PaymentTypeEnum
    
    init(_ value: String) {
        self.paymentType = eval {
            switch value.lowercased() {
            case "card": PaymentTypeEnum.CARD
            case "cash": PaymentTypeEnum.CASH
            case "qr": PaymentTypeEnum.QR
            default: PaymentTypeEnum.UNKNOWN
            }
        }
    }
    
    func get() -> PaymentTypeEnum {
        return self.paymentType
    }
    
    /**
     * Function to get the Yoco Payment UI enum from PaymentType enum
     * Defaults to CARD if invalid
     */
    func toYoco() -> YocoSDK.YocoPaymentType {
        let result: YocoSDK.YocoPaymentType
        switch self.paymentType {
        case .CARD:
            result = YocoSDK.YocoPaymentType.card
        case .CASH:
            result = YocoSDK.YocoPaymentType.cash
        case .QR:
            result = YocoSDK.YocoPaymentType.qr
        default:
            result = YocoSDK.YocoPaymentType.card
        }

    return result
    }
}
