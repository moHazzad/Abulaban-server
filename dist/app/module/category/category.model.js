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
exports.CategoryModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
const http_status_1 = __importDefault(require("http-status"));
// Define BedroomInfo schema as a subdocument
const localizedFeatureSchema = new mongoose_1.default.Schema({
    en: { type: String, required: [true, 'en category title is required'] },
    ar: { type: String, required: [true, 'Ar category title is required'] }
});
const BedroomInfoSchema = new mongoose_1.Schema({
    bedroomNumber: { type: Number },
    beds: localizedFeatureSchema
});
// Define RoomCategorySchema
const RoomCategorySchema = new mongoose_1.Schema({
    categoryTitle: localizedFeatureSchema,
    bedrooms: [BedroomInfoSchema] // Array of BedroomInfo subdocuments
});
// RoomCategorySchema.pre('save', async function (next) {
//     if (this.isModified('categoryTitle')) {
//       const existingCategory = await CategoryModel.findOne({ categoryTitle: this.categoryTitle });
//       if (existingCategory) {
//           return  next( new AppError(httpStatus.BAD_REQUEST, `a Category with '${this.categoryTitle}' already exists`))
//       }
//     }
//     next();
//   });
RoomCategorySchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('categoryTitle')) {
            // Assuming you want to check for existing categories by English title
            const existingCategory = yield exports.CategoryModel.findOne({ 'categoryTitle.en': this.categoryTitle.en });
            if (existingCategory) {
                return next(new AppError_1.default(http_status_1.default.BAD_REQUEST, `A Category with '${this.categoryTitle.en}' already exists`));
            }
        }
        next();
    });
});
// Create and export the model
exports.CategoryModel = (0, mongoose_1.model)('Category', RoomCategorySchema);
