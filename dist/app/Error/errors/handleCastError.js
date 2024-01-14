"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleCastError = (err) => {
    const issues = [
        {
            path: err.path,
            message: err.message,
        },
    ];
    return {
        statusCode: 400,
        status: 'error',
        message: 'Cast Error',
        issues,
    };
};
exports.default = handleCastError;
