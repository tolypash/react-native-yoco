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
        
        // No equivalent YocoSDK API
        Function("getDeviceType") { () -> String? in
            return nil
        }
        
        AsyncFunction("pairTerminal") {
            DispatchQueue.main.async {
                Yoco.pairTerminal()
            }
        }
        
        AsyncFunction("charge") { (amountInCents: UInt64, paymentType: String, currency: String, tipInCents: Int32?, paymentParameters: PaymentParams?, promise: Promise) in
            let workItem = DispatchWorkItem {
                var tippingConfig: YocoSDK.TippingConfig = .DO_NOT_ASK_FOR_TIP
                let parameters = PaymentParameters(
                    autoTransition: false,
                    receiptDelegate: nil,
                    userInfo: nil,
                    staffMember: nil,
                    receiptNumber: paymentParameters?.receiptNumber,
                    billId: paymentParameters?.billId,
                    note: paymentParameters?.note
                )
                
                if let tip = tipInCents {
                    if tip == 0 {
                        tippingConfig = .ASK_FOR_TIP_ON_CARD_MACHINE
                    } else {
                        tippingConfig = .INCLUDE_TIP_IN_AMOUNT(tipInCents: tip)
                    }
                }
                
                Yoco.charge(
                    amountInCents,
                    paymentType: PaymentTypeAdapter(paymentType).toYoco(),
                    currency: CurrencyAdapter(currency).toYoco(),
                    tippingConfig: tippingConfig,
                    paymentParameters: parameters
                ) { paymentResult in
                    let res = PaymentResult(result: paymentResult)
                    promise.resolve(res.toDictionary())
                }
            }
            
            DispatchQueue.main.async(execute: workItem)
        }
        
        AsyncFunction("getPaymentResult") { (transactionId: String, show: Bool, promise: Promise) in
            DispatchQueue.main.async {
                Yoco.getPaymentResult(transactionID: transactionId) { paymentResult, error in
                    if let paymentResult {
                        let resultCode = ResultCodeAdapter(paymentResult.result).get()
                        
                        if show, case .SUCCESSFUL = resultCode {
                            Yoco.showPaymentResult(paymentResult)
                        }
                        
                        let res = PaymentResult(result: paymentResult)
                        promise.resolve(res.toDictionary())
                    }
                    
                    if let error {
                        let res = PaymentResult(code: ResultCodeEnum.ERROR_TRANSACTION_LOOKUP_FAILED)
                        promise.resolve(res.toDictionary())
                    }
                }
            }
        }
        
        AsyncFunction("queryTransactions") { (receiptNumber: String, promise: Promise) in
            DispatchQueue.main.async {
                Yoco.getIntegratorTransactions(receiptNumber: receiptNumber) { (transactions, error) in
                    if let transactions {
                        var resList: [PaymentResult] = []
                        
                        transactions.forEach { transaction in
                            resList.append(PaymentResult(result: transaction))
                        }
                        
                        let res = QueryTransactionsResult(
                            resultCode: ResultCodeEnum.SUCCESSFUL,
                            errorMessage: nil,
                            transactions: resList
                        )
                        promise.resolve(res.toDictionary())
                    }
                    
                    if let error {
                        let res = QueryTransactionsResult(
                            resultCode: ResultCodeEnum.ERROR_TRANSACTION_LOOKUP_FAILED,
                            errorMessage: nil,
                            transactions: nil
                        )
                        promise.resolve(res.toDictionary())
                    }
                }
            }
        }
        
        AsyncFunction("refund") { (transactionId: String, amountInCents: Int64, userInfo: [AnyHashable: Any]?, staffMember: StaffMember?, promise: Promise) in
            DispatchQueue.main.async {
                var staff: YocoSDK.YocoStaff? = nil
                
                if let staffMember {
                    staff = YocoSDK.YocoStaff(
                        staffNumber: staffMember.staffNumber,
                        name: staffMember.name
                    )
                }
                
                let parameters = YocoSDK.RefundParameters(
                    amountInCents: amountInCents,
                    receiptDelegate: nil,
                    userInfo: userInfo,
                    staffMember: staff
                )
                
                Yoco.refund(transactionID: transactionId, refundParameters: parameters) { (paymentResult) in
                    let res = PaymentResult(result: paymentResult)
                    promise.resolve(res.toDictionary())
                }
            }
        }
    }
}
