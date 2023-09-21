import ExpoModulesCore
import YocoSDK

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
        
        AsyncFunction("charge") { (amountInCents: UInt64, paymentType: String, currency: String, tipInCents: Int32?, paymentParameters: PaymentParams?, promise: Promise) in
            DispatchQueue.main.async {
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
                
                Yoco.charge(
                    amountInCents,
                    paymentType: PaymentTypeAdapter(paymentType).toYoco(),
                    currency: CurrencyAdapter(currency).toYoco(),
                    tippingConfig: tippingConfig,
                    printerConfig: nil,
                    parameters: parameters
                ) { paymentResult in
                    promise.resolve(PaymentResult(paymentResult: paymentResult).toDictionary())
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
