import mongoose, { Schema } from "mongoose";
import httpStatus from "http-status";
import AppError from "../../Error/errors/AppError";
import { TSubCategory } from "./subCategory.interface";


// SubCategory schema definition
const subCategorySchema = new Schema<TSubCategory>({
  Name: {
      en: { type: String, required: [true, 'English category title is required'] },
      ar: { type: String, required: [true, 'Arabic category title is required'] }
    },
    image: {
      type: String,
      match: [/^https?:\/\/.+\.(jpg|jpeg|png|gif)(\?.*)?$/, 'Please fill a valid image URL.']
    },    
    CategoryId: { 
      type: Schema.Types.ObjectId, 
      ref: 'Category', // Replace 'MainCategory' with your main category model name if different
      required: true 
    }
  },{timestamps:true});

// Pre-save middleware to check for duplicate category titles in English
subCategorySchema.pre('save', async function(next) {
  if (this.isModified('categoryTitle')) {
    const existingCategory = await SubCategoryModel.findOne({ 'Name.en': this.Name.en });
    if (existingCategory) {
      throw new AppError(httpStatus.BAD_REQUEST, `A category with the title '${this.Name.en}' already exists.`);
    }
  }
  next();
});

// Creating the model from the schema
export const SubCategoryModel = mongoose.model<TSubCategory>('SubCategory', subCategorySchema);
