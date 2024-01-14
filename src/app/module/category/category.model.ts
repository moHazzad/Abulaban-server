import mongoose, { model, Schema } from "mongoose";
import { TRoomCategory } from "./category.interface";
import AppError from "../../Error/errors/AppError";
import httpStatus from "http-status";

// Define BedroomInfo schema as a subdocument

const localizedFeatureSchema = new mongoose.Schema({
  en: { type: String,  required: [true, 'en category title is required'] },
  ar: { type: String, required: [true, 'Ar category title is required'] }
});

const BedroomInfoSchema = new Schema({
  bedroomNumber: { type: Number, required: true },
  beds: localizedFeatureSchema
});

// Define RoomCategorySchema
const RoomCategorySchema = new Schema<TRoomCategory>({
  categoryTitle: localizedFeatureSchema ,
  bedrooms: [BedroomInfoSchema]  // Array of BedroomInfo subdocuments
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
RoomCategorySchema.pre('save', async function (next) {
  if (this.isModified('categoryTitle')) {
    // Assuming you want to check for existing categories by English title
    const existingCategory = await CategoryModel.findOne({ 'categoryTitle.en': this.categoryTitle.en });
    if (existingCategory) {
        return next(new AppError(httpStatus.BAD_REQUEST, `A Category with '${this.categoryTitle.en}' already exists`));
    }
  }
  next();
});


// Create and export the model
export const CategoryModel = model<TRoomCategory>('Category', RoomCategorySchema);
