import ExpoModulesCore
import YocoSDK

public class ReactNativeYocoModule: Module {
  public func definition() -> ModuleDefinition {
    // Sets the name of the module that JavaScript code will use to refer to the module.
    Name("ReactNativeYoco")
      
    Function("initialise") {
        DispatchQueue.main.async { () -> Void in
            Yoco.initialise()
        }
    }

    Function("configure") { (secret: String) in
        DispatchQueue.main.async { () -> Void in
            Yoco.configure(secret: secret, loggingEnabled: true, environment: .production)
        }
    }

    Function("getDeviceType") {
        
    }

    AsyncFunction("pairTerminal") {
       
    }

    AsyncFunction("charge") {

    }

    AsyncFunction("getPaymentResult") {

    }

    AsyncFunction("queryTransactions") {

    }

    AsyncFunction("refund") {

    }
  }
}
