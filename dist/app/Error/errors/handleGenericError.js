"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleGenericError = (err) => {
    const issues = [
        {
            path: '',
            message: err.message,
        },
    ];
    return {
        statusCode: err.statusCode,
        status: 'error',
        message: 'Generic Error',
        issues,
    };
};
exports.default = handleGenericError;
