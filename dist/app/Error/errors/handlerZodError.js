"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlerZodError = (err) => {
    const issues = err.issues.map((issue) => {
        return {
            path: issue.path[issue.path.length - 1],
            message: issue.message,
        };
    });
    return {
        statusCode: 400,
        status: 'error',
        message: 'Validation Error',
        issues,
    };
};
exports.default = handlerZodError;
