"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-explicit-any */
const mongoose_1 = __importDefault(require("mongoose"));
// import { TErrorResponse } from '../../types/TErrorResponse'
// import handlerDuplicateError from './handleDuplicateError'
// import handleValidationError from './handlerValidationError'
// import handlerCastError from './handlerCastError'
// import handlerGenericError from './handlerGenericError'
// import GenericError from '../../classes/errorClasses/GenericError'
const zod_1 = require("zod");
// import handlerZodError from './handleZodError'
// import { TErrorResponse } from '../interface/TErrorResposne'
// import handleCastError from './handleCastError'
const GenericError_1 = __importDefault(require("../classError/GenericError"));
// import handleGenericError from './handleGenericError'
const handleValidationError_1 = __importDefault(require("./handleValidationError"));
const handleCastError_1 = __importDefault(require("./handleCastError"));
const handlerDuplicateError_1 = __importDefault(require("./handlerDuplicateError"));
const handleGenericError_1 = __importDefault(require("./handleGenericError"));
const handlerZodError_1 = __importDefault(require("./handlerZodError"));
const errorPreprocessor = (err) => {
    if (err instanceof zod_1.ZodError) {
        return (0, handlerZodError_1.default)(err);
    }
    else if (err instanceof mongoose_1.default.Error.ValidationError) {
        return (0, handleValidationError_1.default)(err);
    }
    else if (err.code && err.code === 11000) {
        return (0, handlerDuplicateError_1.default)(err);
    }
    else if (err instanceof mongoose_1.default.Error.CastError) {
        return (0, handleCastError_1.default)(err);
    }
    else if (err instanceof GenericError_1.default) {
        return (0, handleGenericError_1.default)(err);
    }
    else {
        return {
            statusCode: 500,
            status: 'error',
            message: 'Unknown Error',
            issues: [
                {
                    path: '',
                    message: err.message,
                },
            ],
        };
        // errorResponse = handlerGenericError(err)
    }
};
exports.default = errorPreprocessor;
