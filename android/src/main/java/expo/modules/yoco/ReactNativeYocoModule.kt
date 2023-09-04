package expo.modules.yoco

import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.yoco.payment_ui_sdk.YocoSDK
import com.yoco.payment_ui_sdk.data.enums.SDKEnvironment
import com.yoco.payment_ui_sdk.data.params.TippingConfig
import expo.modules.kotlin.Promise
import expo.modules.kotlin.exception.Exceptions
import expo.modules.yoco.enums.PaymentTypeAdaptor
import expo.modules.yoco.enums.SupportedCurrencyAdaptor
import expo.modules.yoco.params.PaymentParameters

class ReactNativeYocoModule : Module() {
    private val context: Context
        get() = appContext.reactContext ?: throw Exceptions.ReactContextLost()

    private val currentActivity
        get() = appContext.activityProvider?.currentActivity ?: throw Exceptions.MissingActivity()

    private var pairTerminalPromise : Promise? = null
    private var chargePromise : Promise? = null

    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module.
        Name("ReactNativeYoco")

        // Sets constant properties on the module.
        Constants(
            "PI" to Math.PI
        )

        // Defines event names that the module can send to JavaScript.
        Events("onChange")

        Function("initialise") {
            // Initialises Yoco Payment UI SDK
            YocoSDK.initialise(
                context = context
            )
        }

        Function("configure") { secret: String ->
            // Configures the Yoco Payment UI SDK
            YocoSDK.configure(
                context = context,
                secret = secret,
                environment = SDKEnvironment.PRODUCTION,
                enableLogging = true
            )
        }

        Function("getDeviceType") {
            return@Function YocoSDK.getDeviceType()
        }

        AsyncFunction("pairTerminal") { promise: Promise ->
            YocoSDK.pairTerminal(context = currentActivity)

            // @TODO resolve promise with OnActivityResult

            promise.resolve(Unit)

            pairTerminalPromise = promise
        }

        AsyncFunction("charge") { amountInCents: Long, paymentType: String, currency: String, tipInCents: Int?, paymentParameters: PaymentParameters?,  promise: Promise ->
            val tippingConfig = when (tipInCents) {
                null -> TippingConfig.DO_NOT_ASK_FOR_TIP
                0 -> TippingConfig.ASK_FOR_TIP_ON_CARD_MACHINE
                else -> TippingConfig.INCLUDE_TIP_IN_AMOUNT(tipInCents)
            }

            val paymentParams =  com.yoco.payment_ui_sdk.data.params.PaymentParameters()

            val res = YocoSDK.charge(
                context = currentActivity,
                amountInCents,
                PaymentTypeAdaptor(paymentType).toYoco(),
                SupportedCurrencyAdaptor(currency).toYoco(),
                tippingConfig,
                null, // Not set by integrators
                paymentParams
            )

            // @TODO resolve promise with OnActivityResult

            promise.resolve(res)
        }

        OnActivityResult { activity, result ->
            System.err.println("Pairing Activity: Result Code: ${result.resultCode}") // PaymentSDK.Response.ResultCode

            pairTerminalPromise = null
            chargePromise = null
        }
    }
}
