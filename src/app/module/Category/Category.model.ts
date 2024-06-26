import mongoose, { model, Schema } from "mongoose";
// import { TMainCategory } from "./Category.interface";
import httpStatus from "http-status";
import AppError from "../../Error/errors/AppError";
import { TCategory } from "./Category.interface";




const localizedCategorySchema = new mongoose.Schema({
    en: { type: String,  required: [true, 'en category title is required'] },
    ar: { type: String, required: [true, 'Ar category title is required'] }
  },{
    _id: false // Prevents Mongoose from creating `_id` for localized names
});

  const CategorySchema = new Schema<TCategory>({
    Name: localizedCategorySchema ,
    image: String ,
    // ParentCategory: { type: Schema.Types.ObjectId, default: null, ref: 'Category' } 
  },{
    timestamps: true // This adds createdAt and updatedAt fields automatically
});

  CategorySchema.pre('save', async function (next) {
    if (this.isModified('Name')) {
      // Assuming you want to check for existing categories by English title
      const existingCategory = await CategoryModel.findOne({ 'Name.en': this.Name.en });
      if (existingCategory) {
          return next(new AppError(httpStatus.BAD_REQUEST, `A Category with '${this.Name.en}' already exists`));
      }
    }
    next();
  });

  export const CategoryModel = model<TCategory>('Category', CategorySchema);