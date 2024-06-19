"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// import { TErrorIssue, TErrorResponse } from '../interface/TErrorResposne'
// import { TErrorIssue, TErrorResponse } from '../../types/TErrorResponse'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handlerDuplicateError = (err) => {
    // MongoDB error for duplicate key
    const fieldName = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[fieldName];
    return {
        statusCode: 409,
        status: 'error',
        message: `Duplicate field value: ${fieldName} -> ${value}. Please use another value!`,
        issues: [{ path: fieldName, message: `Duplicate field value: ${value}. Please use another value!` }],
    };
};
// const handlerDuplicateError = (
//   err: mongoose.Error.ValidationError,
// ): TErrorResponse => {
//   const regex = /"(.*?)"/
//   const matches = err.message.match(regex)
//   const issues: TErrorIssue[] = [
//     {
//       path: '',
//       message: `Duplicate value for ${matches![1]}`,
//     },
//   ]
//   return {
//     statusCode: 409,
//     status: 'error',
//     message: 'Duplicate Error',
//     issues,
//   }
// }
exports.default = handlerDuplicateError;
