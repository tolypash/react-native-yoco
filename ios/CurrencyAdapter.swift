import YocoSDK

enum Currency: String {
    case unknown = "UNKNOWN"
    case zar = "ZAR"
}

class SupportedCurrencyAdapter {
    private var currency: Currency

    init(_ value: String) {
        currency = Currency(rawValue: value) ?? .unknown
    }

    func get() -> Currency {
        return currency
    }

    func toYoco() -> SupportedCurrency {
        let result = SupportedCurrency.allCases.first {
            "\($0)" == self.currency.rawValue.lowercased()
        }
        return result ?? .zar
    }
}
