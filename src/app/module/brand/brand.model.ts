import mongoose, { Schema, model } from 'mongoose';
import { TBrand } from './brand.interface';
import AppError from '../../Error/errors/AppError';
import httpStatus from 'http-status';

const localizedBrandSchema = new mongoose.Schema(
  {
    en: { type: String, required: [true, 'en Brand Name is required'] },
    ar: { type: String, required: [true, 'Ar Brand Name is required'] },
  },
  {
    _id: false, // Prevents Mongoose from creating `_id` for localized names
  },
);

const brandSchema = new Schema<TBrand>(
  {
    Name: localizedBrandSchema,
    image: String ,
  },
  {
    timestamps: true, // This adds createdAt and updatedAt fields automatically
  },
);

brandSchema.pre('save', async function (next) {
  if (this.isModified('Name')) {
    // Assuming you want to check for existing categories by English title
    const existingCategory = await BrandModel.findOne({
      'Name.en': this.Name.en,
    });
    if (existingCategory) {
      return next(
        new AppError(
          httpStatus.BAD_REQUEST,
          `A Brand Name with '${this.Name.en}' already exists`,
        ),
      );
    }
  }
  next();
});

export const BrandModel = model<TBrand>('Brand', brandSchema);
