import ExpoModulesCore
import YocoSDK

enum ResultCodeEnum: String, Enumerable {
    case UNKNOWN
    case ERROR_BLUETOOTH_DISABLED
    case ERROR_INVALID_TOKEN
    case ERROR_NO_CONNECTIVITY
    case ERROR_PERMISSION_DENIED
    case ERROR_PRINT_FAILED
    case ERROR_REFUND_FAILED
    case ERROR_TRANSACTION_FAILED
    case ERROR_TRANSACTION_LOOKUP_FAILED
    case ERROR_CARD_MACHINE
    case ERROR_CANCELLED
    case IN_PROGRESS
    case SUCCESSFUL
}

struct ResultCodeAdapter {
    private var resultCode: ResultCodeEnum

    init(_ value: YocoSDK.ResultCode) {
        self.resultCode = eval {
            switch value {
            case .bluetoothDisabled: ResultCodeEnum.ERROR_BLUETOOTH_DISABLED
            case .invalidToken: ResultCodeEnum.ERROR_INVALID_TOKEN
            case .noConnectivity: ResultCodeEnum.ERROR_NO_CONNECTIVITY
            case .cardMachineError: ResultCodeEnum.ERROR_CARD_MACHINE
            case .printFailed: ResultCodeEnum.ERROR_PRINT_FAILED
            case .permissionDenied: ResultCodeEnum.ERROR_PERMISSION_DENIED
            case .failure: ResultCodeEnum.ERROR_TRANSACTION_FAILED
            case .cancelled: ResultCodeEnum.ERROR_CANCELLED
            case .inProgress: ResultCodeEnum.IN_PROGRESS
            case .success: ResultCodeEnum.SUCCESSFUL
            default: ResultCodeEnum.UNKNOWN
            }
        }
    }

    func get() -> ResultCodeEnum {
        return self.resultCode
    }

    func isError() -> Bool {
        let string = self.resultCode.rawValue
        return string.hasPrefix("ERROR")
    }
}
