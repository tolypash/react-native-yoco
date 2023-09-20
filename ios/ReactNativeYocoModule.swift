import ExpoModulesCore
import YocoSDK

struct PaymentParametersArgument: AnyArgument {
    let note: String?
    let billId: String?
    let receiptNumber: String?
}

public class ReactNativeYocoModule: Module {
    public func definition() -> ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module.
        Name("ReactNativeYoco")
        
        Function("initialise") {
            DispatchQueue.main.async {
                Yoco.initialise()
            }
        }
        
        Function("configure") { (secret: String) in
            DispatchQueue.main.async {
                Yoco.configure(secret: secret, loggingEnabled: true, environment: .production)
            }
        }
        
        Function("getDeviceType") {
            
        }
        
        AsyncFunction("pairTerminal") {
            DispatchQueue.main.async {
                Yoco.pairTerminal()
            }
        }
        
        AsyncFunction("charge") { (amountInCents: UInt64, paymentType: String, currency: String, tipInCents: Int32?, paymentParameters: PaymentParametersArgument?, promise: Promise) in
            var tippingConfig: TippingConfig = .DO_NOT_ASK_FOR_TIP
            let parameters = PaymentParameters(
                autoTransition: false,
                receiptDelegate: nil,
                userInfo: nil,
                staffMember: nil,
                receiptNumber: paymentParameters?.receiptNumber,
                billId: paymentParameters?.billId,
                note: paymentParameters?.note
            )
            
            if (tipInCents != nil) {
                if (tipInCents == 0) {
                    tippingConfig = .ASK_FOR_TIP_ON_CARD_MACHINE
                } else {
                    tippingConfig = .INCLUDE_TIP_IN_AMOUNT(tipInCents: tipInCents!)
                }
            }
            
            DispatchQueue.main.async {
                Yoco.charge(
                    amountInCents,
                    paymentType: PaymentTypeAdapter(paymentType).toYoco(),
                    currency: SupportedCurrencyAdapter(currency).toYoco(),
                    tippingConfig: tippingConfig,
                    printerConfig: nil,
                    parameters: parameters
                ) { paymentResult in
                    switch paymentResult.result {
                    case .success:
                        promise.resolve(paymentResult)
                        break
                    default: // all failure cases
                        promise.reject("charge-error", "\(paymentResult.result)")
                        break
                    }
                }
            }
        }
        
        AsyncFunction("getPaymentResult") {
            
        }
        
        AsyncFunction("queryTransactions") {
            
        }
        
        AsyncFunction("refund") {
            
        }
    }
}
