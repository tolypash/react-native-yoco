package expo.modules.yoco

import android.app.Activity
import android.content.Context
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import com.yoco.payments.sdk.YocoSDK
import com.yoco.payments.sdk.data.YocoStaff
import com.yoco.payments.sdk.data.delegates.DefaultReceiptDelegate
import com.yoco.payments.sdk.data.enums.SDKEnvironment
import com.yoco.payments.sdk.data.params.RefundParameters as YocoRefundParameters
import com.yoco.payments.sdk.data.params.TippingConfig as YocoTippingConfig
import com.yoco.payments.sdk.data.result.PaymentResultInfo as YocoPaymentResultInfo
import com.yoco.payments.sdk.data.params.PaymentParameters as YocoPaymentParameters
import com.yoco.payments.sdk.data.result.PaymentResult as YocoPaymentResult
import expo.modules.kotlin.Promise
import expo.modules.kotlin.events.OnActivityResultPayload
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.exception.Exceptions
import expo.modules.kotlin.exception.toCodedException
import expo.modules.kotlin.functions.Queues
import expo.modules.yoco.data.params.PaymentParams
import expo.modules.yoco.data.params.StaffMember
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
    private var refundPromise : Promise? = null

    override fun definition() = ModuleDefinition {
        // Sets the name of the module that JavaScript code will use to refer to the module.
        Name("ReactNativeYoco")

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
                null -> YocoTippingConfig.DO_NOT_ASK_FOR_TIP
                0 -> YocoTippingConfig.ASK_FOR_TIP_ON_CARD_MACHINE
                else -> YocoTippingConfig.INCLUDE_TIP_IN_AMOUNT(tipInCents.toInt())
            }

            val paymentParams = YocoPaymentParameters(
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
                    paymentParams,
                    null,
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
                    result,
                )

                if (show && resCode.get() == ResultCode.SUCCESSFUL && result != null) {
                    YocoSDK.showPaymentResult(
                        context = currentActivity,
                        paymentResult = result,
                        paymentParameters = null,
                        printParameters = null
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
                        transaction,
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

        AsyncFunction("refund") { transactionId: String, amountInCents: Long, userInfo: Map<String, Any>?, staffMember: StaffMember?,  promise: Promise ->
            val staff = YocoStaff(
                staffMember?.name ?: "",
                staffMember?.staffNumber ?: ""
            )

            val parameters = YocoRefundParameters(
                amountInCents,
                staff, // Required here, despite being optional in the docs
                DefaultReceiptDelegate(),
                userInfo,
                null,
            )

            try {
                refundPromise = promise

                YocoSDK.refund(
                    context = currentActivity,
                    transactionId,
                    parameters,
                    null,
                )
            } catch (e: Exception) {
                promise.reject(e.toCodedException())
                throw e
            }
        }.runOnQueue(Queues.MAIN)

        OnActivityResult { activity, result ->
            when (result.requestCode) {
                YocoPaymentResultInfo.RequestCode.PAIRING_REQUEST -> {
                    onPairTerminalResult(activity, result)
                }
                YocoPaymentResultInfo.RequestCode.CHARGE_REQUEST -> {
                    onChargeResult(activity, result)
                }
                YocoPaymentResultInfo.RequestCode.REFUND_REQUEST -> {
                    onRefundResult(activity, result)
                }
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

        val transactionResult = result.data?.getSerializableExtra(YocoPaymentResultInfo.ResultKeys.Transaction) as YocoPaymentResult?

        val res = PaymentResult().injectValues(
            resultCode = resCode.get(),
            errorMessage = transactionResult?.errorMessage,
            paymentResult = transactionResult,
        )

        chargePromise?.resolve(res)

        chargePromise = null
    }

    private fun onRefundResult(activity: Activity, result: OnActivityResultPayload) {
        val resCode = ResultCodeAdaptor(result.resultCode)

        val transactionResult = result.data?.getSerializableExtra(YocoPaymentResultInfo.ResultKeys.Transaction) as YocoPaymentResult?

        val res = PaymentResult().injectValues(
                resultCode = resCode.get(),
                errorMessage = transactionResult?.errorMessage,
                paymentResult = transactionResult,
        )

        refundPromise?.resolve(res)

        refundPromise = null
    }
}
