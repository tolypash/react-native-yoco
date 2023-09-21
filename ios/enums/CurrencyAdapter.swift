import ExpoModulesCore
import YocoSDK

enum CurrencyEnum: String, Enumerable {
    case UNKNOWN
    case ZAR
}

struct CurrencyAdapter {
    private var currency: CurrencyEnum
    
    init(_ value: String) {
        self.currency = eval {
            switch value.lowercased() {
            case "zar": CurrencyEnum.ZAR
            default: CurrencyEnum.UNKNOWN
            }
        }
    }
    
    func get() -> CurrencyEnum {
        return self.currency
    }
    
    /**
     * Function to get the Yoco Payment UI enum from SupportedCurrency enum
     * Defaults to ZAR if invalid
     */
    func toYoco() -> YocoSDK.SupportedCurrency {
        let result = eval {
            switch self.currency {
            case .ZAR: YocoSDK.SupportedCurrency.zar
            default: YocoSDK.SupportedCurrency.zar
            }
        }
        
        return result
    }
}
