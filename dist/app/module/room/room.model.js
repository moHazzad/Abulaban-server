"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.RoomModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// import { RoomCategory, TRoom } from './room.interface';
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// const priceOptionSchema = new mongoose.Schema({
//   price: { type: Number, required: [true, 'Price is required'] },
//   currency: { type: String, required: [true, 'Currency is required'] },
//   // taxesAndCharges: { type: Number, required: [true, 'Taxes and charges are required'] },
//   breakfast: { type: String, required: [true, 'Breakfast information is required'] },
//   cancellation: { type: String, required: [true, 'Cancellation policy is required'] },
//   prepayment: { type: String, required: [true, 'Prepayment information is required'] },
//   refundable: { type: Boolean, required: [true, 'Refundable status is required'] },
// });
// const roomSchema = new mongoose.Schema({
//   title: { type: String, required: [true, 'Room title is required'] },
//   // type: { type: [RoomCategorySchema], required: [true, 'Price options are required'] },
//   type: {
//     type: Schema.Types.ObjectId,
//     ref: 'Category',
//     required: true,
// },
//   description: { type: String, required: [true, 'Room description is required'] },
//   maxGuests: { type: Number, required: [true, 'Maximum number of guests is required'] },
//   roomQTY: { type: Number, required: [true, 'Room quantity is required'] },
//   size: { type: String, required: [true, 'Room size is required'] },
//   features: { type: [{ type: String, required: true }], required: [true, 'Room features are required'] },
//   images: { type: [{ type: String, required: true }], required: [true, 'Room images are required'] },
//   priceOptions: { type: [priceOptionSchema], required: [true, 'Price options are required'] },
//   isDeleted: { type: Boolean, default: false },
//   isActive: { type: Boolean, default: true },
// }, { timestamps: true });\
const localizedFeatureSchema = new mongoose_1.default.Schema({
    en: { type: String, required: true },
    ar: { type: String, required: true },
    icon: { type: String }
});
const priceOptionSchema = new mongoose_1.default.Schema({
    price: { type: Number, required: [true, 'Price is required'] },
    currency: { type: String, required: [true, 'Currency is required'] },
    taxesAndCharges: { type: String, required: [true, 'Taxes and charges are required'] },
    breakfast: {
        en: { type: String, required: [true, 'English breakfast information is required'] },
        ar: { type: String, required: [true, 'Arabic breakfast information is required'] }
    },
    cancellation: {
        en: { type: String, required: [true, 'English cancellation policy is required'] },
        ar: { type: String, required: [true, 'Arabic cancellation policy is required'] }
    },
    prepayment: {
        en: { type: String, required: [true, 'English prepayment information is required'] },
        ar: { type: String, required: [true, 'Arabic prepayment information is required'] }
    },
    refundable: { type: Boolean, required: [true, 'Refundable status is required'] },
});
const roomSchema = new mongoose_1.default.Schema({
    title: {
        en: { type: String, required: [true, 'English room title is required'] },
        ar: { type: String, required: [true, 'Arabic room title is required'] }
    },
    description: {
        en: { type: String, required: [true, 'English room description is required'] },
        ar: { type: String, required: [true, 'Arabic room description is required'] }
    },
    maxGuests: { type: Number, required: [true, 'Maximum number of guests is required'] },
    roomQTY: { type: Number, required: [true, 'Room quantity is required'] },
    size: {
        en: { type: String, required: [true, 'English room size is required'] },
        ar: { type: String, required: [true, 'Arabic room size is required'] }
    },
    features: [localizedFeatureSchema],
    services: [localizedFeatureSchema],
    images: { type: [{ type: String, required: true }], required: [true, 'Room images are required'] },
    priceOptions: { type: [priceOptionSchema], required: [true, 'Price options are required'] },
    isDeleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    type: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    }
}, { timestamps: true });
roomSchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        // console.log(`Checking for existing room with type: ${this.type}, maxGuests: ${this.maxGuests}`);
        if (this.isNew || this.isModified('title')) {
            const existingRoom = yield exports.RoomModel.findOne({
                _id: { $ne: this._id }, // Exclude the current document
                title: this.title,
            });
            if (existingRoom) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, 'A room with this title already exists.');
            }
        }
        next();
    });
});
exports.RoomModel = (0, mongoose_1.model)('Room', roomSchema);
