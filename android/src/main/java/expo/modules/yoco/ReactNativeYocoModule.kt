package expo.modules.yoco

import android.app.Activity
import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.yoco.payment_ui_sdk.YocoSDK
import com.yoco.payment_ui_sdk.data.delegates.DefaultReceiptDelegate
import com.yoco.payment_ui_sdk.data.enums.SDKEnvironment
import com.yoco.payment_ui_sdk.data.params.TippingConfig
import com.yoco.payment_ui_sdk.data.result.PaymentResultInfo
import expo.modules.kotlin.Promise
import expo.modules.kotlin.events.OnActivityResultPayload
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.exception.toCodedException
import expo.modules.yoco.data.params.PaymentParameters
import expo.modules.yoco.data.result.ChargeResult
import expo.modules.yoco.enums.*

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
                context = context.applicationContext
            )
        }

        Function("configure") { secret: String ->
            // Configures the Yoco Payment UI SDK
            try {
                YocoSDK.configure(
                    context = context.applicationContext,
                    secret = secret,
                    environment = SDKEnvironment.PRODUCTION,
                    enableLogging = true
                )
            } catch (e: Exception) {
                System.err.println(e)
                throw e
            }
        }

        Function("getDeviceType") {
            return@Function YocoSDK.getDeviceType()
        }

        AsyncFunction("pairTerminal") { promise: Promise ->
            try {
                pairTerminalPromise = promise

                YocoSDK.pairTerminal(context = currentActivity)
            } catch (e: Exception) {
                promise.reject(e.toCodedException())
                throw e
            }
        }

        AsyncFunction("charge") { amountInCents: Long, paymentType: PaymentType, currency: SupportedCurrency, tipInCents: Int?, paymentParameters: PaymentParameters?, promise: Promise ->
            val tippingConfig = when (tipInCents) {
                null -> TippingConfig.DO_NOT_ASK_FOR_TIP
                0 -> TippingConfig.ASK_FOR_TIP_ON_CARD_MACHINE
                else -> TippingConfig.INCLUDE_TIP_IN_AMOUNT(tipInCents)
            }

            val paymentParams = com.yoco.payment_ui_sdk.data.params.PaymentParameters(
                DefaultReceiptDelegate(),
                null,
                null,
                paymentParameters?.receiptNumber,
                paymentParameters?.billId,
                paymentParameters?.note,
            )

            try {
                chargePromise = promise

                YocoSDK.charge(
                    context = currentActivity,
                    amountInCents,
                    PaymentTypeAdaptor(paymentType.toString()).toYoco(),
                    SupportedCurrencyAdaptor(currency.toString()).toYoco(),
                    tippingConfig,
                    null, // Not set by integrators
                    paymentParams
                )
            } catch (e: Exception) {
                promise.reject(e.toCodedException())
                throw e
            }
        }

        OnActivityResult { activity, result ->
            if (result.requestCode == PaymentResultInfo.RequestCode.PAIRING_REQUEST) {
                onPairTerminalResult(activity, result)
            } else if (result.requestCode == PaymentResultInfo.RequestCode.CHARGE_REQUEST) {
                onChargeResult(activity, result)
            }
        }
    }

    private fun onPairTerminalResult(activity: Activity, result: OnActivityResultPayload) {
        val res = ResultCodeAdaptor(result.resultCode)

        if (res.isError()) {
            pairTerminalPromise?.reject(CodedException(res.get().toString()))
        } else {
            pairTerminalPromise?.resolve(res.get())
        }

        pairTerminalPromise = null
    }

    private fun onChargeResult(activity: Activity, result: OnActivityResultPayload) {
        val res = ResultCodeAdaptor(result.resultCode)

        val paymentResult = YocoSDK.paymentResult

        val chargeResult = ChargeResult()

        chargeResult.injectValues(
            resultCode = res.get(),
            errorMessage = paymentResult?.errorMessage,
            amountInCents = paymentResult?.amountInCents,
            paymentType = PaymentTypeAdaptor(paymentResult?.paymentType.toString()).get(),
            currency = SupportedCurrencyAdaptor(paymentResult?.currency.toString()).get(),
            tipInCents = paymentResult?.tipInCents,
        )

        chargePromise?.resolve(chargeResult)

        chargePromise = null
    }
}
