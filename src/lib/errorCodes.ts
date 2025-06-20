export const ErrorCodes = {
    INVALID_REQUEST: 'INVALID_REQUEST',
    UNVERIFIED_EMAIL: 'UNVERIFIED_EMAIL',
    CREATE_SESSION_FAILED: 'CREATE_SESSION_FAILED',
    DELETE_SESSION_FAILED: 'DELETE_SESSION_FAILED',
    UNAUTHORIZED: 'UNAUTHORIZED',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    SQL_ERROR: 'SQL_ERROR',
    NO_AVAILABLE_IP: 'NO_AVAILABLE_IP',
    CREATE_CONFIG_FAILED: 'CREATE_CONFIG_FAILED',
    CREATE_INTERFACE_FAILED: 'CREATE_INTERFACE_FAILED',
    DELETE_INTERFACE_FAILED: 'DELETE_INTERFACE_FAILED',
    GET_IP_FAILED: 'GET_IP_FAILED',
} as const;

export const handleError = (error: string): string => {
    switch (error) {
        case ErrorCodes.INVALID_REQUEST:
            return 'DashboardPage.interfaceConfigurationError.invalidRequest';
        case ErrorCodes.SQL_ERROR:
            return 'DashboardPage.interfaceConfigurationError.sqlError';
        case ErrorCodes.UNAUTHORIZED:
            return 'DashboardPage.interfaceConfigurationError.unauthorized';
        case ErrorCodes.NO_AVAILABLE_IP:
            return 'DashboardPage.interfaceConfigurationError.noAvailableIP';
        case ErrorCodes.CREATE_CONFIG_FAILED:
            return 'DashboardPage.interfaceConfigurationError.createConfigFailed';
        case ErrorCodes.CREATE_INTERFACE_FAILED:
            return 'DashboardPage.interfaceConfigurationError.createInterfaceFailed';
        case ErrorCodes.DELETE_INTERFACE_FAILED:
            return 'DashboardPage.interfaceConfigurationError.deleteInterfaceFailed';
        case ErrorCodes.GET_IP_FAILED:
            return 'DashboardPage.interfaceConfigurationError.getIPFailed';
        default:
            console.error(error);
            return 'DashboardPage.interfaceConfigurationError.unknownError';
    }
};
