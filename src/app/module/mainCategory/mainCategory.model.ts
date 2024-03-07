import mongoose, { model, Schema } from "mongoose";
import { TMainCategory } from "./mainCategory.interface";
import httpStatus from "http-status";
import AppError from "../../Error/errors/AppError";




const localizedMainCategorySchema = new mongoose.Schema({
    en: { type: String,  required: [true, 'en category title is required'] },
    ar: { type: String, required: [true, 'Ar category title is required'] }
  });

  const mainCategorySchema = new Schema<TMainCategory>({
    Name: localizedMainCategorySchema ,
    ParentCategory: { type: Schema.Types.ObjectId, default: null, ref: 'Category' } 
  });

  mainCategorySchema.pre('save', async function (next) {
    if (this.isModified('Name')) {
      // Assuming you want to check for existing categories by English title
      const existingCategory = await MainCategoryModel.findOne({ 'Name.en': this.Name.en });
      if (existingCategory) {
          return next(new AppError(httpStatus.BAD_REQUEST, `A Category with '${this.Name.en}' already exists`));
      }
    }
    next();
  });

  export const MainCategoryModel = model<TMainCategory>('mainCategory', mainCategorySchema);