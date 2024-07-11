"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtHelpers = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createToken = (jwtPayload, secret, options) => {
    return jsonwebtoken_1.default.sign(jwtPayload, secret, options);
};
const verifyToken = (token, secret) => {
    try {
        return jsonwebtoken_1.default.verify(token, secret);
    }
    catch (error) {
        throw new Error('Invalid token');
    }
};
exports.jwtHelpers = {
    createToken,
    verifyToken,
};
// import jwt, { JwtPayload } from 'jsonwebtoken'
// const createToken = (
//   jwtPayload: JwtPayload,
//   secret: string,
//   options: {
//     expiresIn: string
//   },
// ) => {
//   return jwt.sign(jwtPayload, secret, options)
// }
// const verifyToken = (token: string, secret: string) => {
//   return jwt.verify(token, secret)
// }
// export const jwtHelpers = {
//   createToken,
//   verifyToken,
// }
