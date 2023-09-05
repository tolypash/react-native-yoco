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
import expo.modules.kotlin.functions.Queues
import expo.modules.yoco.data.params.PaymentParams
import expo.modules.yoco.data.params.RefundParams
import expo.modules.yoco.data.result.ChargeResult
import expo.modules.yoco.data.result.PaymentResult
import expo.modules.yoco.data.result.QueryTransactionsResult
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

        AsyncFunction("charge") { amountInCents: Long, paymentType: PaymentType, currency: SupportedCurrency, tipInCents: Int?, paymentParameters: PaymentParams?, promise: Promise ->
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

        AsyncFunction("getPaymentResult") { transactionId: String, show: Boolean, promise: Promise ->
            YocoSDK.getPaymentResult(transactionId) { resultCode, result, errorMessage ->
                    val resCode = ResultCodeAdaptor(resultCode)

                    val res = PaymentResult()

                    res.injectValues(
                        resCode.get(),
                        errorMessage,
                        result?.amountInCents,
                        PaymentTypeAdaptor(result?.paymentType.toString()).get(),
                        SupportedCurrencyAdaptor(result?.currency.toString()).get(),
                        result?.tipInCents,
                        result?.finalAmountInCents,
                        result?.clientTransactionId,
                    )

                    if (show && resCode.get() == ResultCode.SUCCESSFUL && result != null) {
                        YocoSDK.showPaymentResult(
                            context = currentActivity,
                            paymentResult = result,
                            params = null,
                        )
                    }

                    promise.resolve(res)
                }
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("queryTransactions") { receiptNumber: String, promise: Promise ->
            YocoSDK.getIntegratorTransactions(receiptNumber) { resultCode, transactions, errorMessage ->
                val resCode = ResultCodeAdaptor(resultCode)

                val resList = mutableListOf<PaymentResult>()

                transactions?.forEach { transaction ->
                    val temp = PaymentResult()

                    temp.injectValues(
                        resCode.get(),
                        errorMessage,
                        transaction.amountInCents,
                        PaymentTypeAdaptor(transaction.paymentType.toString()).get(),
                        SupportedCurrencyAdaptor(transaction.currency.toString()).get(),
                        transaction.tipInCents,
                        transaction.finalAmountInCents,
                        transaction.clientTransactionId,
                    )

                    resList.add(temp)
                }

                val res = QueryTransactionsResult().injectValues(
                    resCode.get(),
                    errorMessage,
                    resList
                )

                promise.resolve(res)
            }
        }.runOnQueue(Queues.MAIN)

        AsyncFunction("refund") { _: String, _: RefundParams, promise: Promise ->
            /**
             * @TODO Implement. Issue: refundParams and refundParams.staffMember is noted in docs as optional, but not optional here.
               val yocoRefundParams = com.yoco.payment_ui_sdk.data.params.RefundParameters(
                amountInCents = params.amountInCents,
                staffMember = params.staffMember,
            )

            YocoSDK.refund(
                context = currentActivity,
                transactionId,

            )
            */

            promise.reject(CodedException("Not implemented"))
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
        val resCode = ResultCodeAdaptor(result.resultCode)

        val paymentResult = YocoSDK.paymentResult

        val chargeResult = ChargeResult()

        chargeResult.injectValues(
            resultCode = resCode.get(),
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
