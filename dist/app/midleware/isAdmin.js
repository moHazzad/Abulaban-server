"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../Error/errors/AppError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const isAdmin = (...requiredRoles) => {
    return (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const token = req.headers.authorization;
        // checking if the token is missing
        if (!token) {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'You are not authorized to access this resource.');
        }
        try {
            // checking if the given token is valid
            const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_access_token);
            const { role } = decoded;
            if (requiredRoles.length && !requiredRoles.includes(role)) {
                throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to perform this action.');
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                // Handle any error related to JWT validation (expired, malformed, etc.)
                throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Invalid or expired Login time. Please log in again.');
            }
            else {
                // Handle other possible errors
                throw new AppError_1.default(http_status_1.default.INTERNAL_SERVER_ERROR, 'An error occurred while processing your request.');
            }
        }
    }));
};
exports.default = isAdmin;
// import { Request, Response, NextFunction } from 'express';
// import jwt, { JwtPayload, } from 'jsonwebtoken';
// import httpStatus from 'http-status';
// import config from '../config';
// import AppError from '../Error/errors/AppError';
// import catchAsync from '../utils/catchAsync';
// import { TUserRole } from '../module/user/user.interface';
// const isAdmin = (...requiredRoles: TUserRole[] ) => {
//   return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers.authorization;
//     // checking if the token is missing
//     if (!token) {
//       throw new AppError(httpStatus.UNAUTHORIZED, 'You are not authorized!');
//     }
//     // checking if the given token is valid
//     const decoded = jwt.verify(
//         token,
//         config.jwt_access_token as string,
//       ) as JwtPayload;
//       const { role } = decoded;
//       if (requiredRoles && !requiredRoles.includes(role)) {
//         throw new AppError(
//           httpStatus.UNAUTHORIZED,
//           'You are not authorized  hi!',
//         );
//       }
//     req.user = decoded as JwtPayload
//     next();
//   });
// };
// export default isAdmin;
