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
exports.SubCategoryModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../Error/errors/AppError"));
// SubCategory schema definition
const subCategorySchema = new mongoose_1.Schema({
    Name: {
        en: { type: String, required: [true, 'English category title is required'] },
        ar: { type: String, required: [true, 'Arabic category title is required'] }
    },
    image: {
        type: String,
        match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)(\?.*)?$/, 'Please fill a valid image URL.']
    },
    CategoryId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category', // Replace 'MainCategory' with your main category model name if different
        required: true
    }
}, { timestamps: true });
// Pre-save middleware to check for duplicate category titles in English
subCategorySchema.pre('save', function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        if (this.isModified('categoryTitle')) {
            const existingCategory = yield exports.SubCategoryModel.findOne({ 'Name.en': this.Name.en });
            if (existingCategory) {
                throw new AppError_1.default(http_status_1.default.BAD_REQUEST, `A category with the title '${this.Name.en}' already exists.`);
            }
        }
        next();
    });
});
// Creating the model from the schema
exports.SubCategoryModel = mongoose_1.default.model('SubCategory', subCategorySchema);
